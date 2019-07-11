// You can make a middleware file to export function

exports.requireLoggedOut = function requireLoggedOut(req, res, next) {
    if (req.session.userId) {
        return res.redirect("/petition");
    }
    // res.sendStatus(200);
    next();
};

exports.requireSigned = function requireSigned(req, res, next) {
    if (!req.session.signatureId) {
        return res.redirect("/petition");
    }
    // res.sendStatus(200);
    next();
};

exports.requireNoSignature = function requireNoSignature(req, res, next) {
    if (req.session.userId) {
        return res.redirect("/thanks");
    }
    // res.sendStatus(200);
    next();
};
