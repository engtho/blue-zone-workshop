import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TicketWithCustomer } from '../schemas';
import { TicketFilters } from '../types/filters';
import App from '../App';
import TicketList from './TicketList';

interface ViewState {
    tickets: TicketWithCustomer[];
    filteredTickets: TicketWithCustomer[] | null;
    filters: TicketFilters;
    isLoading: boolean;
    error: Error | null;
    resolveError: Error | null;
    resolvingTicketId: string | undefined;
}

const { state, resolveTicket, setFilters } = vi.hoisted(() => {
    const state: ViewState = {
        tickets: [],
        filteredTickets: null,
        filters: { services: [], statuses: [], priorities: [], customers: [] },
        isLoading: false,
        error: null,
        resolveError: null,
        resolvingTicketId: undefined
    };
    return { state, resolveTicket: vi.fn(), setFilters: vi.fn() };
});

vi.mock('../hooks/useTickets', () => ({
    useTicketsSorted: () => ({
        tickets: state.tickets,
        isLoading: state.isLoading,
        isError: state.error !== null,
        error: state.error
    }),
    useResolveTicket: () => ({
        resolveTicket,
        resolvingTicketId: state.resolvingTicketId,
        isError: state.resolveError !== null,
        error: state.resolveError
    })
}));

vi.mock('../hooks/useTicketFilters', () => ({
    useTicketFilters: () => ({
        filters: state.filters,
        setFilters,
        filteredTickets: state.filteredTickets ?? state.tickets,
        uniqueCustomers: state.tickets.map(ticket => ticket.customer),
        hasActiveFilters: Object.values(state.filters).some(values => values.length > 0)
    })
}));

const ticket: TicketWithCustomer = {
    ticketId: 'ticket-1',
    alarmId: 'alarm-1',
    customerId: 'c-42',
    status: 'OPEN',
    createdAt: '2023-09-11T15:20:00',
    description: 'Network outage affecting customer c-42'
};

beforeEach(() => {
    state.tickets = [ticket];
    state.filteredTickets = null;
    state.filters = { services: [], statuses: [], priorities: [], customers: [] };
    state.isLoading = false;
    state.error = null;
    state.resolveError = null;
    state.resolvingTicketId = undefined;
});

describe('TicketList', () => {
    it('omits the empty filter panel when collapsed and inactive', () => {
        const html = renderToStaticMarkup(<TicketList />);
        expect(html).toContain('aria-expanded="false"');
        expect(html).not.toContain('<div class="space-y-3">');
        expect(html).not.toContain('role="combobox"');
        expect(html).toContain('ticket-1');
    });

    it('keeps active badges visible while the filter controls are collapsed', () => {
        state.filters.statuses = ['OPEN'];
        const html = renderToStaticMarkup(<TicketList />);

        expect(html).toContain('Remove status filter Open');
        expect(html).toContain('Clear all');
        expect(html).toContain('Showing 1 of 1 tickets');
        expect(html).not.toContain('role="combobox"');
    });

    it('retains the empty state', () => {
        state.tickets = [];
        const html = renderToStaticMarkup(<TicketList />);
        expect(html).toContain('No tickets yet');
        expect(html).toContain('Create a service alarm');
    });

    it('retains the no-match state and clear action', () => {
        state.filters.statuses = ['RESOLVED'];
        state.filteredTickets = [];
        const html = renderToStaticMarkup(<TicketList />);

        expect(html).toContain('No tickets match the current filters');
        expect(html).toContain('Clear filters');
        expect(html).toContain('Remove status filter Resolved');
    });

    it('renders the compact loading layout', () => {
        state.isLoading = true;
        const html = renderToStaticMarkup(<TicketList />);

        expect(html).toContain('animate-pulse');
        expect(html).not.toContain('bg-muted/40');
        expect(html).not.toContain('ticket-1');
    });

    it('preserves load errors and their retry action', () => {
        state.error = new Error('Ticket service unavailable');
        const html = renderToStaticMarkup(<TicketList />);

        expect(html).toContain('Failed to load tickets');
        expect(html).toContain('Ticket service unavailable');
        expect(html).toContain('Try Again');
    });

    it('preserves resolution errors without hiding tickets', () => {
        state.resolveError = new Error('Update failed');
        const html = renderToStaticMarkup(<TicketList />);

        expect(html).toContain('Failed to resolve ticket');
        expect(html).toContain('Update failed');
        expect(html).toContain('ticket-1');
        expect(html).toContain('Resolve ticket');
    });

    it('keeps the pending state specific to the resolving ticket', () => {
        state.tickets.push({ ...ticket, ticketId: 'ticket-2' });
        state.resolvingTicketId = 'ticket-1';
        const html = renderToStaticMarkup(<TicketList />);

        expect(html.match(/disabled=""/g)).toHaveLength(1);
        expect(html).toContain('Resolving');
        expect(html).toContain('Resolve ticket');
    });
});

describe('dashboard shell', () => {
    it('describes auto-refresh without claiming connection health', () => {
        const html = renderToStaticMarkup(<App />);

        expect(html).toContain('Auto-refresh: 10s');
        expect(html).not.toContain('Live');
        expect(html).not.toContain('animate-ping');
    });

    it('keeps the alarm form before the ticket column and requires customer selection', () => {
        const html = renderToStaticMarkup(<App />);

        expect(html.indexOf('Create Service Alarm')).toBeLessThan(html.indexOf('Support Tickets'));
        expect(html).toContain('Select at least one customer');
        expect(html).toMatch(/<button[^>]*type="submit"[^>]*disabled=""[^>]*>Create alarm<\/button>/);
        expect(html).toContain('lg:col-span-2');
    });
});
