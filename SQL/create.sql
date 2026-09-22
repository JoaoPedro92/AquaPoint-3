-- -------------------------------------------------------
-- Base de Dados AQUAPOINT
-- -------------------------------------------------------

create database if not exists aquapoint;
use aquapoint;

-- -------------------------------------------------------
-- TABELA ZONE
-- -------------------------------------------------------
create table zone (
    id int not null auto_increment,
    zone_name text not null,
    primary key (id)
);

-- -------------------------------------------------------
-- TABELA LOCAL
-- -------------------------------------------------------
create table local (
    id int not null auto_increment,
    local_name text not null,        
    zone_id int not null,            
    primary key (id)
);

-- -------------------------------------------------------
-- TABELA TYPE
-- -------------------------------------------------------
create table type (
    id int not null auto_increment,
    type_name text not null,         
    primary key (id)
);

-- -------------------------------------------------------
-- TABELA USERS
-- -------------------------------------------------------
create table users (
    id int not null auto_increment,
    name text not null,
    email text not null,
    passwordHash text not null,
    profilePicture LONGBLOB default NULL,
    createdAt date not null,
    isAdmin TINYINT not null,
    primary key (id)
);

-- -------------------------------------------------------
-- TABELA STATES
-- -------------------------------------------------------
create table states (
    id int not null auto_increment,
    state_name text not null,
    backgroundColor text not null,
    color text not null,
    primary key (id)
);


-- -------------------------------------------------------
-- TABELA TRUST LOGS
-- -------------------------------------------------------
create table trust_logs (
    id int not null auto_increment,
    user_id int not null,
    point_id int not null,
    trust_vote int not null,
    vote_date date not null,
    primary key (id)
);

-- -------------------------------------------------------
-- TABELA TRUST LEVELS
-- -------------------------------------------------------
create table trustLevels (
    id int not null auto_increment,
    trust_name text not null,
    primary key (id)
);

-- -------------------------------------------------------
-- TABELA AQUA_POINTS
-- -------------------------------------------------------
create table aqua_points (
    id int not null auto_increment,
    point_name text not null,
    point_type int not null,  
    point_trust int not null,       
    local_id int not null,      
    state_id int not null,   
    createdBy int not null,
    isPending TINYINT not null,  
    image LONGBLOB default NULL,    
    latitude double not null,
    longitude double not null,
    primary key (id)
);

-- -------------------------------------------------------
-- TABELA FAVORITES
-- -------------------------------------------------------
create table favorites (
    id int not null auto_increment,
    user_id int not null,            
    point_id int not null,           
    date date not null,
    primary key (id)
);

-- -------------------------------------------------------
-- TABELA REVIEWS
-- -------------------------------------------------------
create table reviews (
    id int not null auto_increment,
    user_id int not null,            
    rating int not null,          
    comment TEXT not null,         
    point_id int not null,           
    createdAt date not null,
    primary key (id)
);

-- -------------------------------------------------------
-- TABELA REPORTS
-- -------------------------------------------------------
create table reports (
    id int not null auto_increment,
    user_id int not null,   
    comment TEXT not null,   
    image LONGBLOB not null,         
    point_id int not null,           
    createdAt date not null,
    primary key (id)
);

-- -------------------------------------------------------
-- FOREIGN KEYS
-- -------------------------------------------------------

-- LOCAL -> ZONE
alter table local
add constraint fk_local_zone
foreign key (zone_id) references zone(id)
on delete cascade on update cascade;

-- AQUA_POINTS -> TYPE e LOCAL
alter table aqua_points
add constraint fk_aqua_points_type
foreign key (point_type) references type(id)
on delete cascade on update cascade;

alter table aqua_points
add constraint fk_aqua_points_local
foreign key (local_id) references local(id)
on delete cascade on update cascade;

-- AQUA_POINTS -> AQUA_POINTS e STATES
alter table aqua_points
add constraint fk_aqua_points_state
foreign key (state_id) references states(id)
on delete cascade on update cascade;

-- AQUA_POINTS -> AQUA_POINTS e USERS
alter table aqua_points
add constraint fk_aqua_points_created_by
foreign key (createdBy) references users(id)
on delete cascade on update cascade;

-- POINTS_TRUST -> AQUA_POINTS e TRUSTLEVELS
alter table aqua_points
add constraint fk_points_trust_point
foreign key (point_trust) references trustLevels(id)
on delete cascade on update cascade;

-- FAVORITES -> USERS e AQUA_POINTS
alter table favorites
add constraint fk_favorites_user
foreign key (user_id) references users(id)
on delete cascade on update cascade;

alter table favorites
add constraint fk_favorites_point
foreign key (point_id) references aqua_points(id)
on delete cascade on update cascade;

-- INTERACTION -> USERS, RATING, COMMENT, AQUA_POINTS
alter table reviews
add constraint fk_reviews_user
foreign key (user_id) references users(id)
on delete cascade on update cascade;

alter table reviews
add constraint fk_reviews_point
foreign key (point_id) references aqua_points(id)
on delete cascade on update cascade;

alter table reports
add constraint fk_reports_user
foreign key (user_id) references users(id)
on delete cascade on update cascade;

alter table reports
add constraint fk_reports_point
foreign key (point_id) references aqua_points(id)
on delete cascade on update cascade;

-- trust logs -> USERS, POINT, VOTE
alter table trust_logs
add constraint fk_trust_logs_user
foreign key (user_id) references users(id)
on delete cascade on update cascade;

alter table trust_logs
add constraint fk_trust_logs_point
foreign key (point_id) references aqua_points(id)
on delete cascade on update cascade;

alter table trust_logs
add constraint fk_trust_logs_trust_level
foreign key (trust_vote) references trustLevels(id)
on delete cascade on update cascade;