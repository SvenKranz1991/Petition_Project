// Requiring Express, Handlebars and the DB

const express = require("express");
const app = express();
const helmet = require("helmet");

app.use(helmet());

const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const db = require("./utils/db");
const enc = require("./utils/bc");

// const {
//     requireLoggedOut,
//     requireSigned,
//     requireNoSignature
// } = require("./middleware");

// Cookie Session
var cookieSession = require("cookie-session");

app.use(
    cookieSession({
        secret: `I cook rice.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
// app.use();

/////// Registration

// If Person not registered, have cookie --> redirect to petition

// function requireLoggedOut(req, res, next) {
//     if (req.session.userId) {
//         return res.redirect("/petition");
//     }
//     // res.sendStatus(200);
//     next();
// }

////////// Apply it to GET and Post

// app.get("/register", requireLoggedOut, (req, res) => {
//     res.sendStatus(200);
// });

app.use((req, res, next) => {
    if (!req.session.userId && req.u != "/register" && req.url != "/login") {
        res.redirect("/register");
    } else {
        next();
    }
});

//////
app.get("/register", (req, res) => {
    if (req.session.userId) {
        return res.redirect("/petition");
    }
    res.sendStatis(200);
});

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

app.use(express.static("./public"));
app.use(express.static("./material"));
app.use("/favicon.ico", (req, res) => res.sendStatus(404));

// Test BCrypt

enc.hashPassword("ekrjdkfasfa").then(decrypt => {
    console.log("Test Password:", decrypt);
});

// Cookie Parser

app.use(cookieParser());

// Deny IFrame attack

app.use(csurf());

app.use(function(req, res, next) {
    res.set("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    next();
});

// app.use(function(req, res, next) {
//     if (req.cookies.registrated) {
//         res.redirect("/petition/signed");
//         return next();
//     }
//     if (!req.cookies.registrated) {
//         res.redirect("/registration");
//         return next();
//     }
//     res.redirect("/registration");
//     return next();
// });

// Redirect slash Route to /petition

app.get("/", (req, res) => {
    res.redirect("/registration");
});

app.get("/petition", (req, res) => {
    res.render("petition", {
        layout: "main",
        Title: "Front Page"
    });
});

// Registration

app.get("/registration", (req, res) => {
    res.render("registration", {
        layout: "main",
        Title: "Registration Page"
    });
});

// P3 -- > Hash Password, Encrypt Password

app.post("/registration", (req, res) => {
    if (
        req.body.first_Name == "" ||
        req.body.last_name == "" ||
        req.body.email == "" ||
        req.body.password == ""
    ) {
        console.log("true");
        res.render("registration", {
            layout: "main",
            Title: "Registration Page",
            warning: true
        });
    } else {
        enc.hashPassword(req.body.password).then(decrypt => {
            console.log("New Password:", decrypt);
            db.addRegistration(
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                decrypt
            )
                .then(res.redirect("/registration/location"))
                .catch(err => {
                    console.log("err in addName: ", err);
                });
        });
    }
});

// User Info Location

app.get("/registration/location", (req, res) => {
    res.render("location", {
        layout: "main",
        Title: "Registration / Location"
    });
});

app.post("/registration/location", (req, res) => {
    db.addUserInfo(req.body.age, req.body.city, req.body.homepage)
        .then(res.redirect("/petition"))
        .catch(err => {
            console.log("err in addName: ", err);
        });
});

// Login

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main",
        Title: "Login Page"
    });
});

// Making Post Route from FORM on page for User

app.post("/petition", (req, res) => {
    if (
        req.body.first_name == "" ||
        req.body.last_name == "" ||
        req.body.input == ""
    ) {
        res.render("petition", {
            warning: true
        });
    } else {
        db.addName(req.body.first_name, req.body.last_name, req.body.input)
            .then(results => {
                req.session.userId = results.rows[0].id;
                // console.log("yay it worked!");
                res.redirect("/petition/signed");
                // console.log(req.body);
                console.log(req.session);
            })
            .catch(err => {
                console.log("err in addName: ", err);
            });
    }
});

// send information to

// Redirecting to signed Page

// P3 -- > Build login form if user already signed
// use checkPassword for Login

app.get("/petition/signed", (req, res) => {
    console.log(req.session.userId);
    let numberID;
    db.getNumber().then(results => {
        numberID = results.rows;
        console.log("My ID", numberID);
        return db.getSignature(req.session.userId).then(results => {
            console.log("signatureresults:", results);
            res.render("signed", {
                layout: "main",
                NamesEntries: results.count,
                image: results.rows[0].signature_base_64,
                Title: "Last Page",
                redirect: "/petition/signers",
                name: `results.rows[0].first_name results.rows[0].first_name`
            });
            console.log("results rows: ", results.rows);
        });
    });
    // res.cookie("registrated", 1);
    // call out Cookie Signature Id
});

// Showing List of Users, who signed
// When you want to end the session (i.e, log out the user), you can set req.session to null.

app.get("/petition/signers", (req, res) => {
    // do the same app.get signatures
    db.getSignatures().then(results => {
        res.render("signers", {
            layout: "main",
            Title: "Signers Page",
            NamesEntries: results.rows
        });
    });
});

app.listen(process.env.PORT || 8080, () => console.log("8080 Listening!"));

////////////////////
//  You should also change the signatures table so that it has a column for the user id. You need to be able ///  to map signatures to users and users to signatures.
////////////////////
////////////////////
// Finished
////////////////////
// First name, last name, email address, and password should all be required fields. Email addresses must be /// unique. This should be enforced by a constraint on the column.
////////////////////
//
// For Part 4 Heroku
////////////////////
// change
//
//  app.listen(process.env.PORT || 8080, () => {
//  console.log("petition listening");
//  });
//
//  if "if" block runs, that means our website should talk to heroku's postgres database
//
//
// if(process.env.DATABASE_URL) {
// db = spicedPg(process.env.DATABASE_URL)
// }   else {
// db = spicedPg(`postgres:postgres:postgres@localhost:5432/signatures)
// }

// this means my app is on Heroku
// and my server should look for a cookieSessionSecret on Heroku
// this in general is how we handle secret credentials on Heroku
