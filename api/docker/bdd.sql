CREATE TABLE IF NOT EXISTS users (
    id int auto_increment,
    username varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    created_at datetime default current_timestamp,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS messages (
    id int auto_increment,
    sender_id int,
    receiver_id int,
    content longtext not null,
    published_at datetime default current_timestamp,
    PRIMARY KEY (id),
    foreign key(sender_id) references users(id),
    foreign key(receiver_id) references users(id)
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