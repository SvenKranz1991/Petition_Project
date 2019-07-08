debugging

When you encounter a bug, that doesn't mean your a bad developer or stupid -- it just part of our lives

1. Should I fix this bug right now?

-   Primary experiences - logging in / registering, signing the petition
-   Secondary experiences - number of signers on "thank-you" page doesn't show
-   Every major website you visit has bugs

2. read the error message

    - note where the error appeared.

        - "relations actors doesn't exist"
        - did it appear in the Dev Tools? Or in your Terminal?

        - if you don't see an error message, that likely means you're not catching your errors!

3. pinpoint where the bug is happening.

    - What was the expected behavior of this code? In other words... what did I think would happen?
    - What actually happened?

4. sometimes... you'll have to get a bit frustrated and bang your head against ( not literally ).
   That's ok, that's part of the learning process :)

5. try by yourself to fix the bug for at least 30min

6. Ask your peers for help.

    - obvious benefit is that your classmates might have the answer
    - rubber duck principle: discussing your bug out loud can help you find it. Sometimes you need a peer to describe your bug at, and this in and or itself can help you discover the bug

7. Ask a teacher

    - we should be your last resort

    - spend a few minutes thinking about how to explain your bug... saying "It doesn't work" tells Ivana nothing..................................................................

    - know how to replicate the bug. Demo the bug


    ________________________

    TAKE BREAAAAAKS :D

---

NOTES FOR PART 2

Cookies are tiny!
They can only store about 4000 bytes. (that's 4kb).

Because cookies are so small we can't store the user's signature in a cookie.

We CAN store a reference to the signature in a cookie. The reference in this case will be the id that was generated when a signature was inserted.

// SERVERs gonna expect two Cookies
// btoa(insert cookie value - encryption)

psql signatures -f signatures.sql

// ALTER to change the name of a column

// when we start a SERVER
// have a database in bash
// sql in postgres

// create the database once
createdb
nameOfDatabase in bash

// psql signatures -f signatures.sql

// run the create table commands once and every time you change the create table command (let's say you change the name of a column, or add a column, etc.)

// Every time we make a change to a SQL file, we MUST run a psql nameOfDatabase -f nameOfFile.sql

// Is my database storing data

// Handlebars - how to show list of signings

//

FROM JULES

Eventlistener

canvas.addEventListener("mouseup", () => {
drawing = false;
\$('input[name="signature"]').val(canvas.toDataURL());
});

POST

app.post("/petition", (req, res) => {
// console.log(req.body);
// console.log(req.body.signature);

    db.addSignature(req.body.firstname, req.body.lastname, req.body.signature)
        .then(() => {
            res.redirect("/petition/petitioners");
        })
        .catch(err => {
            console.log("add signature input error", err.message);
        });

});

THE OLD WAYS

input.value = sigField.toDataURL();
console.log(input.value);
painting = false;
