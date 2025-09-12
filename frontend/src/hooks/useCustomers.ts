import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppError, createAppError } from "../lib/errorHandler";
import { Customer } from "../schemas";
import { useErrorHandler } from "./useErrorHandler";

// Customer Service API
export const getCustomer = async (id: string): Promise<Customer> => {
  // TODO: TASK 5
  throw new Error("TASK 5: Not implemented");
};

export const useCustomers = () => {
  const { handleError, clearError, error, isError } = useErrorHandler();

  const query = useQuery<Customer[], AppError>({
    queryKey: ["customers"],
    queryFn: async () => {
      try {
        clearError();
        // For now, we'll fetch individual customers since we don't have a batch endpoint
        // This should be replaced with a proper batch endpoint
        const customerIds = ["c-42", "c-7", "c-100", "c-200", "c-300"];
        const customers = await Promise.all(
          customerIds.map((id) => getCustomer(id))
        );
        return customers;
      } catch (error) {
        const appError = createAppError(error, "Failed to fetch customers");
        handleError(appError);
        toast.error("Failed to load customers", {
          description: "Unable to fetch customer data. Please try again.",
        });
        throw appError;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    customers: query.data || [],
    isLoading: query.isLoading,
    isError: isError || query.isError,
    error: error || query.error,
    refetch: query.refetch,
    reset: clearError,
  };
};

export const useCustomer = (customerId: string) => {
  const { handleError, clearError, error, isError } = useErrorHandler();

  const query = useQuery<Customer, AppError>({
    queryKey: ["customers", customerId],
    queryFn: async () => {
      try {
        clearError();
        return await getCustomer(customerId);
      } catch (error) {
        const appError = createAppError(
          error,
          `Failed to fetch customer ${customerId}`
        );
        handleError(appError);
        toast.error("Failed to load customer", {
          description: `Unable to fetch customer ${customerId}. Please try again.`,
        });
        throw appError;
      }
    },
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    customer: query.data,
    isLoading: query.isLoading,
    isError: isError || query.isError,
    error: error || query.error,
    refetch: query.refetch,
    reset: clearError,
  };
};

export const useCustomersByIds = (customerIds: string[]) => {
  const { handleError, clearError, error, isError } = useErrorHandler();

  const query = useQuery<Customer[], AppError>({
    queryKey: ["customers", "batch", customerIds.sort()],
    queryFn: async () => {
      try {
        clearError();
        if (customerIds.length === 0) return [];

        // Fetch all customers in parallel
        const customers = await Promise.all(
          customerIds.map((id) => getCustomer(id))
        );
        return customers;
      } catch (error) {
        const appError = createAppError(error, "Failed to fetch customers");
        handleError(appError);
        toast.error("Failed to load customers", {
          description: "Unable to fetch customer data. Please try again.",
        });
        throw appError;
      }
    },
    enabled: customerIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    customers: query.data || [],
    isLoading: query.isLoading,
    isError: isError || query.isError,
    error: error || query.error,
    refetch: query.refetch,
    reset: clearError,
  };
};
