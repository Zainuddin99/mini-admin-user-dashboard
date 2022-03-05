const activityModel = require("../Models/activities");

module.exports.getAactivities = async (req, res, next) => {
    try {
        const response = await activityModel
            .find()
            .populate("user", "name admin")
            .sort({ _id: -1 });
        res.json({ message: response });
    } catch (error) {
        next(error);
    }
};

//Its function to add activities
module.exports.addActivity = (req, action, description) => {
    return new Promise(async (resolve, reject) => {
        try {
            await activityModel.create({
                user: req.userId,
                action,
                description,
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};
