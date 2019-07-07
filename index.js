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
    console.log(req.body);
    db.addName(req.body.FirstName, req.body.LastName)
        // req.body.signature  --> add in parameters for getting value
        .then(() => {
            console.log("yay it worked!");
            res.redirect("/petition/signed");
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
            Title: "Last Page"
        });
        console.log("results rows: ", results.rows);
    });
});

// Showing List of User, who signed

app.get("/signers", (req, res) => {
    // do the same app.get signatures
    // canvas count

    res.render("signers", {
        layout: "main",
        Title: "Signers Page"
    });
});

app.listen(8080, () => console.log("8080 Listening!"));
