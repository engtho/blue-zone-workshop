import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppError, createAppError } from "../lib/errorHandler";
import {
  AlarmEvent,
  CreateAlarmFormData,
  CreateAlarmRequest,
} from "../schemas";
import { useErrorHandler } from "./useErrorHandler";

// Alarm Service API
const createAlarm = async (alarm: CreateAlarmRequest): Promise<AlarmEvent> => {
  const response = await fetch("/api/alarms", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(alarm),
  });
  if (!response.ok) throw new Error("Failed to create alarm");
  return response.json();
};

export const useCreateAlarm = () => {
  const queryClient = useQueryClient();
  const { handleError, clearError, error, isError } = useErrorHandler();

  const mutation = useMutation<AlarmEvent, AppError, CreateAlarmFormData>({
    mutationFn: async (alarmData: CreateAlarmFormData) => {
      try {
        clearError();
        console.log("Creating alarm with data:", alarmData);
        // Convert form data to API request format
        const apiRequest: CreateAlarmRequest = {
          service: alarmData.service,
          impact: alarmData.impact,
          affectedCustomers: alarmData.affectedCustomers,
        };
        console.log("API request:", apiRequest);
        const result = await createAlarm(apiRequest);
        console.log("API response:", result);
        return result;
      } catch (error) {
        console.error("Alarm creation error:", error);
        const appError = createAppError(error, "Failed to create alarm");
        handleError(appError);
        throw appError;
      }
    },
    onSuccess: (data) => {
      // Invalidate tickets query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      console.log("Alarm created successfully:", data);
      toast.success("Alarm created successfully", {
        description: `Service: ${data.service} - Impact: ${data.impact}`,
      });
    },
    onError: (error) => {
      console.error("Alarm creation failed:", error);
      toast.error("Failed to create alarm", {
        description: error.message || "An unexpected error occurred",
      });
    },
  });

  return {
    createAlarm: mutation.mutate,
    createAlarmAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError,
    error,
    reset: () => {
      mutation.reset();
      clearError();
    },
  };
};
