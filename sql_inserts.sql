INSERT INTO wards (ward_id, state, district, ward_name, ward_number, cleanliness_rate, vaccination_completion_rate) VALUES
('WARD-KL-ER-12', 'Kerala', 'Ernakulam', 'Gandhi Nagar', 12, 78, 91);

INSERT INTO asha_workers (asha_id, ward_id, name, phone) VALUES
('ASHA-12-001', 'WARD-KL-ER-12', 'Anitha K', '9876543210'),
('ASHA-12-002', 'WARD-KL-ER-12', 'Lekha R', '9654321870');

INSERT INTO households (household_id, ward_id, family_name, family_head, cleanliness_score, vaccination_completion) VALUES
('HH-12-0001', 'WARD-KL-ER-12', 'Kumar Family', 'Ramesh Kumar', 82, 100),
('HH-12-0002', 'WARD-KL-ER-12', 'Shaji Family', 'Shaji', 74, 80),
('HH-12-0003', 'WARD-KL-ER-12', 'Fatima Family', 'Fatima', 89, 100);

INSERT INTO members (household_id, name, age, relation) VALUES
('HH-12-0001', 'Ramesh Kumar', 42, 'Father'),
('HH-12-0001', 'Lakshmi Kumar', 38, 'Mother'),
('HH-12-0001', 'Rahul Kumar', 12, 'Son'),
('HH-12-0001', 'Riya Kumar', 7, 'Daughter'),
('HH-12-0002', 'Shaji', 48, 'Father'),
('HH-12-0002', 'Mary Shaji', 45, 'Mother'),
('HH-12-0002', 'Joel Shaji', 19, 'Son'),
('HH-12-0002', 'Anna Shaji', 15, 'Daughter'),
('HH-12-0002', 'Grandmother', 71, 'Grandmother'),
('HH-12-0003', 'Fatima', 35, 'Mother'),
('HH-12-0003', 'Ahmed', 10, 'Son'),
('HH-12-0003', 'Sara', 6, 'Daughter');

INSERT INTO vaccinations (member_id, vaccine_name, vaccination_date) VALUES
((SELECT id FROM members WHERE household_id = 'HH-12-0001' AND name = 'Ramesh Kumar' LIMIT 1), 'COVID Dose 1', '2021-05-12'),
((SELECT id FROM members WHERE household_id = 'HH-12-0001' AND name = 'Ramesh Kumar' LIMIT 1), 'COVID Dose 2', '2021-08-15'),
((SELECT id FROM members WHERE household_id = 'HH-12-0001' AND name = 'Ramesh Kumar' LIMIT 1), 'Flu 2024', '2024-01-20'),
((SELECT id FROM members WHERE household_id = 'HH-12-0001' AND name = 'Lakshmi Kumar' LIMIT 1), 'COVID Dose 1', '2021-06-02'),
((SELECT id FROM members WHERE household_id = 'HH-12-0001' AND name = 'Lakshmi Kumar' LIMIT 1), 'COVID Dose 2', '2021-09-10'),
((SELECT id FROM members WHERE household_id = 'HH-12-0001' AND name = 'Lakshmi Kumar' LIMIT 1), 'Tetanus Booster', '2023-10-12'),
((SELECT id FROM members WHERE household_id = 'HH-12-0001' AND name = 'Rahul Kumar' LIMIT 1), 'DTP Booster', '2023-06-11'),
((SELECT id FROM members WHERE household_id = 'HH-12-0001' AND name = 'Rahul Kumar' LIMIT 1), 'MMR', '2018-04-19'),
((SELECT id FROM members WHERE household_id = 'HH-12-0001' AND name = 'Riya Kumar' LIMIT 1), 'Polio Oral', '2023-09-05'),
((SELECT id FROM members WHERE household_id = 'HH-12-0001' AND name = 'Riya Kumar' LIMIT 1), 'MMR', '2022-03-10'),
((SELECT id FROM members WHERE household_id = 'HH-12-0002' AND name = 'Shaji' LIMIT 1), 'COVID Dose 1', '2021-04-20'),
((SELECT id FROM members WHERE household_id = 'HH-12-0002' AND name = 'Shaji' LIMIT 1), 'COVID Dose 2', '2021-07-18'),
((SELECT id FROM members WHERE household_id = 'HH-12-0002' AND name = 'Mary Shaji' LIMIT 1), 'COVID Dose 1', '2021-05-10'),
((SELECT id FROM members WHERE household_id = 'HH-12-0002' AND name = 'Mary Shaji' LIMIT 1), 'COVID Dose 2', '2021-08-09'),
((SELECT id FROM members WHERE household_id = 'HH-12-0002' AND name = 'Mary Shaji' LIMIT 1), 'Flu 2024', '2024-02-01'),
((SELECT id FROM members WHERE household_id = 'HH-12-0002' AND name = 'Joel Shaji' LIMIT 1), 'COVID Dose 1', '2021-09-02'),
((SELECT id FROM members WHERE household_id = 'HH-12-0002' AND name = 'Joel Shaji' LIMIT 1), 'COVID Dose 2', '2021-12-06'),
((SELECT id FROM members WHERE household_id = 'HH-12-0002' AND name = 'Anna Shaji' LIMIT 1), 'MMR', '2015-06-15'),
((SELECT id FROM members WHERE household_id = 'HH-12-0002' AND name = 'Anna Shaji' LIMIT 1), 'DTP Booster', '2021-03-12'),
((SELECT id FROM members WHERE household_id = 'HH-12-0002' AND name = 'Grandmother' LIMIT 1), 'COVID Dose 1', '2021-03-10'),
((SELECT id FROM members WHERE household_id = 'HH-12-0003' AND name = 'Fatima' LIMIT 1), 'Flu 2024', '2024-01-22'),
((SELECT id FROM members WHERE household_id = 'HH-12-0003' AND name = 'Fatima' LIMIT 1), 'Hepatitis B', '2023-08-14'),
((SELECT id FROM members WHERE household_id = 'HH-12-0003' AND name = 'Ahmed' LIMIT 1), 'DTP', '2023-05-09'),
((SELECT id FROM members WHERE household_id = 'HH-12-0003' AND name = 'Ahmed' LIMIT 1), 'Polio Oral', '2022-11-10'),
((SELECT id FROM members WHERE household_id = 'HH-12-0003' AND name = 'Sara' LIMIT 1), 'MMR', '2021-02-18'),
((SELECT id FROM members WHERE household_id = 'HH-12-0003' AND name = 'Sara' LIMIT 1), 'Polio', '2022-03-10');
