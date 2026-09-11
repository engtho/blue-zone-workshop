import {
  AlertCircle,
  CheckCircle2,
  CircleDot,
  Clock,
  LucideIcon,
  XCircle,
} from "lucide-react";
import { BadgeProps } from "../components/ui/badge";
import {
  CustomerPriority,
  STATUS_LABELS,
  TicketStatus,
  TicketWithCustomer,
} from "../schemas";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

/** Badge styling per ticket status. */
export const STATUS_BADGE_VARIANT: Record<TicketStatus, BadgeVariant> = {
  OPEN: "warning",
  IN_PROGRESS: "info",
  RESOLVED: "success",
  CLOSED: "muted",
};

export const STATUS_ICON: Record<TicketStatus, LucideIcon> = {
  OPEN: AlertCircle,
  IN_PROGRESS: Clock,
  RESOLVED: CheckCircle2,
  CLOSED: XCircle,
};

/** Badge styling per customer priority. */
export const PRIORITY_BADGE_VARIANT: Record<CustomerPriority, BadgeVariant> = {
  [CustomerPriority.CRITICAL]: "destructive",
  [CustomerPriority.STANDARD]: "info",
  [CustomerPriority.LOW]: "muted",
};

/** Colour of the vertical rail on the left edge of a ticket card. */
export const PRIORITY_ACCENT_CLASS: Record<CustomerPriority, string> = {
  [CustomerPriority.CRITICAL]: "bg-destructive",
  [CustomerPriority.STANDARD]: "bg-info",
  [CustomerPriority.LOW]: "bg-muted-foreground/40",
};

interface StatusPresentation {
  label: string;
  variant: BadgeVariant;
  icon: LucideIcon;
}

const isKnownStatus = (status: string): status is TicketStatus =>
  status in STATUS_BADGE_VARIANT;

/**
 * The ticket API types status as a plain string, so unknown values are rendered
 * as-is instead of breaking the ticket list.
 */
export const getStatusPresentation = (status: string): StatusPresentation =>
  isKnownStatus(status)
    ? {
        label: STATUS_LABELS[status],
        variant: STATUS_BADGE_VARIANT[status],
        icon: STATUS_ICON[status],
      }
    : { label: status, variant: "outline", icon: CircleDot };

/**
 * Customer data is optional: it is only available once the customer lookup is
 * implemented, so tickets fall back to the standard priority.
 */
export const getTicketPriority = (
  ticket: TicketWithCustomer
): CustomerPriority => ticket.customer?.priority ?? CustomerPriority.STANDARD;

/** Short, human readable ticket reference, e.g. `TKT-3F9A1C2B`. */
export const formatTicketReference = (ticketId: string): string =>
  `TKT-${ticketId.slice(0, 8).toUpperCase()}`;

export const formatTimestamp = (value: string): string =>
  new Date(value).toLocaleString("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const RELATIVE_TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

const relativeTimeFormat = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

/** Renders a timestamp as "5 minutes ago" style text. */
export const formatRelativeTime = (value: string): string => {
  const elapsedSeconds = (Date.now() - new Date(value).getTime()) / 1000;

  for (const [unit, secondsInUnit] of RELATIVE_TIME_UNITS) {
    if (Math.abs(elapsedSeconds) >= secondsInUnit) {
      return relativeTimeFormat.format(
        -Math.round(elapsedSeconds / secondsInUnit),
        unit
      );
    }
  }

  return relativeTimeFormat.format(-Math.round(elapsedSeconds), "second");
};
