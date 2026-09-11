import { X } from 'lucide-react';
import React from 'react';
import {
    Customer,
    CustomerPriority,
    PRIORITY_LABELS,
    SERVICE_LABELS,
    STATUS_LABELS
} from '../schemas';
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
    uniqueCustomers: (Customer | undefined)[];
}

interface ActiveFilter {
    key: string;
    group: string;
    label: string;
    onRemove: () => void;
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
    const getCustomerName = (customerId: string) => {
        const customer = uniqueCustomers.find(c => c?.id === customerId);
        return customer?.name || 'Unknown Customer';
    };

    const activeFilters: ActiveFilter[] = [
        ...filters.services.map((service) => ({
            key: `service-${service}`,
            group: 'Service',
            label: SERVICE_LABELS[service],
            onRemove: () => onRemoveService(service)
        })),
        ...filters.statuses.map((status) => ({
            key: `status-${status}`,
            group: 'Status',
            label: STATUS_LABELS[status],
            onRemove: () => onRemoveStatus(status)
        })),
        ...filters.priorities.map((priority) => ({
            key: `priority-${priority}`,
            group: 'Priority',
            label: PRIORITY_LABELS[Number(priority) as CustomerPriority],
            onRemove: () => onRemovePriority(priority)
        })),
        ...filters.customers.map((customerId) => ({
            key: `customer-${customerId}`,
            group: 'Customer',
            label: getCustomerName(customerId),
            onRemove: () => onRemoveCustomer(customerId)
        }))
    ];

    if (activeFilters.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {activeFilters.map(({ key, group, label, onRemove }) => (
                <Badge key={key} variant="secondary" className="pr-1 font-normal">
                    <span className="text-muted-foreground">{group}:</span>
                    <span className="font-medium">{label}</span>
                    <button
                        type="button"
                        aria-label={`Remove ${group.toLowerCase()} filter ${label}`}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-secondary-foreground/20"
                        onClick={onRemove}
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            ))}

            <Button variant="ghost" size="sm" onClick={onClearAll} className="h-6 px-2 text-xs">
                Clear all
            </Button>
        </div>
    );
};

export default FilterBadges;
