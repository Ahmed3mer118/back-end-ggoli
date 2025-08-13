const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user','sub-admin'],
        default: 'user'
    },
    address: [String],

    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String
    },
    resetCode: {
        type: String
    },
    resetCodeExpires: {
        type: Date
    },
    // fine-grained permissions per user. If empty, permissions are derived from role
    permissions: {
        type: [String],
        default: undefined
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
