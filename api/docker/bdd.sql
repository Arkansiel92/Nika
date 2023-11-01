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
INSERT INTO users(username, email, password) VALUES('Test2', 'test2@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');
INSERT INTO users(username, email, password) VALUES('Test3', 'test3@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');
INSERT INTO users(username, email, password) VALUES('Test4', 'test4@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');
INSERT INTO users(username, email, password) VALUES('Test5', 'test5@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');
INSERT INTO users(username, email, password) VALUES('Test6', 'test6@test.fr', '$2b$10$KKGO6/5Y1u18z/3gXge6h.C0xVg5Lrfaoz4jmkn4GFtHbsUYllLqC');