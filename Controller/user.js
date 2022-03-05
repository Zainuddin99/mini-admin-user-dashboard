const { createError } = require("../config/customErrors");
const userModel = require("../Models/user");
const activityModel = require("../Models/activities");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { addActivity } = require("./activities");

module.exports.addUser = async (req, res, next) => {
    try {
        const { name, password, phone, address, email } = req.body;
        if (!name || !password || !phone || !address || !email) {
            return next(createError(400, "Please send required fields!"));
        }
        const emailExist = await userModel.findOne({ email });
        if (emailExist) {
            return next(createError(400, "Email already exists"));
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await userModel.create({
            name,
            password: hashedPassword,
            phone,
            address,
            email,
        });
        await addActivity(req, "create", "Created new user");
        res.status(201).json({ message: "User created" });
    } catch (error) {
        next(error);
    }
};

module.exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const isAdmin = await userModel.findOne({ _id: userId, admin: true });
        if (isAdmin) {
            console.log("Admin cannot be deleted!");
            return next(createError(400, "Invalid operation!"));
        }
        await userModel.deleteOne({ _id: userId });
        await activityModel.deleteMany({ user: userId });
        await addActivity(req, "delete", "Deleted user");
        res.json({ message: "User deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find({ admin: false }).sort({ _id: -1 });
        const usersPromise = users.map(async (user) => {
            const { name, email, phone, address, products, _id, createdAt } =
                user._doc;
            const lastActivities = await activityModel
                .find({ user: _id })
                .limit(3)
                .sort({ _id: -1 });
            return {
                name,
                email,
                phone,
                address,
                totalProducts: products.length,
                lastActivities,
                createdAt,
                _id,
            };
        });
        const finalResponse = await Promise.all(usersPromise);
        res.json({ message: finalResponse });
    } catch (error) {
        next(error);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(createError(400, "Invalid request!"));
        }
        const userExist = await userModel.findOne({ email });
        if (!userExist) {
            return next(createError(400, "No user found!"));
        }
        const validPassword = await bcrypt.compare(
            password,
            userExist.password
        );
        if (!validPassword) {
            return next(createError(400, "Invalid password"));
        }
        const token = jwt.sign(
            { userId: userExist._id, admin: userExist.admin },
            process.env.AUTH_SECRET,
            { expiresIn: "2h" }
        );
        req.userId = userExist._id;
        await addActivity(req, "login", "Logged in into system");
        res.json({
            message: "Succesfull",
            payload: { token, admin: userExist.admin, name: userExist.name, userId: userExist._id},
        });
    } catch (error) {
        next(error);
    }
};

module.exports.logout = async (req, res, next) => {
    try {
        await addActivity(req, "logout", "Logged out from system");
        res.json({ message: "Successfully logged out" });
    } catch (error) {
        next(error);
    }
};

module.exports.decodeVerifyToken = async (req, res, next) => {
    try {
        //Comming from authorisation middleware
        const { name, admin, _id } = req.userDetails;
        res.json({
            message: "Authenticated",
            payload: { name, admin, userId: _id },
        });
    } catch (error) {
        next(error);
    }
};
