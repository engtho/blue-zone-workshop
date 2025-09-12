import { Component, ErrorInfo, ReactNode } from 'react';
import { AppError } from '../lib/errorHandler';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        console.log(error)
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        });

        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const { error } = this.state;
            const isAppError = error instanceof AppError;

            return (
                <Card className="w-full max-w-md mx-auto mt-8">
                    <CardHeader>
                        <CardTitle className="text-destructive">Something went wrong</CardTitle>
                        <CardDescription>
                            An unexpected error occurred. Please try again.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {process.env.NODE_ENV === 'development' && error && (
                            <div className="p-3 bg-muted rounded-md">
                                <p className="text-sm font-medium text-muted-foreground">Error Details:</p>
                                <p className="text-sm text-destructive font-mono">
                                    {isAppError ? error.message : error.toString()}
                                </p>
                                {isAppError && error.code && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Code: {error.code}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button onClick={this.handleReset} className="flex-1">
                                Try Again
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="flex-1"
                            >
                                Reload Page
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return this.props.children;
    }
}
