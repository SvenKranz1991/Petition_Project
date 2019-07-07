var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/signatures");

exports.getSignatures = function getSignatures() {
    return db.query("SELECT * FROM signatures");
};

// $1 syntax is used to prevent a type of attack
// called a SQL Injection!
exports.addName = function addName(FirstName, LastName) {
    return db.query(
        // should the values in Brackets be the same as in Signatures.sql Table?

        `INSERT INTO signatures (FirstName, LastName)
        VALUES ($1, $2)`,
        [FirstName, LastName]
    );
};

exports.getNumber = function getNumber() {
    return db.query("SELECT COUNT(*) FROM signatures");
};
