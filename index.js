// Requiring Express, Handlebars and the DB

const express = require("express");
const app = express();

const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

const bodyParser = require("body-parser");

const cookieParser = require("cookie-parser");

const db = require("./utils/db");

app.use(express.static("./public"));
app.use(express.static("./material"));

// Cookie Session
var cookieSession = require("cookie-session");

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

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

app.post("/registration", (req, res) => {
    db.addRegistration(
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.password
    ).then(res.redirect("/petition"));
});

// Login

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main",
        Title: "Login Page"
    });
});

// Making Post Route from FORM on page for User

// P3 -- > Hash Password
app.post("/petition", (req, res) => {
    // console.log(req.body.Input); --> doesn't work, only in Front
    db.addName(req.body.first_name, req.body.last_name, req.body.input)
        // req.body.signature  --> add in parameters for getting value

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
});

// Redirecting to signed Page

// P3 -- > Build login form if user already signed
// use checkPassword for Login

app.get("/petition/signed", (req, res) => {
    let numberID;
    db.getNumber().then(results => {
        numberID = results.rows;
        console.log("My ID", numberID);
        return db.getSignature(req.session.userId).then(results => {
            console.log("signatureresults:", results);
            res.render("signed", {
                layout: "main",
                NamesEntries: numberID.count,
                image: results.rows[0].signature_base_64,
                Title: "Last Page",
                redirect: "/petition/signers"
            });

            console.log("results rows: ", results.rows);
        });
    });

    // call out Cookie Signature Id

    // once you have the big signature url in this route,
    // you can render it on screen by putting it in an img tag
});

// Showing List of User, who signed

// When you want to end the session (i.e, log out the user), you can set req.session to null.

app.get("/petition/signers", (req, res) => {
    // do the same app.get signatures
    // canvas count
    db.getSignatures().then(results => {
        res.render("signers", {
            layout: "main",
            Title: "Signers Page",
            NamesEntries: results.rows
        });
    });
});

app.listen(8080, () => console.log("8080 Listening!"));
