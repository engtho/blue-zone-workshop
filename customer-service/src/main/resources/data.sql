INSERT INTO customers (id, name, email, phone, priority, region) VALUES
  ('c-42','Ada Lovelace','ada@example.com','+47 123 45 678',2,'Oslo'),
  ('c-7','Grace Hopper','grace@example.com','+47 987 65 432',2,'Bergen'),
  ('c-100','Oslo Universitetssykehus','it@ous.no','+47 23 07 00 00',1,'Oslo'),
  ('c-200','Katherine Johnson','katherine@example.com','+47 444 98 765',2,'Stavanger'),
  ('c-300','Bergen Brannvesen','it@bergen-brann.no','+47 55 56 81 10',1,'Bergen');

INSERT INTO customer_services (customer_id, service) VALUES
  ('c-42','BROADBAND'), ('c-42','TV'),
  ('c-7','MOBILE'), ('c-7','BROADBAND'),
  ('c-100','BROADBAND'), ('c-100','MOBILE'), ('c-100','TV'),
  ('c-200','MOBILE'),
  ('c-300','BROADBAND'), ('c-300','MOBILE');