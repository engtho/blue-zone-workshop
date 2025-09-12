import { X } from 'lucide-react';
import React from 'react';
import { PRIORITY_LABELS, SERVICE_LABELS, STATUS_LABELS } from '../schemas';
import { TicketFilters } from '../types/filters';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface FilterBadgesProps {
    filters: TicketFilters;
    onRemoveService: (service: string) => void;
    onRemoveStatus: (status: string) => void;
    onRemovePriority: (priority: string) => void;
    onRemoveCustomer: (customerId: string) => void;
    onClearAll: () => void;
    uniqueCustomers: (any | undefined)[];
}

const FilterBadges: React.FC<FilterBadgesProps> = ({
    filters,
    onRemoveService,
    onRemoveStatus,
    onRemovePriority,
    onRemoveCustomer,
    onClearAll,
    uniqueCustomers
}) => {
    const hasActiveFilters = Object.values(filters).some(filter => Array.isArray(filter) && filter.length > 0);

    if (!hasActiveFilters) {
        return null;
    }

    const getCustomerName = (customerId: string) => {
        const customer = uniqueCustomers.find(c => c?.id === customerId);
        return customer?.name || 'Unknown Customer';
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Active Filters</h4>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="text-xs h-6 px-2"
                >
                    Clear All
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                {/* Service Badges */}
                {filters.services.map((service) => (
                    <Badge
                        key={`service-${service}`}
                        variant="secondary"
                        className="text-xs"
                    >
                        <span className="mr-1">Service:</span>
                        {SERVICE_LABELS[service as keyof typeof SERVICE_LABELS]}
                        <button
                            type="button"
                            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                            onClick={() => onRemoveService(service)}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}

                {/* Status Badges */}
                {filters.statuses.map((status) => (
                    <Badge
                        key={`status-${status}`}
                        variant="secondary"
                        className="text-xs"
                    >
                        <span className="mr-1">Status:</span>
                        {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                        <button
                            type="button"
                            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                            onClick={() => onRemoveStatus(status)}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}

                {/* Priority Badges */}
                {filters.priorities.map((priority) => (
                    <Badge
                        key={`priority-${priority}`}
                        variant="secondary"
                        className="text-xs"
                    >
                        <span className="mr-1">Priority:</span>
                        {PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS]}
                        <button
                            type="button"
                            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                            onClick={() => onRemovePriority(priority)}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}

                {/* Customer Badges */}
                {filters.customers.map((customerId) => (
                    <Badge
                        key={`customer-${customerId}`}
                        variant="secondary"
                        className="text-xs"
                    >
                        <span className="mr-1">Customer:</span>
                        {getCustomerName(customerId)}
                        <button
                            type="button"
                            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                            onClick={() => onRemoveCustomer(customerId)}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    );
};

export default FilterBadges;
