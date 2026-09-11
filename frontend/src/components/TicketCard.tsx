import { Bell, Clock, Mail, MapPin, Phone, User } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/utils';
import {
    formatRelativeTime,
    formatTicketReference,
    formatTimestamp,
    getStatusPresentation,
    getTicketPriority,
    PRIORITY_ACCENT_CLASS,
    PRIORITY_BADGE_VARIANT
} from '../lib/ticketPresentation';
import { PRIORITY_LABELS, TicketWithCustomer } from '../schemas';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface TicketCardProps {
    ticket: TicketWithCustomer;
    onResolve: (ticketId: string) => void;
    isResolving?: boolean;
}

interface DetailProps {
    icon: React.ElementType;
    label: string;
    children: React.ReactNode;
}

const Detail: React.FC<DetailProps> = ({ icon: Icon, label, children }) => (
    <div className="flex min-w-0 items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <div className="text-sm text-foreground [overflow-wrap:anywhere]">{children}</div>
        </div>
    </div>
);

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onResolve, isResolving = false }) => {
    const priority = getTicketPriority(ticket);
    const status = getStatusPresentation(ticket.status);
    const StatusIcon = status.icon;
    const customer = ticket.customer;

    return (
        <Card className="relative overflow-hidden transition-shadow hover:shadow-md">
            <span
                className={cn('absolute inset-y-0 left-0 w-1', PRIORITY_ACCENT_CLASS[priority])}
                aria-hidden="true"
            />

            <CardHeader className="space-y-0 p-4 pb-3 pl-5">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div className="min-w-0 flex-1 basis-60 space-y-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                            <span
                                className="min-w-0 font-mono font-medium tracking-wide [overflow-wrap:anywhere]"
                                title={ticket.ticketId}
                            >
                                {formatTicketReference(ticket.ticketId)}
                            </span>
                            <span aria-hidden="true">•</span>
                            <time dateTime={ticket.createdAt} title={formatTimestamp(ticket.createdAt)}>
                                {formatRelativeTime(ticket.createdAt)}
                            </time>
                        </div>
                        <CardTitle className="text-base font-semibold leading-snug [overflow-wrap:anywhere]">
                            {ticket.description}
                        </CardTitle>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={PRIORITY_BADGE_VARIANT[priority]}>
                            {PRIORITY_LABELS[priority]}
                        </Badge>
                        <Badge variant={status.variant}>
                            <StatusIcon className="h-3 w-3" aria-hidden="true" />
                            {status.label}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 px-4 pb-4 pl-5">
                {customer ? (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
                            <Detail icon={User} label="Customer">
                                <div className="flex flex-wrap items-baseline gap-x-2">
                                    <span className="min-w-0 font-medium">{customer.name}</span>
                                    <span className="min-w-0 font-mono text-xs text-muted-foreground">
                                        {customer.id}
                                    </span>
                                </div>
                            </Detail>
                            <Detail icon={MapPin} label="Region">
                                {customer.region}
                            </Detail>
                            <Detail icon={Mail} label="Email">
                                <a
                                    href={`mailto:${customer.email}`}
                                    className="hover:text-primary hover:underline"
                                >
                                    {customer.email}
                                </a>
                            </Detail>
                            <Detail icon={Phone} label="Phone">
                                {customer.phone}
                            </Detail>
                        </div>

                        {customer.services.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="mr-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Services
                                </span>
                                {customer.services.map((service) => (
                                    <Badge key={service} variant="outline" className="bg-background">
                                        {service}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <div className="flex min-w-0 items-center gap-2">
                            <User className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <span className="text-muted-foreground">Customer</span>
                            <span className="min-w-0 font-mono [overflow-wrap:anywhere]">{ticket.customerId}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Details not available</span>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Bell className="h-3.5 w-3.5" aria-hidden="true" />
                            Alarm
                            <span className="font-mono">{ticket.alarmId.slice(0, 8)}</span>
                        </span>
                        <span className="flex min-w-0 items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            <time dateTime={ticket.createdAt}>{formatTimestamp(ticket.createdAt)}</time>
                        </span>
                    </div>

                    {ticket.status === 'OPEN' && (
                        <Button size="sm" onClick={() => onResolve(ticket.ticketId)} disabled={isResolving}>
                            {isResolving ? 'Resolving…' : 'Resolve ticket'}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TicketCard;
