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
    <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <div className="truncate text-sm text-foreground">{children}</div>
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

            <CardHeader className="gap-3 pb-4 pl-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-mono font-medium tracking-wide">
                                {formatTicketReference(ticket.ticketId)}
                            </span>
                            <span aria-hidden="true">•</span>
                            <time dateTime={ticket.createdAt} title={formatTimestamp(ticket.createdAt)}>
                                {formatRelativeTime(ticket.createdAt)}
                            </time>
                        </div>
                        <CardTitle className="text-base font-semibold leading-snug">
                            {ticket.description}
                        </CardTitle>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
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

            <CardContent className="space-y-4 pl-7">
                <div className="rounded-lg border bg-muted/40 p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Detail icon={User} label="Customer">
                            {customer ? (
                                <>
                                    <span className="font-medium">{customer.name}</span>
                                    <span className="ml-2 font-mono text-xs text-muted-foreground">
                                        {customer.id}
                                    </span>
                                </>
                            ) : (
                                <span className="font-mono">{ticket.customerId}</span>
                            )}
                        </Detail>

                        {customer ? (
                            <>
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
                            </>
                        ) : (
                            <Detail icon={User} label="Customer details">
                                <span className="text-muted-foreground">Not available</span>
                            </Detail>
                        )}
                    </div>

                    {customer && customer.services.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t pt-3">
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

                <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Bell className="h-3.5 w-3.5" aria-hidden="true" />
                            Alarm
                            <span className="font-mono">{ticket.alarmId.slice(0, 8)}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {formatTimestamp(ticket.createdAt)}
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
