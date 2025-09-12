import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
                <div className="min-h-screen bg-background">
                    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4 mb-8">
                        <div className="max-w-7xl mx-auto text-center">
                            <h1 className="text-4xl font-bold mb-2">Blue Zone - Telecom Incident Management</h1>
                            <p className="text-lg opacity-90">Real-time monitoring and ticket management dashboard</p>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto px-4 pb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <AlarmCreator />
                            </div>

                            <div className="lg:col-span-2">
                                <TicketList />
                            </div>
                        </div>
                    </main>

                    <footer className="bg-muted/50 py-4 px-4 mt-8">
                        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
                            <p>Blue Zone Workshop - Kafka Microservices Demo</p>
                        </div>
                    </footer>
                </div>
                <Toaster />
            </ErrorBoundary>
        </QueryClientProvider>
    );
}

export default App;
