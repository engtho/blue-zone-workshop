import React from 'react';
import {
    Customer,
    PRIORITY_LABELS,
    SERVICE_LABELS,
    STATUS_LABELS
} from '../schemas';
import { TicketFilters as TicketFiltersType } from '../types/filters';
import FilterBadges from './FilterBadges';
import { MultiSelect, MultiSelectOption } from './ui/multi-select';

interface TicketFiltersProps {
    filters: TicketFiltersType;
    onFiltersChange: (filters: TicketFiltersType) => void;
    uniqueCustomers: (Customer | undefined)[];
    /** Controls of the filter panel; active filter badges stay visible either way. */
    isExpanded?: boolean;
}

const TicketFilters: React.FC<TicketFiltersProps> = ({
    filters,
    onFiltersChange,
    uniqueCustomers,
    isExpanded = true
}) => {
    const updateFilter = (key: keyof TicketFiltersType, value: string[]) => {
        onFiltersChange({
            ...filters,
            [key]: value
        });
    };

    const clearFilters = () => {
        onFiltersChange({
            services: [],
            statuses: [],
            priorities: [],
            customers: []
        });
    };

    const removeService = (service: string) => {
        onFiltersChange({
            ...filters,
            services: filters.services.filter(s => s !== service)
        });
    };

    const removeStatus = (status: string) => {
        onFiltersChange({
            ...filters,
            statuses: filters.statuses.filter(s => s !== status)
        });
    };

    const removePriority = (priority: string) => {
        onFiltersChange({
            ...filters,
            priorities: filters.priorities.filter(p => p !== priority)
        });
    };

    const removeCustomer = (customerId: string) => {
        onFiltersChange({
            ...filters,
            customers: filters.customers.filter(c => c !== customerId)
        });
    };


    // Prepare options for multi-selects
    const serviceOptions: MultiSelectOption[] = Object.entries(SERVICE_LABELS).map(([key, label]) => ({
        value: key,
        label: label
    }));

    const statusOptions: MultiSelectOption[] = Object.entries(STATUS_LABELS).map(([key, label]) => ({
        value: key,
        label: label
    }));

    const priorityOptions: MultiSelectOption[] = Object.entries(PRIORITY_LABELS).map(([key, label]) => ({
        value: key,
        label: label
    }));

    const customerOptions: MultiSelectOption[] = uniqueCustomers.map((customer) => ({
        value: customer?.id || '',
        label: customer?.name || 'Unknown Customer'
    }));

    return (
        <div className="space-y-3">
            {/* Filter Controls */}
            {isExpanded && (
                <div className="grid grid-cols-1 gap-3 rounded-lg border bg-muted/40 p-4 sm:grid-cols-2 xl:grid-cols-4">
                    {/* Services Filter */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Services
                        </label>
                        <MultiSelect
                            options={serviceOptions}
                            value={filters.services}
                            onChange={(value) => updateFilter('services', value)}
                            placeholder="All Services"
                        />
                    </div>

                    {/* Statuses Filter */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Statuses
                        </label>
                        <MultiSelect
                            options={statusOptions}
                            value={filters.statuses}
                            onChange={(value) => updateFilter('statuses', value)}
                            placeholder="All Statuses"
                        />
                    </div>

                    {/* Priorities Filter */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Priorities
                        </label>
                        <MultiSelect
                            options={priorityOptions}
                            value={filters.priorities}
                            onChange={(value) => updateFilter('priorities', value)}
                            placeholder="All Priorities"
                        />
                    </div>

                    {/* Customers Filter */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Customers
                        </label>
                        <MultiSelect
                            options={customerOptions}
                            value={filters.customers}
                            onChange={(value) => updateFilter('customers', value)}
                            placeholder="All Customers"
                        />
                    </div>
                </div>
            )}

            {/* Active Filter Badges */}
            <FilterBadges
                filters={filters}
                onRemoveService={removeService}
                onRemoveStatus={removeStatus}
                onRemovePriority={removePriority}
                onRemoveCustomer={removeCustomer}
                onClearAll={clearFilters}
                uniqueCustomers={uniqueCustomers}
            />
        </div>
    );
};

export default TicketFilters;
