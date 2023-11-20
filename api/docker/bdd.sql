CREATE TABLE IF NOT EXISTS users (
    id int(11) auto_increment,
    username varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    created_at datetime default current_timestamp,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS messages (
    id int(11) auto_increment,
    sender_id int(11),
    receiver_id int(11),
    content longtext not null,
    published_at datetime default current_timestamp,
    PRIMARY KEY (id),
    foreign key(sender_id) references users(id),
    foreign key(receiver_id) references users(id)
);

CREATE TABLE IF NOT EXISTS groups (
    id int(11) auto_increment,
    uuid varchar(255) not null,
    name varchar(255) not null,
    administrator int(11),
    created_at datetime default current_timestamp,
    PRIMARY KEY (id),
    foreign key(administrator) references users(id)
);

CREATE TABLE IF NOT EXISTS group_users (
    id int(11) auto_increment,
    user_id int(11),
    group_id int(11),
    join_at datetime default current_timestamp,
    PRIMARY KEY (id),
    foreign key(user_id) references users(id),
    foreign key(group_id) references groups(id)
);

CREATE TABLE IF NOT EXISTS group_messages (
    id int(11) auto_increment,
    sender_id int(11),
    group_id int(11),
    published_at datetime default current_timestamp,
    PRIMARY KEY (id),
    foreign key(sender_id) references users(id),
    foreign key(group_id) references groups(id)
);

INSERT INTO users(username, email, password) VALUES('Joeil', 'test@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');
INSERT INTO users(username, email, password) VALUES('Kevin', 'kevin@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');
INSERT INTO users(username, email, password) VALUES('Pierre', 'pierre@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');
INSERT INTO users(username, email, password) VALUES('Fabien', 'fabien@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');
INSERT INTO users(username, email, password) VALUES('Louis', 'louis@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');
INSERT INTO users(username, email, password) VALUES('Luc', 'luc@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');

INSERT INTO messages(sender_id, receiver_id, content) VALUES(1, 2, 'Coucou bro');
INSERT INTO messages(sender_id, receiver_id, content) VALUES(2, 1, 'Yo bro ça va ?');

INSERT INTO messages(sender_id, receiver_id, content) VALUES(1, 3, 'Salut mec');
INSERT INTO messages(sender_id, receiver_id, content) VALUES(4, 1, 'Elles sont où mes thunes ?');

INSERT INTO groups(uuid, name, administrator) VALUES('7959f883-e3e0-4762-acf5-dbf968cf513a', 'Le groupe des boys', 1);
INSERT INTO groups(uuid, name, administrator) VALUES('7597282e-1a06-4c68-9857-c9a9aee75ce4', 'La secte', 2);

INSERT INTO group_users(user_id, group_id) VALUES(1, 1);