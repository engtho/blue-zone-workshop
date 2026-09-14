import { describe, expect, it } from "vitest";
import { formatTicketReference, getStatusPresentation, getTicketPriority } from "./ticketPresentation";
import { TicketWithCustomer } from "../schemas";

describe("formatTicketReference", () => {
  it.each([
    "ticket-1",
    "TKT-123",
    "INC-2026-0000123456",
    "MixedCase-Customer-Ticket",
    "3f9a1c2b-not-a-uuid",
  ])("preserves readable reference %s", (reference) => {
    expect(formatTicketReference(reference)).toBe(reference);
  });

  it.each([
    "3f9a1c2b-aaaa-4bbb-8ccc-ddddeeeeffff",
    "3F9A1C2B-AAAA-4BBB-8CCC-DDDDEEEEFFFF",
  ])("shortens UUID %s for display", (reference) => {
    expect(formatTicketReference(reference)).toBe("TKT-3F9A1C2B");
  });

  it("does not shorten a UUID embedded in a readable identifier", () => {
    const reference = "incident-3f9a1c2b-aaaa-4bbb-8ccc-ddddeeeeffff";
    expect(formatTicketReference(reference)).toBe(reference);
  });
});

describe("ticket presentation fallbacks", () => {
  it("keeps unknown statuses readable with an icon", () => {
    const status = getStatusPresentation("ASSIGNED");
    expect(status.label).toBe("ASSIGNED");
    expect(status.variant).toBe("outline");
    expect(status.icon).toBeDefined();
  });

  it("defaults to standard priority before customer integration is implemented", () => {
    const ticket: TicketWithCustomer = {
      ticketId: "ticket-1",
      alarmId: "alarm-1",
      customerId: "c-42",
      status: "OPEN",
      createdAt: "2023-09-11T15:20:00",
      description: "Network outage affecting customer c-42",
    };
    expect(getTicketPriority(ticket)).toBe(2);
  });
});
