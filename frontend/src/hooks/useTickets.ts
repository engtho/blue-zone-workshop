import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import { AppError, createAppError } from "../lib/errorHandler";
import { Customer, Ticket, TicketWithCustomer } from "../schemas";
import { getCustomer } from "./useCustomers";
import { useErrorHandler } from "./useErrorHandler";

// Ticket Service API
const getTickets = async (): Promise<Ticket[]> => {
  const response = await fetch("/api/tickets");
  if (!response.ok) throw new Error("Failed to fetch tickets");
  return response.json();
};

const updateTicketStatus = async (
  ticketId: string,
  status: string
): Promise<Ticket> => {
  const response = await fetch(
    `/api/tickets/${ticketId}/status?status=${status}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!response.ok) throw new Error("Failed to update ticket status");
  return response.json();
};

export const useTickets = () => {
  const { handleError, clearError, error, isError } = useErrorHandler();

  const query = useQuery<TicketWithCustomer[], AppError>({
    queryKey: ["tickets"],
    queryFn: async () => {
      try {
        clearError();

        // Fetch tickets first
        const tickets = await getTickets();

        if (tickets.length === 0) {
          return [];
        }

        // Get unique customer IDs
        const customerIds = [
          ...new Set(tickets.map((ticket) => ticket.customerId)),
        ];

        // Fetch all customers in parallel (solving N+1 problem)
        const customers = await Promise.all(
          customerIds.map(async (customerId) => {
            try {
              const customer = await getCustomer(customerId);
              return customer;
            } catch (error) {
              console.warn(`Failed to fetch customer ${customerId}:`, error);
              return null; // Return null for failed customer fetches
            }
          })
        );

        // Create customer map for efficient lookup
        const customerMap = new Map(
          customers
            .filter(
              (customer: Customer | null): customer is Customer =>
                customer !== null
            )
            .map((customer: Customer) => [customer.id, customer])
        );

        // Combine tickets with customer data
        const ticketsWithCustomers: TicketWithCustomer[] = tickets.map(
          (ticket) => ({
            ...ticket,
            customer: customerMap.get(ticket.customerId) || undefined,
          })
        );

        return ticketsWithCustomers;
      } catch (error) {
        const appError = createAppError(error, "Failed to fetch tickets");
        handleError(appError);
        toast.error("Failed to load tickets", {
          description: "Unable to fetch ticket data. Please try again.",
        });
        throw appError;
      }
    },
    refetchInterval: 10000, // Auto-refresh every 10 seconds
    refetchIntervalInBackground: true,
    staleTime: 5000, // Data is fresh for 5 seconds
  });

  return {
    tickets: query.data || [],
    isLoading: query.isLoading,
    isError: isError || query.isError,
    error: error || query.error,
    refetch: query.refetch,
    reset: clearError,
  };
};

export const useTicketsSorted = () => {
  const { tickets, isLoading, isError, error, refetch, reset } = useTickets();

  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      const priorityA = a.customer?.priority || 2; // STANDARD
      const priorityB = b.customer?.priority || 2; // STANDARD
      return priorityA - priorityB;
    });
  }, [tickets]);

  return {
    tickets: sortedTickets,
    isLoading,
    isError,
    error,
    refetch,
    reset,
  };
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  const { handleError, clearError, error, isError } = useErrorHandler();

  const mutation = useMutation<
    Ticket,
    AppError,
    { ticketId: string; status: string }
  >({
    mutationFn: async ({ ticketId, status }) => {
      try {
        clearError();
        return await updateTicketStatus(ticketId, status);
      } catch (error) {
        const appError = createAppError(
          error,
          "Failed to update ticket status"
        );
        handleError(appError);
        throw appError;
      }
    },
    onSuccess: (data, variables) => {
      // Optimistically update the cache
      queryClient.setQueryData(
        ["tickets"],
        (oldTickets: TicketWithCustomer[] | undefined) => {
          if (!oldTickets) return oldTickets;

          return oldTickets.map((ticket) =>
            ticket.ticketId === variables.ticketId
              ? { ...ticket, status: variables.status }
              : ticket
          );
        }
      );

      console.log("Ticket status updated successfully:", data);
      toast.success("Ticket updated successfully", {
        description: `Status changed to ${variables.status}`,
      });
    },
    onError: (error) => {
      console.error("Ticket status update failed:", error);
      toast.error("Failed to update ticket", {
        description: error.message || "Unable to update ticket status",
      });
    },
  });

  return {
    updateTicketStatus: mutation.mutate,
    updateTicketStatusAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError,
    error,
    reset: () => {
      mutation.reset();
      clearError();
    },
  };
};

export const useResolveTicket = () => {
  const {
    updateTicketStatus,
    updateTicketStatusAsync,
    isUpdating,
    isSuccess,
    isError,
    error,
    reset,
  } = useUpdateTicketStatus();

  const resolveTicket = (ticketId: string) => {
    updateTicketStatus({ ticketId, status: "RESOLVED" });
  };

  const resolveTicketAsync = (ticketId: string) => {
    return updateTicketStatusAsync({ ticketId, status: "RESOLVED" });
  };

  return {
    resolveTicket,
    resolveTicketAsync,
    isResolving: isUpdating,
    isSuccess,
    isError,
    error,
    reset,
  };
};
