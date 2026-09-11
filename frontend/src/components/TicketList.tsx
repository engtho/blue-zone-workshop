import { Inbox, SlidersHorizontal, TicketIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useTicketFilters } from '../hooks/useTicketFilters';
import { useResolveTicket, useTicketsSorted } from '../hooks/useTickets';
import { TicketWithCustomer } from '../schemas';
import { TicketFilters as TicketFiltersType } from '../types/filters';
import { EmptyState } from './EmptyState';
import { ErrorMessage } from './ErrorMessage';
import { TicketListSkeleton } from './LoadingSkeletons';
import TicketCard from './TicketCard';
import TicketFilters from './TicketFilters';
import TicketStats from './TicketStats';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const EMPTY_FILTERS: TicketFiltersType = {
    services: [],
    statuses: [],
    priorities: [],
    customers: []
};

const countActiveFilters = (filters: TicketFiltersType) =>
    Object.values(filters).reduce(
        (total, filter) => total + (Array.isArray(filter) ? filter.length : 0),
        0
    );

const TicketList: React.FC = () => {
    const { tickets, isLoading, isError, error } = useTicketsSorted();

    const {
        resolveTicket,
        resolvingTicketId,
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

    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    if (isLoading) return <TicketListSkeleton />;

    if (isError) return (
        <ErrorMessage
            error={error}
            onRetry={() => window.location.reload()}
            title="Failed to load tickets"
            description="Unable to fetch tickets from the server. This might be due to a network issue or the backend service being unavailable."
        />
    );

    const activeFilterCount = countActiveFilters(filters);

    return (
        <Card>
            <CardHeader className="gap-4 space-y-0 border-b p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <TicketIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                            Support Tickets
                        </CardTitle>
                        <CardDescription>
                            {hasActiveFilters
                                ? `Showing ${filteredTickets.length} of ${tickets.length} tickets`
                                : 'Real-time ticket management and monitoring'}
                        </CardDescription>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFilterPanelOpen((isOpen) => !isOpen)}
                        aria-expanded={isFilterPanelOpen}
                    >
                        <SlidersHorizontal aria-hidden="true" />
                        Filters
                        {activeFilterCount > 0 && (
                            <Badge variant="default" className="px-1.5">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </Button>
                </div>

                <TicketStats tickets={tickets} />

                {(isFilterPanelOpen || hasActiveFilters) && (
                    <TicketFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        uniqueCustomers={uniqueCustomers}
                        isExpanded={isFilterPanelOpen}
                    />
                )}
            </CardHeader>

            <CardContent className="space-y-3 p-3 sm:p-4">
                {isResolveError && resolveError && (
                    <ErrorMessage
                        error={resolveError}
                        title="Failed to resolve ticket"
                        description="The ticket status could not be updated. Please try again."
                        showRetry={false}
                    />
                )}

                {tickets.length === 0 ? (
                    <EmptyState
                        icon={Inbox}
                        title="No tickets yet"
                        description="Create a service alarm to generate support tickets."
                    />
                ) : filteredTickets.length === 0 ? (
                    <EmptyState
                        icon={SlidersHorizontal}
                        title="No tickets match the current filters"
                        description="Try removing one or more filters to see more results."
                        action={
                            <Button variant="outline" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                                Clear filters
                            </Button>
                        }
                    />
                ) : (
                    filteredTickets.map((ticket: TicketWithCustomer) => (
                        <TicketCard
                            key={ticket.ticketId}
                            ticket={ticket}
                            onResolve={resolveTicket}
                            isResolving={resolvingTicketId === ticket.ticketId}
                        />
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default TicketList;
