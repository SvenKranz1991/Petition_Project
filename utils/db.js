var spicedPg = require("spiced-pg");

var dbUrl;
if (process.env.DATABASE_URL) {
    dbUrl = spicedPg(process.env.DATABASE_URL);
} else {
    dbUrl = spicedPg("postgres:postgres:postgres@localhost:5432/signatures");
}

exports.getSignatures = function getSignatures() {
    return dbUrl.query("SELECT * FROM signatures"); //
};

// Every single SELECT, UPDATE, INSERT, and DELETE query will be made in this file

// Every single function defined in dbUrl.js will be invoked in index.js

// $1 syntax is used to prevent a type of attack
// called a SQL Injection!

exports.addSignature = function addSignature(userid, signature) {
    return dbUrl.query(
        // check
        `INSERT INTO signatures (userid, signature)
        VALUES ($1, $2) RETURNING id`,
        [userid, signature]
    );
};

// SELECT to get number of signers

exports.getNumber = function getNumber() {
    return dbUrl.query("SELECT COUNT(*) FROM signatures");
};

// SELECT to get the first and last names of everyone who has signed

exports.getSignature = function getSignature(id) {
    return dbUrl.query("SELECT signature FROM signatures WHERE id = " + id);
};

exports.addRegistration = function addRegistration(
    first_name,
    last_name,
    email,
    password
) {
    return dbUrl.query(
        `INSERT INTO users (first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4) RETURNING id`,
        [first_name, last_name, email, password]
    );
};

exports.addUserInfo = function addUserInfo(age, city, homepage, userid) {
    return dbUrl.query(
        `INSERT INTO user_profiles (age, city, homepage, userid) VALUES ($1, $2, $3, $4) RETURNING id`,
        [age, city, homepage, userid]
    );
};

exports.checkEmail = function(email) {
    return dbUrl.query("SELECT email FROM users WHERE email=$1", [email]);
};

exports.checkName = function(id) {
    return dbUrl.query(`SELECT first_name FROM users WHERE id=$1`, [id]);
};

exports.getPassword = function(id) {
    return dbUrl.query(`SELECT password FROM users WHERE id=$1`, [id]);
};

exports.getUserProfiles = function getUserProfiles() {
    return dbUrl.query(
        `SELECT
        users.first_name AS first,
        users.last_name AS last,
        user_profiles.age AS age,
        user_profiles.city AS city,
        user_profiles.homepage AS homepage
        FROM users
        LEFT JOIN signatures
        ON signatures.userid = users.id
        LEFT JOIN user_profiles
        ON signatures.userid = user_profiles.userid`
    );
};

exports.getUser = function getUser(email) {
    return dbUrl.query(
        `SELECT users.id AS userid, users.password, users.first_name || ' ' || users.last_name AS fullname, signatures.id AS "signId"
        FROM users
        LEFT JOIN signatures ON users.id = signatures.userid
        WHERE users.email = $1`,
        [email]
    );
};

// ------- Edit

exports.getUserProfile = function getUserProfile(id) {
    return dbUrl.query(
        `SELECT
        users.first_name AS first,
        users.last_name AS last,
        users.email AS email,
        users.password AS password,
        user_profiles.age AS age,
        user_profiles.city AS city,
        user_profiles.homepage AS homepage
        FROM users
        LEFT JOIN signatures
        ON signatures.userid = users.id
        LEFT JOIN user_profiles
        ON signatures.userid = user_profiles.userid
        WHERE users.id = $1`,
        [id]
    );
};

//////////////////

exports.updateUsers = function updateUsers(
    userid,
    first_name,
    last_name,
    email,
    password
) {
    return dbUrl.query(
        `UPDATE users
            SET first_name = $2, last_name = $3, email = $4, password = $5
            WHERE id = $1 RETURNING id`,
        [userid, first_name, last_name, email, password]
    );
};

exports.updateUsersNoPassword = function updateUsersNoPassword(
    userid,
    first_name,
    last_name,
    email
) {
    return dbUrl.query(
        `UPDATE users
            SET first_name = $2, last_name = $3, email = $4
            WHERE id = $1 RETURNING id`,
        [userid, first_name, last_name, email]
    );
};

exports.updateUserProfiles = function updateUserProfiles(
    age,
    city,
    homepage,
    userid
) {
    return dbUrl.query(
        `INSERT INTO user_profiles (age, city, homepage, userid)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (userid)
    DO UPDATE SET age = $1, city = $2, homepage = $3
    RETURNING id`,
        [age, city, homepage, userid]
    );
};

///////////////////////

exports.getPeopleFromSameCity = function getPeopleFromSameCity(city) {
    return dbUrl.query(
        `SELECT
        users.first_name AS first,
        users.last_name AS last,
        user_profiles.age AS age,
        user_profiles.city AS city,
        user_profiles.homepage AS homepage
        FROM users
        LEFT JOIN signatures
        ON signatures.userid = users.id
        LEFT JOIN user_profiles
        ON signatures.userid = user_profiles.userid
        WHERE LOWER(city) = LOWER($1)`,
        [city]
    );
};

exports.deleteSignature = function deleteSignature(signId) {
    return dbUrl.query(`DELETE FROM signatures WHERE userid = $1`, [signId]);
};

exports.deleteAccount = function deleteAccount(userId) {
    return dbUrl.query(`DELETE FROM users WHERE id = $1 CASCADE`, [userId]);
};
