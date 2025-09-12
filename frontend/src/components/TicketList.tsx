import React from 'react';
import { useTicketFilters } from '../hooks/useTicketFilters';
import { useResolveTicket, useTicketsSorted } from '../hooks/useTickets';
import {
    PRIORITY_LABELS,
    STATUS_LABELS,
    TicketWithCustomer
} from '../schemas';
import { ErrorMessage } from './ErrorMessage';
import { TicketListSkeleton } from './LoadingSkeletons';
import TicketFilters from './TicketFilters';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';


const TicketList: React.FC = () => {
    const {
        tickets,
        isLoading,
        isError,
        error
    } = useTicketsSorted();

    const {
        resolveTicket,
        isResolving,
        isError: isResolveError,
        error: resolveError
    } = useResolveTicket();

    // Use the custom filter hook
    const {
        filters,
        setFilters,
        filteredTickets,
        uniqueCustomers,
        hasActiveFilters
    } = useTicketFilters(tickets);


    const getPriorityBadge = (priority?: number) => {
        const priorityValue = priority || 2; // Default to STANDARD
        if (priorityValue === 1) { // CRITICAL
            return <Badge variant="destructive">{PRIORITY_LABELS[1]}</Badge>;
        }
        return <Badge variant="secondary">{PRIORITY_LABELS[priorityValue as 1 | 2 | 3]}</Badge>;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "OPEN":
                return <Badge variant="default">{STATUS_LABELS[status]}</Badge>;
            case "RESOLVED":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{STATUS_LABELS[status]}</Badge>;
            case "IN_PROGRESS":
                return <Badge variant="secondary">{STATUS_LABELS[status]}</Badge>;
            case "CLOSED":
                return <Badge variant="outline">{STATUS_LABELS[status]}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (isLoading) return <TicketListSkeleton />;

    if (isError) return (
        <ErrorMessage
            error={error}
            onRetry={() => window.location.reload()}
            title="Failed to load tickets"
            description="Unable to fetch tickets from the server. This might be due to a network issue or the backend service being unavailable."
        />
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>
                            Support Tickets ({filteredTickets.length})
                            {hasActiveFilters && (
                                <span className="text-sm font-normal text-muted-foreground ml-2">
                                    (filtered from {tickets.length})
                                </span>
                            )}
                        </CardTitle>
                        <CardDescription>
                            Real-time ticket management and monitoring
                        </CardDescription>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="mt-4">
                    <TicketFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        uniqueCustomers={uniqueCustomers}
                    />
                </div>
            </CardHeader>
            <CardContent>
                {tickets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No tickets found. Create an alarm to generate tickets.</p>
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No tickets match the current filters.</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFilters({
                                services: [],
                                statuses: [],
                                priorities: [],
                                customers: []
                            })}
                            className="mt-2"
                        >
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTickets.map((ticket: TicketWithCustomer) => (
                            <Card key={ticket.ticketId} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl">
                                                Ticket #{ticket.ticketId.slice(0, 8)}
                                            </CardTitle>
                                            <CardDescription className="text-base">
                                                {ticket.description}
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            {getPriorityBadge(ticket.customer?.priority)}
                                            {getStatusBadge(ticket.status)}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Customer Information Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm font-semibold text-muted-foreground mb-1">Customer</p>
                                                <p className="text-base font-medium">{ticket.customer?.name || ticket.customerId}</p>
                                            </div>

                                            {ticket.customer && (
                                                <>
                                                    <div>
                                                        <p className="text-sm font-semibold text-muted-foreground mb-1">Contact</p>
                                                        <div className="space-y-1">
                                                            <p className="text-sm">{ticket.customer.email}</p>
                                                            <p className="text-sm">{ticket.customer.phone}</p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-semibold text-muted-foreground mb-1">Services</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {ticket.customer.services.map((service, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {service}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {ticket.customer && (
                                                <div>
                                                    <p className="text-sm font-semibold text-muted-foreground mb-1">Region</p>
                                                    <p className="text-sm">{ticket.customer.region}</p>
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-sm font-semibold text-muted-foreground mb-1">Alarm ID</p>
                                                <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{ticket.alarmId.slice(0, 8)}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-muted-foreground mb-1">Created</p>
                                                <p className="text-sm">{new Date(ticket.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Section */}
                                    {ticket.status === "OPEN" && (
                                        <div className="pt-4 border-t">
                                            <Button
                                                onClick={() => resolveTicket(ticket.ticketId)}
                                                className="w-full md:w-auto"
                                                disabled={isResolving}
                                            >
                                                {isResolving ? 'Resolving...' : '✅ Resolve Ticket'}
                                            </Button>
                                            {isResolveError && resolveError && (
                                                <div className="mt-2 text-xs text-destructive">
                                                    Error: {resolveError.message}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TicketList;
