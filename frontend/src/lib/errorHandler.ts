import { ApiError } from "../types";

export class AppError extends Error {
  public readonly code?: string;
  public readonly details?: Record<string, unknown>;
  public readonly statusCode?: number;

  constructor(
    message: string,
    code?: string,
    details?: Record<string, unknown>,
    statusCode?: number
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details;
    this.statusCode = statusCode;
  }
}

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ApiError).message === "string"
  );
};

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export const createAppError = (
  error: unknown,
  fallbackMessage = "An unexpected error occurred"
): AppError => {
  if (isAppError(error)) {
    return error;
  }

  if (isApiError(error)) {
    return new AppError(error.message, error.code, error.details);
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError(fallbackMessage);
};

export const handleApiError = async (response: Response): Promise<never> => {
  let errorData: ApiError;

  try {
    errorData = await response.json();
  } catch {
    errorData = {
      message: `HTTP ${response.status}: ${response.statusText}`,
      code: response.status.toString(),
    };
  }

  throw new AppError(
    errorData.message,
    errorData.code,
    errorData.details,
    response.status
  );
};
