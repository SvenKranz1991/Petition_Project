var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/signatures");

exports.getSignatures = function getSignatures() {
    return db.query("SELECT * FROM signatures");
};

// Every single SELECT, UPDATE, INSERT, and DELETE query will be made in this file

// Every single function defined in db.js will be invoked in index.js

// $1 syntax is used to prevent a type of attack
// called a SQL Injection!

exports.addName = function addName(first_name, last_name, signature_base_64) {
    return db.query(
        `INSERT INTO signatures (first_name, last_name, signature_base_64)
        VALUES ($1, $2, $3) RETURNING id`,
        [first_name, last_name, signature_base_64]
    );
};

// SELECT to get number of signers

exports.getNumber = function getNumber() {
    return db.query("SELECT COUNT (*) FROM signatures");
};

// SELECT to get the first and last names of everyone who has signed

exports.getSignature = function getSignature(id) {
    return db.query(
        "SELECT signature_base_64 FROM signatures WHERE id = " + id
    );
};

exports.addRegistration = function addRegistration(
    first_name,
    last_name,
    email,
    password
) {
    return db.query(
        `INSERT INTO users (first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4)`,
        [first_name, last_name, email, password]
    );
};

exports.checkLogin = function checkLogin(email, password) {
    return db.query(
        "SELECT email, password FROM users WHERE email = " +
            email +
            "AND password = " +
            password
    );
};

exports.addUserInfo = function addUserInfo(age, city, homepage) {
    return db.query(
        `INTERT INTO user_info (age, city, homepage) VALUES ($1, $2, $3)`[
            (age, city, homepage)
        ]
    );
};

// tomorrow

// exports.getPeopleFromSameCity = function getPeopleFromSameCity(city) {
//     "SELECT users FROM signatures WHERE id = " + id;
// };
