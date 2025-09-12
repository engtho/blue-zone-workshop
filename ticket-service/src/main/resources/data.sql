-- Initial tickets data for workshop
INSERT INTO tickets (ticket_id, alarm_id, customer_id, status, created_at, description) VALUES
('ticket-1', 'alarm-1', 'c-42', 'OPEN', 1694438400, 'Network outage affecting customer c-42'),
('ticket-2', 'alarm-2', 'c-7', 'OPEN', 1694438401, 'Network outage affecting customer c-7'),
('ticket-3', 'alarm-3', 'c-100', 'RESOLVED', 1694438300, 'Performance issue resolved for customer c-100');
