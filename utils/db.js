var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/signatures");

exports.getSignatures = function getSignatures() {
    return db.query("SELECT * FROM signatures");
};

// Every single SELECT, UPDATE, INSERT, and DELETE query will be made in this file

// Every single function defined in db.js will be invoked in index.js

// $1 syntax is used to prevent a type of attack
// called a SQL Injection!

// INSERT when user signs the petition (so provides first, last, and signature)

exports.addName = function addName(first_name, last_name, signature_base_64) {
    return db.query(
        // should the values in Brackets be the same as in Signatures.sql Table?

        `INSERT INTO signatures (first_name, last_name, signature_base_64)
        VALUES ($1, $2, $3)`,
        [first_name, last_name, signature_base_64]
    );
};

// SELECT to get number of signers

exports.getNumber = function getNumber() {
    return db.query("SELECT COUNT (*) FROM signatures");
};

// SELECT to get the first and last names of everyone who has signed

exports.getSignatures = function getSignatures() {
    return db.query("SELECT * FROM signatures");
};
