import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RadioTower } from 'lucide-react';
import AlarmCreator from './components/AlarmCreator';
import { ErrorBoundary } from './components/ErrorBoundary';
import TicketList from './components/TicketList';
import { Toaster } from './components/ui/sonner';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 1000, // Data is fresh for 5 seconds
            refetchOnWindowFocus: false, // Don't refetch on window focus
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <div className="min-h-screen bg-muted/30 text-foreground">
                    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
                        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <RadioTower className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <div className="leading-tight">
                                    <p className="font-semibold tracking-tight">Blue Zone</p>
                                    <p className="text-xs text-muted-foreground">
                                        Telecom Incident Management
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <span className="relative flex h-2 w-2" aria-hidden="true">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                                </span>
                                <span className="hidden sm:inline">Live · refreshes every 10s</span>
                                <span className="sm:hidden">Live</span>
                            </div>
                        </div>
                    </header>

                    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
                        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                            <div className="lg:col-span-1 lg:sticky lg:top-24">
                                <AlarmCreator />
                            </div>

                            <div className="lg:col-span-2">
                                <TicketList />
                            </div>
                        </div>
                    </main>

                    <footer className="border-t bg-background">
                        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
                            <p>Blue Zone Workshop</p>
                            <p>Event-driven microservices with Kafka</p>
                        </div>
                    </footer>
                </div>
                <Toaster />
            </ErrorBoundary>
        </QueryClientProvider>
    );
}

export default App;
