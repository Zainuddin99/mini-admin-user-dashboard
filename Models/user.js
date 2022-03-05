const mongoose = require('mongoose');
const {Schema, model} = mongoose
const { isEmail } = require("validator");

const productsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
},{
    timestamps: true,
    versionKey: false
});

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: [isEmail, "Invalid email"],
        unique: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type:String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    products: [productsSchema]
},{
    versionKey: false,
    timestamps: true
})

module.exports = model("Users", userSchema)