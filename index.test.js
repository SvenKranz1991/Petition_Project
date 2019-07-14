const { app } = require("./index");
const supertest = require("supertest");
const cookieSession = require('cookie-session');

// we're require the cookieSession mock, not the NPM module cookie-session

test("string that describes the test", () => {});

test("GET /home returns an h1 as response", () => {
    return supertest(app)
        .get("/home")
        .then(res => {
            console.log("res: ", res);
            expect(res.statusCode).toBe(200);
            // option #1 for checking HTML of response
            expect(res.text).toBe("<h1>welcome to my website!</h1>");

            // option #2 for checking HTML of response
            expect(res.text).toContain("welcome");



        });
});

// -------------------- demo routes

app.get("/home", (req, res) => {
    res.send("<h1>welcome to my  website!</h1>");
});

app.get("/product", (req, res) => {
    res.send(`<html>
                <h1>buy my product!!!!!!!</h1>
                <form method='POST'>
                    <button>yes</button>
                    <input type='hidden' name='_csrf' value="${req.csrfToken()}">
                    </form>
            </html>`);
});

app.post("/product", (req, res) => {
    req.session.wouldLikeToBuy = true;
    res.redirect("/home");
});

// -------------------- demo routes

// run npm.text

test('POST /product redirects to /home', () => {
    return supertest(app)
    .post('/product')

    // handling user input in a test
    .send('first=testFirstName&last=testLastName&email=test@test.test&password=myTestPassword')
    .then(res => {
        .post('/product')
        .then(res => {
            console.log('res: ', res);
            expect(res.statusCode).toBe(302);
            expect(res.text).toContain('Found');
            expect(res.headers.location).toBe('/home');
        });
    });
});

app.post('/product', (req, res) => {
    req.session.wouldLikeToBuy = true;
    req.session.cute = true;
    req.session.puppy = 'Layla';
    res.redirect('/home');
});

test('POST /product sets req.session.wouldLikeToBuy to true', () => {
    // step 1: create cookie
    let cookie = {};

    // step 2: tell cookieSession mock that the "cookie" variable is our cookie, and any time a user writes data to a cookie, it should be placed in the "cookie variable"

    cookieSession.mockSessionOnce(cookie);

    return supertest(app).post('/product').then(res => {

        // the cookie variable is our cookie. It contains all the data our server wrote to the cookie in the specific route that we're testing
        console.log("cookie: ", cookie);

        expect(cookie.wouldLikeToBuy).toBe(true);
        expect(cookie.puppy).toBe('Layla');
        expect(res.statusCode).toBe(302);
    });
}); // end test
