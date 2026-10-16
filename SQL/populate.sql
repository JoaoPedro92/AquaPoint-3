-- -------------------------------------------------------
-- ZONES
-- -------------------------------------------------------
insert into zone (id, zone_name) values (1, 'Lisboa');
insert into zone (id, zone_name) values (2, 'Porto');
insert into zone (id, zone_name) values (3, 'Faro');

-- -------------------------------------------------------
-- LOCAL
-- -------------------------------------------------------
insert into local (id, local_name, zone_id) values (1, 'Cascais', 1);
insert into local (id, local_name, zone_id) values (2, 'Sintra', 1);
insert into local (id, local_name, zone_id) values (3, 'Matosinhos', 2);
insert into local (id, local_name, zone_id) values (4, 'Albufeira', 3);

-- -------------------------------------------------------
-- TYPES
-- -------------------------------------------------------
insert into type (id, type_name) values (1, 'Humano');
insert into type (id, type_name) values (2, 'Animais');
insert into type (id, type_name) values (3, 'Ambos');

-- -------------------------------------------------------
-- STATES
-- -------------------------------------------------------
insert into states (id, state_name, backgroundColor, color) values (1, 'Necessita manutenção', '#f97316', '#ffff');
insert into states (id, state_name, backgroundColor, color) values (2, 'Bom estado', '#166534', '#c1ebbc');
insert into states (id, state_name, backgroundColor, color) values (3, 'Inativo', '#b91c1c', '#fee2e2');

-- -------------------------------------------------------
-- TRUST LEVELS
-- -------------------------------------------------------
insert into trustLevels (id, trust_name) values (1, 'Apagar');
insert into trustLevels (id, trust_name) values (2, 'Existe mas com pouca certeza');
insert into trustLevels (id, trust_name) values (3, 'Existe com alguma certeza');
insert into trustLevels (id, trust_name) values (4, 'Verificado');

-- -------------------------------------------------------
-- USERS
-- -------------------------------------------------------
insert into users (id, name, email, passwordHash, createdAt, isAdmin)
values (1, 'Admin', 'admin@aquapoint.pt', 'hash_admin', '2025-01-01', 1);

insert into users (id, name, email, passwordHash, createdAt, isAdmin)
values (2, 'João Silva', 'joao@email.com', 'hash_joao', '2025-01-02', 0);

insert into users (id, name, email, passwordHash, createdAt, isAdmin)
values (3, 'Maria Santos', 'maria@email.com', 'hash_maria', '2025-01-03', 0);

-- -------------------------------------------------------
-- AQUA POINTS
-- -------------------------------------------------------
insert into aqua_points (id, point_name, point_type, point_trust, local_id, state_id, latitude, longitude, createdBy, isPending)
values (1, 'Fonte do Jardim', 1, 4, 1, 1, 38.6979, -9.4215, 1, 0);

insert into aqua_points (id, point_name, point_type, point_trust, local_id, state_id, latitude, longitude, createdBy, isPending)
values (2, 'Bebedouro do Parque', 3, 3, 2, 3, 38.8029, -9.3817, 1, 0);

insert into aqua_points (id, point_name, point_type, point_trust, local_id, state_id, latitude, longitude, createdBy, isPending)
values (3, 'Fonte da Praia', 3, 2, 3, 1, 41.1820, -8.6890, 1, 0);

insert into aqua_points (id, point_name, point_type, point_trust, local_id, state_id, latitude, longitude, createdBy, isPending)
values (4, 'Bebedouro Central', 1, 4, 4, 2, 37.0891, -8.2479, 1, 1);

-- -------------------------------------------------------
-- FAVORITES
-- -------------------------------------------------------
insert into favorites (id, user_id, point_id, date)
values (1, 2, 1, '2025-02-10');

insert into favorites (id, user_id, point_id, date)
values (2, 3, 2, '2025-02-11');

insert into favorites (id, user_id, point_id, date)
values (3, 2, 3, '2025-02-12');

-- -------------------------------------------------------
-- REVIEWS
-- -------------------------------------------------------
insert into reviews (id, user_id, rating, comment, point_id, createdAt)
values (1, 2, 5, 'Muito limpa e funcional.', 1, '2025-02-20');

insert into reviews (id, user_id, rating, comment, point_id, createdAt)
values (2, 3, 4, 'Boa fonte mas podia estar melhor cuidada.', 2, '2025-02-21');

insert into reviews (id, user_id, rating, comment, point_id, createdAt)
values (3, 2, 3, 'Precisa de manutenção.', 3, '2025-02-22');

-- -------------------------------------------------------
-- REPORTS
-- -------------------------------------------------------
insert into reports (id, user_id, comment, point_id, createdAt)
values (1, 3, 'A torneira está danificada.', 3, '2025-03-01');

insert into reports (id, user_id, comment, point_id, createdAt)
values (2, 2, 'Fluxo de água muito fraco.', 2, '2025-03-02');

commit;