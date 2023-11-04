CREATE TABLE IF NOT EXISTS users (
    id int auto_increment,
    username varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    created_at datetime default current_timestamp,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS messages (
    id int auto_increment,
    sender_id int,
    receiver_id int,
    content longtext not null,
    published_at datetime default current_timestamp,
    primary key(id),
    foreign key(sender_id) references users(id),
    foreign key(receiver_id) references users(id)
);

INSERT INTO users(username, email, password) VALUES('Test', 'test@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');
INSERT INTO users(username, email, password) VALUES('Test 2', 'test2@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');
INSERT INTO users(username, email, password) VALUES('Test 3', 'test3@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');
INSERT INTO users(username, email, password) VALUES('Test 4', 'test4@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');
INSERT INTO users(username, email, password) VALUES('Test 5', 'test5@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');
INSERT INTO users(username, email, password) VALUES('Test 6', 'test6@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');

INSERT INTO messages(sender_id, receiver_id, content) VALUES(1, 2, 'Coucou bro');
INSERT INTO messages(sender_id, receiver_id, content) VALUES(2, 1, 'Yo bro ça va ?');

INSERT INTO messages(sender_id, receiver_id, content) VALUES(1, 3, 'Salut mec');
INSERT INTO messages(sender_id, receiver_id, content) VALUES(4, 1, 'Elles sont où mes thunes ?');