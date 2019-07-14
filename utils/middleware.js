// You can make a middleware file to export function

// exports.requireLoggedOut = function requireLoggedOut(req, res, next) {
//     if (req.session.userId) {
//         return res.redirect("/petition");
//     }
//     next();
// };

// If Is Registered

// If Has Signed

exports.notWithoutSignature = function notWithoutSignature(req, res, next) {
    if (!req.session.signId && req.url != "/petition") {
        return res.redirect("/petition");
    }
    next();
};

exports.hasSigned = function hasSigned(req, res, next) {
    if (
        req.session.userId &&
        req.session.signId &&
        req.url != "/petition/signed"
    ) {
        return res.redirect("/petition/signed");
    }
    next();
};

exports.notWithoutRegistration = function notWithoutRegistration(
    req,
    res,
    next
) {
    if (
        !req.session.userId &&
        req.url != "/registration" &&
        req.url != "/login"
    ) {
        return res.redirect("/registration");
    }
    next();
};

exports.websiteChecking = function websiteChecking(homepage) {
    if (!homepage.startsWith("http://" || "https://")) {
        homepage = "http://".concat(homepage);
    }
    return homepage;
};
