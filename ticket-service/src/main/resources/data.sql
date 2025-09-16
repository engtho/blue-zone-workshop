-- Initial tickets data for workshop
INSERT INTO tickets (ticket_id, alarm_id, customer_id, status, created_at, description) VALUES
('ticket-001', 'alarm-001', 'c-42', 'OPEN', 1694438400, 'Network outage affecting customer c-42'),
('ticket-002', 'alarm-001', 'c-7', 'OPEN', 1694438401, 'Network outage affecting customer c-7'),
('ticket-003', 'alarm-002', 'c-100', 'RESOLVED', 1694438300, 'Performance issue resolved for customer c-100');
