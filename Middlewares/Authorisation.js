const { createError } = require("../config/customErrors");
const usersModel = require("../Models/user");
const jwt = require("jsonwebtoken");

module.exports.authorisation = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            console.log("Token not found!");
            return next(createError(401, "Unauthorised"));
        }
        const decodedData = jwt.verify(
            token.split(" ")[1],
            process.env.AUTH_SECRET
        );
        const userExist = await usersModel
            .findOne({ _id: decodedData.userId })
            .select("name _id admin");
        if (!userExist) {
            console.log("User not found!");
            return next(createError(401, "Unauthorized"));
        }
        if (req.originalUrl.includes("/decodeVerifyToken")) {
            //Only for /decodeVerifyToken route
            req.userDetails = userExist;
        }
        req.userId = decodedData.userId;
        req.admin = decodedData.admin;
        next();
    } catch (error) {
        console.log(error);
        next(createError(401, "Unauthorised"));
    }
};
