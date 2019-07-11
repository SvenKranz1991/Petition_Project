app.use((req, res, next) => {

    });

in auth_routes.js

const app = require('./index');

const { requireLoggedOut } = require ('./middleware');

// auth_routes.js

const app = exports.app = express();

// profile-routes.js

const express = require('express');
const router = exports.router = express.Router();

router.get('/profile', (req, res) => {
res.sendStatus(200);
})

// index.js

const { router: profileRouter } = require('./profile-routes');

const profileRouter = require('./profile-routes').router;

// Requiring Routes from profile-routes.js
app.use(profileRouter);

app.use("/profile", profileRouter);

---> only if profileRouter is used
