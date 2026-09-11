import { Activity, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import React, { useMemo } from 'react';
import { TicketStatus, TicketWithCustomer } from '../schemas';

interface TicketStatsProps {
    tickets: TicketWithCustomer[];
}

interface StatDefinition {
    key: string;
    label: string;
    icon: React.ElementType;
    iconClassName: string;
    count: (tickets: TicketWithCustomer[]) => number;
}

const countByStatus = (tickets: TicketWithCustomer[], status: TicketStatus) =>
    tickets.filter((ticket) => ticket.status === status).length;

const STAT_DEFINITIONS: StatDefinition[] = [
    {
        key: 'total',
        label: 'Total',
        icon: Activity,
        iconClassName: 'text-muted-foreground',
        count: (tickets) => tickets.length
    },
    {
        key: 'open',
        label: 'Open',
        icon: AlertCircle,
        iconClassName: 'text-warning',
        count: (tickets) => countByStatus(tickets, 'OPEN')
    },
    {
        key: 'in-progress',
        label: 'In Progress',
        icon: Clock,
        iconClassName: 'text-info',
        count: (tickets) => countByStatus(tickets, 'IN_PROGRESS')
    },
    {
        key: 'resolved',
        label: 'Resolved',
        icon: CheckCircle2,
        iconClassName: 'text-success',
        count: (tickets) => countByStatus(tickets, 'RESOLVED')
    }
];

const TicketStats: React.FC<TicketStatsProps> = ({ tickets }) => {
    const stats = useMemo(
        () =>
            STAT_DEFINITIONS.map((definition) => ({
                ...definition,
                value: definition.count(tickets)
            })),
        [tickets]
    );

    return (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(({ key, label, icon: Icon, iconClassName, value }) => (
                <div key={key} className="rounded-lg border bg-card px-4 py-3">
                    <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <Icon className={`h-3.5 w-3.5 ${iconClassName}`} aria-hidden="true" />
                        {label}
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold tabular-nums">{value}</dd>
                </div>
            ))}
        </dl>
    );
};

export default TicketStats;
