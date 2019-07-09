DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL primary key,
    -- userId SERIAL primary key,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    signature_base_64 text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT INTO signatures(first_name, last_name, signature_base_64) VALUES ("Jonny", "Depp", " ");

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id  SERIAL primary key,
    first_name  VARCHAR(255) NOT NULL,
    last_name   VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    --- put "unique constraint" on the email
    password VARCHAR(255) NOT NULL,    --- which should first be hashed!!
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- INSERT INTO users(first_name, last_name, email, password) VALUES ("Jonny", "Depp", "ojga@fmg.de", "dasdf");


DROP TABLE IF EXISTS user_profiles;

CREATE TABLE user_profiles (
    id SERIAL primary key,
    -- userId foreign key,
    age Integer,
    city VARCHAR(255),
    homepage VARCHAR(255)
);

-- INSERT INTO user_profiles(userId, age, city, homepage) VALUES (6, "Berlin", "www.eating.com");


-- Email Check Constraint Example
-- email VARCHAR(255)
-- CHECK ([email] LIKE '@')

-- Charakter Unique -- other option
--     UNIQUE (email)


-- JOINS

-- SELECT users.first_name || ' ' || users.last_name AS User, user_profiles.city AS Location FROM users JOIN user_profiles on users.id = user_profiles.userid;
