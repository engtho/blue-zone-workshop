import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { TicketWithCustomer } from '../schemas';
import TicketCard from './TicketCard';
import TicketStats from './TicketStats';

const ticket: TicketWithCustomer = {
    ticketId: 'ticket-1',
    alarmId: 'alarm-1',
    customerId: 'c-42',
    status: 'OPEN',
    createdAt: '2023-09-11T15:20:00',
    description: 'Network outage affecting customer c-42'
};

const renderTicket = (data: TicketWithCustomer, isResolving = false) =>
    renderToStaticMarkup(<TicketCard ticket={data} onResolve={vi.fn()} isResolving={isResolving} />);

describe('TicketCard', () => {
    it('renders a compact customer-ID fallback before Task 5', () => {
        const html = renderTicket(ticket);

        expect(html).toContain('title="ticket-1"');
        expect(html).not.toContain('TKT-TICKET');
        expect(html).toContain('c-42');
        expect(html).toContain('Details not available');
        expect(html).not.toContain('Customer details');
        expect(html).not.toContain('bg-muted/40');
        expect(html).toContain('Standard');
        expect(html).toContain(ticket.description);
        expect(html).toContain('alarm-1');
        expect(html).toContain(`dateTime="${ticket.createdAt}"`);
        expect(html).toContain('2023');
        expect(html).toContain('Resolve ticket');
    });

    it('keeps all enriched customer details without truncating long values', () => {
        const customer = {
            id: 'c-42',
            name: 'A customer with a very long name that must remain readable',
            email: 'a-long-customer-address@example.com',
            phone: '+47 123 45 678',
            region: 'Oslo',
            priority: 1,
            services: ['TV', 'BROADBAND']
        } satisfies NonNullable<TicketWithCustomer['customer']>;
        const html = renderTicket({ ...ticket, customer });

        for (const value of [customer.id, customer.name, customer.email, customer.phone, customer.region, ...customer.services]) {
            expect(html).toContain(value);
        }
        expect(html).toContain(`href="mailto:${customer.email}"`);
        expect(html).toContain('Critical');
        expect(html).not.toContain('Details not available');
        expect(html).not.toContain('truncate');
        expect(html).toContain('[overflow-wrap:anywhere]');
    });

    it('exposes the original UUID alongside its compact display reference', () => {
        const id = '3f9a1c2b-aaaa-4bbb-8ccc-ddddeeeeffff';
        const html = renderTicket({ ...ticket, ticketId: id });

        expect(html).toContain(`title="${id}"`);
        expect(html).toContain('TKT-3F9A1C2B');
    });

    it.each(['IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const)('does not show a resolve action for %s tickets', (status) => {
        expect(renderTicket({ ...ticket, status })).not.toContain('<button');
    });

    it('disables the action while resolving', () => {
        const html = renderTicket(ticket, true);
        expect(html).toContain('disabled=""');
        expect(html).toContain('Resolving');
    });
});

describe('TicketStats', () => {
    it('retains total and individual status counts, including closed tickets in the total', () => {
        const tickets: TicketWithCustomer[] = [
            ticket,
            { ...ticket, ticketId: 'ticket-2' },
            { ...ticket, ticketId: 'ticket-3', status: 'IN_PROGRESS' },
            { ...ticket, ticketId: 'ticket-4', status: 'RESOLVED' },
            { ...ticket, ticketId: 'ticket-5', status: 'CLOSED' }
        ];
        const html = renderToStaticMarkup(<TicketStats tickets={tickets} />);
        const counts = Array.from(html.matchAll(/<dd[^>]*>(\d+)<\/dd>/g), (match) => Number(match[1]));

        expect(counts).toEqual([5, 2, 1, 1]);
        expect(html).not.toContain('rounded-lg');
    });
});
