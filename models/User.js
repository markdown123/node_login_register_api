const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('users', UserSchema)