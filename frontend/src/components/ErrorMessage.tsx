import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { AppError } from "../lib/errorHandler";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface ErrorMessageProps {
    error: AppError | Error | null;
    onRetry?: () => void;
    onDismiss?: () => void;
    title?: string;
    description?: string;
    showRetry?: boolean;
    className?: string;
}

export const ErrorMessage = ({
    error,
    onRetry,
    onDismiss,
    title = "Something went wrong",
    description = "An unexpected error occurred. Please try again.",
    showRetry = true,
    className,
}: ErrorMessageProps) => {
    if (!error) return null;

    const isAppError = error instanceof AppError;
    const errorMessage = isAppError ? error.message : error.message;
    const errorCode = isAppError ? error.code : undefined;

    return (
        <Card className={`border-destructive/20 bg-destructive/5 ${className}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <CardTitle className="text-destructive text-lg">{title}</CardTitle>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-3 bg-destructive/10 rounded-md border border-destructive/20">
                    <p className="text-sm text-destructive font-medium">{errorMessage}</p>
                    {errorCode && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Error Code: {errorCode}
                        </p>
                    )}
                    {process.env.NODE_ENV === "development" && (
                        <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer">
                                Technical Details
                            </summary>
                            <pre className="text-xs text-muted-foreground mt-2 overflow-auto">
                                {error.stack}
                            </pre>
                        </details>
                    )}
                </div>

                <div className="flex gap-2">
                    {showRetry && onRetry && (
                        <Button
                            onClick={onRetry}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                    )}
                    {onDismiss && (
                        <Button
                            onClick={onDismiss}
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Dismiss
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
