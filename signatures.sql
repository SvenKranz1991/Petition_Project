DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL primary key,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    signature_base_64 text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM signatures;
