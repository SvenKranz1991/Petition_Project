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

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

// Cookie Section
var cookieSession = require("cookie-session");

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.post("/petition", (req, res) => {
    req.session;
    console.log("Session: ", req.session);

    // reading data from a cookie
    // console.log(req.session.sigId);       --> SignatureFieldValue

    // putting data into a cookie
    req.session.loggedIn = true;

    req.session.sigId = 58; // this needs to be dynamic
    // each Signature gets a cookie where the sigID must be stored

    req.session.muffin = "blueberry";

    // How to figure out the id that was just generated when the INSERT is successful?
});

// Redirect slash Route to /petition

app.get("/", (req, res) => {
    res.redirect("/petition");
});

app.get("/petition", (req, res) => {
    res.render("petition", {
        layout: "main",
        Title: "Front Page"
    });
});

// Making Post Route from FORM on page for User

app.post("/petition", (req, res) => {
    // console.log(req.body.Input); --> doesn't work, only in Front
    db.addName(req.body.first_name, req.body.last_name, req.body.input)
        // req.body.signature  --> add in parameters for getting value

        .then(() => {
            console.log("yay it worked!");
            res.redirect("/petition/signed");
            console.log(req.body);
        })
        .catch(err => {
            console.log("err in addName: ", err);
        });
});

// Redirecting to signed Page

app.get("/petition/signed", (req, res) => {
    db.getNumber().then(results => {
        res.render("signed", {
            layout: "main",
            NamesEntries: results.rows,
            Title: "Last Page",
            redirect: "/petition/signers"
        });
        console.log("results rows: ", results.rows);
    });

    // call out Cookie Signature Id

    // once you have the big signature url in this route,
    // you can render it on screen by putting it in an img tag
});

// Showing List of User, who signed

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
