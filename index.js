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

var cookieSession = require("cookie-session");

app.use(
    cookieSession({
        secret: `I cook rice.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

app.use(express.static("./public"));
app.use(express.static("./material"));
app.use("/favicon.ico", (req, res) => res.sendStatus(404));

app.use(cookieParser());

app.use(csurf());

const {
    notWithoutSignature,
    hasSigned,
    notWithoutRegistration
} = require("./utils/middleware");

app.use(function(req, res, next) {
    res.set("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Registration

app.get("/", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/registration");
    } else {
        res.redirect("/petition");
    }
});

app.get("/registration", (req, res) => {
    console.log("there is none");
    res.render("registration", {
        layout: "main",
        Title: "Registration Page",
        ToLogin: "/login"
    });
});

// Hash Password, Encrypt Password

app.post("/registration", (req, res) => {
    if (
        !req.body.first_name ||
        !req.body.last_name ||
        !req.body.email ||
        !req.body.password
    ) {
        res.render("registration", {
            layout: "main",
            Title: "Registration Page",
            warning: true,
            name: req.session.nameId
        });
    } else {
        enc.hashPassword(req.body.password).then(decrypt => {
            db.addRegistration(
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                decrypt
            )
                .then(result => {
                    req.session.userId = result.rows[0].id;
                    req.session.nameId = `${req.body.first_name} ${
                        req.body.last_name
                    }`;
                    console.log(
                        "Registration - New Person Registered: ",
                        req.session.userId,
                        req.session.nameId
                    );
                    res.redirect("/registration/location");
                })
                .catch(err => {
                    console.log("err in addRegistration: ", err);
                });
        });
    }
});

// User Info Location

app.get("/registration/location", notWithoutRegistration, (req, res) => {
    if (req.session.userId) {
        console.log("It's true man User Id - Location: ", req.session.userId);
        res.render("location", {
            layout: "main",
            Title: "Registration / Location",
            name: req.session.name
        });
    } else {
        res.redirect("/registration");
    }
});

app.post("/registration/location", (req, res) => {
    db.addUserInfo(
        req.body.age,
        req.body.city,
        req.body.homepage,
        req.session.userId
    )
        .then(() => {
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("err in addUserInfo: ", err);
        });
});

// Making Post Route from FORM on page for User
// Petition

app.get("/petition", notWithoutRegistration, hasSigned, (req, res) => {
    res.render("petition", {
        layout: "main",
        Title: "Front Page",
        logout: "/logout",
        editProfile: "/editProfile",
        name: req.session.nameId,
        delete: "/deleteSignature"
    });
});

app.post("/petition", (req, res) => {
    if (!req.body.input) {
        res.render("petition", {
            warning: true
        });
    } else {
        db.addSignature(req.session.userId, req.body.input)
            .then(results => {
                req.session.signId = results.rows[0].id;
                res.redirect("/petition/signed");
                console.log("The Sign: ", req.session.signId);
            })
            .catch(err => {
                console.log("err in addSignature: ", err);
            });
    }
});

app.get("/petition/signed", notWithoutSignature, (req, res) => {
    console.log("Current Sign Id: ", req.session.signId);
    db.getSignature(req.session.signId).then(signatures => {
        let theSignature = signatures.rows[0].signature;
        db.getNumber()
            .then(count => {
                res.render("signed", {
                    layout: "main",
                    NamesEntries: count.rows,
                    image: theSignature,
                    Title: "Last Page",
                    redirect: "/petition/signers",
                    logout: "/logout",
                    editProfile: "/editProfile",
                    delete: "/deleteSignature",
                    name: req.session.nameId
                });
            })
            .catch(err => {
                console.log("Error in getSignature: ", err);
            });
    });
});

// Signed

app.get("/petition/signers", notWithoutSignature, (req, res) => {
    db.getNumber().then(count => {
        let theCount = count.rows[0].count;
        console.log("My New Count: ", theCount);
        db.getUserProfiles()
            .then(profiles => {
                console.log("Rows.Homepage: ", profiles.rows);
                res.render("signers", {
                    layout: "main",
                    Title: "Signers Page",
                    NamesEntries: profiles.rows,
                    NumberOfSigners: theCount,
                    logout: "/logout",
                    editProfile: "/editProfile",
                    name: req.session.nameId,
                    homepage: profiles.rows,
                    delete: "/deleteSignature"
                });
            })
            .catch(err => {
                console.log("Err in getUserProfiles: ", err);
            });
    });
});

app.get("/petition/signers/:city", notWithoutSignature, (req, res) => {
    db.getNumber().then(count => {
        let theCount = count.rows[0].count;
        db.getPeopleFromSameCity(req.params.city)
            .then(profiles => {
                console.log("My Profile: ", profiles.rows.homepage);
                res.render("signers", {
                    layout: "main",
                    Title: "City Signers Page",
                    NamesEntries: profiles.rows,
                    NumberOfSigners: theCount,
                    logout: "/logout",
                    editProfile: "/editProfile",
                    name: req.session.nameId,
                    homepage: profiles.rows,
                    delete: "/deleteSignature",
                    reqCity: req.params.city
                });
            })
            .catch(err => {
                console.log("err in getSignersByCity: ", err);
            });
    });
});

// Login

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main",
        Title: "Login Page"
    });
});

// Making Post comparing Login Data

app.post("/login", (req, res) => {
    db.getUser(req.body.email)
        .then(account => {
            if (!account.rows[0]) {
                console.log("nothing Found");
                res.render("login", {
                    warning: true
                });
            } else {
                let userId = account.rows[0].userid;
                let signId = account.rows[0].signId;
                let nameId = account.rows[0].fullname;
                console.log("Account Found: ", account.rows[0]);
                enc.checkPassword(req.body.password, account.rows[0].password)
                    .then(match => {
                        console.log("Password: ", match);
                        req.session.userId = userId;
                        req.session.signId = signId;
                        req.session.nameId = nameId;
                        console.log(
                            "Its fine: ",
                            req.session.userId,
                            req.session.signId,
                            req.session.nameId
                        );
                        if (req.session.userId && req.session.signId) {
                            res.redirect("petition/signed");
                        } else if (!req.session.signId) {
                            res.redirect("petition");
                        } else {
                            res.render("login", {
                                warning: true
                            });
                        }
                    })
                    .catch(err => {
                        console.log("Error in assigning Cookie: ", err);
                    });
            }
        })
        .catch(err => {
            console.log("Error in getUser: ", err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

app.get("/editProfile", notWithoutRegistration, function(req, res) {
    db.getUserProfile(req.session.userId)
        .then(account => {
            console.log("The account: ", account);
            res.render("editProfile", {
                title: "Profile",
                logout: "/logout",
                delete: "/deleteSignature",
                UserProfile: account.rows,
                deleteAccount: "/deleteAccount",
                name: req.session.nameId
            });
        })
        .catch(err => {
            console.log("Error in getUser: ", err);
        });
});

/////

app.post("/editProfile", function(req, res) {
    if (req.body.password == "") {
        db.updateUsersNoPassword(
            req.session.userId,
            req.body.first_name,
            req.body.last_name,
            req.body.email
        )
            .then(() => {
                db.updateUserProfiles(
                    req.body.age,
                    req.body.city,
                    req.body.homepage,
                    req.session.userId
                );
            })
            .then(() => {
                res.redirect("/petition");
            })
            .catch(err => {
                console.log("Error in Password", err);
            });
    } else {
        enc.hashPassword(req.body.password).then(decrypt => {
            db.updateUsers(
                req.session.userId,
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                decrypt
            )
                .then(() => {
                    db.updateUserProfiles(
                        req.body.age,
                        req.body.city,
                        req.body.homepage,
                        req.session.userId
                    );
                })
                .then(() => {
                    res.redirect("/petition");
                })
                .catch(err => {
                    console.log("Error in no Password", err);
                });
        });
    }
});

// app.get("/saved", (req, res) => {
//     res.render("saved", {
//         name: req.session.name
//     });
//
//     function redirect() {
//         res.redirect("/editProfile");
//     }
//
//     setTimeout(function() {
//         redirect();
//     }, 1000);
// });

app.get("/deleteSignature", (req, res) => {
    db.deleteSignature(req.session.userId)
        .then(() => {
            delete req.session.signId;
            console.log("Signature Deleted: ", req.session.signId);
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("Error in deleteSignature: ", err);
        });
});

// app.get("/deleteAccount", (req, res) => {
//     db.deleteAccount(req.session.userId)
//         .then(() => {
//             delete req.session.userId;
//             delete req.session.signId;
//             res.redirect("/registration");
//         })
//         .catch(err => {
//             console.log("Error in deleteAccount", err);
//         });
// });

app.listen(process.env.PORT || 8080, () => console.log("8080 Listening!"));
