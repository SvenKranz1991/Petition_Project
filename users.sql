DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id  SERIAL primary key,
    first_name  VARCHAR(255),
    last_name   VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    --- put "unique constraint" on the email
    password VARCHAR(255),    -- which should first be hashed!!
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--
-- SELECT * FROM users;
