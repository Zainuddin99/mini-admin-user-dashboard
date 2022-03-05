module.exports.verifyAdmin = (req, res, next) => {
    if (req.admin) {
        next();
    } else {
        console.log("User is not admin");
        res.status(401).json({ message: "Anauthourised request!" });
    }
};
