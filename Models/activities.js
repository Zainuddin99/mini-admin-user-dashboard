const mongoose = require('mongoose');
const {Schema, model} = mongoose

const activitiesSchema = new Schema({
    action: {
        type: String,
        required: true,
        enum: ['create', 'update', "delete", "login", "logout"]
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    }
},{
    versionKey: false,
    timestamps: true,
})

module.exports = model("Activities", activitiesSchema)