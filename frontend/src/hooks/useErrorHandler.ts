import { useCallback, useState } from "react";
import { AppError } from "../lib/errorHandler";

export interface ErrorState {
  error: AppError | null;
  isError: boolean;
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
  });

  const handleError = useCallback(
    (error: unknown, fallbackMessage?: string) => {
      const appError =
        error instanceof AppError
          ? error
          : new AppError(
              error instanceof Error
                ? error.message
                : fallbackMessage || "An unexpected error occurred"
            );

      setErrorState({
        error: appError,
        isError: true,
      });
    },
    []
  );

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
    });
  }, []);

  const reset = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    ...errorState,
    handleError,
    clearError,
    reset,
  };
};
