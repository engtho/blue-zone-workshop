-- Initial notification data for workshop
INSERT INTO notifications (id, ticket_id, customer_id, message, status, timestamp)
VALUES ('notif-001', 'ticket-001', 'c-42', 'Your support ticket #ticket-001 has been created and is being processed.',
        'SENT', 1694438400),
       ('notif-002', 'ticket-002', 'c-7', 'Your support ticket #ticket-002 has been created and is being processed.',
        'SENT', 1694438401),
       ('notif-003', 'ticket-003', 'c-100', 'Your ticket #ticket-003 has been resolved.', 'SENT', 1694438300);
