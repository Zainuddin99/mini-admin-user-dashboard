const usersModel = require("../Models/user");
const { createError } = require("../config/customErrors");
const { addActivity } = require("./activities");

module.exports.addProduct = async (req, res, next) => {
    try {
        const { name, description, price } = req.body;
        if (!name || !description || !price || !req.file.path) {
            return next(createError(400, "Required data's are missing!"));
        }
        await usersModel.updateOne(
            { _id: req.params.userId },
            {
                $push: {
                    products: {
                        name,
                        description,
                        price,
                        imageUrl: process.env.SERVER_URL + "/" + req.file.path,
                    },
                },
            }
        );
        await addActivity(req, "create", "Created product");
        res.json({ message: "Successfully added" });
    } catch (error) {
        next(error);
    }
};

module.exports.getProducts = async (req, res, next) => {
    try {
        const userDetails = await usersModel
            .findOne({ _id: req.params.userId })
            .select("products");
        if (!userDetails) {
            return next(createError(400, "No data found!"));
        }
        res.json({ message: userDetails.products });
    } catch (error) {
        next(error);
    }
};

module.exports.updateProduct = async (req, res, next) => {
    try {
        const { productId, userId } = req.params;
        const { name, description, price } = req.body;
        if (!name || !description || !price) {
            return next(createError(400, "Required data's are missing!"));
        }
        const productExist = await usersModel.findOneAndUpdate(
            { _id: userId, "products._id": productId },
            {
                $set: {
                    "products.$.name": name,
                    "products.$.description": description,
                    "products.$.price": price,
                },
            }
        );
        if (!productExist) {
            return next(createError(404, "Product not found!"));
        }
        //Update image if image added
        if (req?.file?.path) {
            await usersModel.updateOne(
                { _id: userId, "products._id": productId },
                {
                    $set: {
                        "products.$.imageUrl":
                            process.env.SERVER_URL + "/" + req.file.path,
                    },
                }
            );
        }
        await addActivity(req, "update", "Updated a product");
        res.json({ message: "Product updated" });
    } catch (error) {
        next(error);
    }
};

module.exports.deleteProduct = async (req, res, next) => {
    try {
        const { userId, productId } = req.params;
        await usersModel.updateOne(
            { _id: userId },
            {
                $pull: { products: { _id: productId } },
            }
        );
        await addActivity(req, "delete", "Deleted a product");
        res.json({ message: "Product deleted" });
    } catch (error) {
        next(error);
    }
};
