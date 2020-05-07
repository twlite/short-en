const mongoose = require("mongoose");

function createShortURL() {
    var chars = "QWERTYUIOPASDFGHJKLZXCVBNM-abcdefghijklmnopqrstuvwxyz_1234567890";
    let finalChar = '';
    for (var i = 0; i < 5; i++) {
        finalChar += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return finalChar;
}

const URLSchema = new mongoose.Schema({
    mainURL: {
        type: String,
        required: true
    },
    shortURL: {
        type: String,
        required: true,
        default: createShortURL
    },
    createdAt: {
        type: String,
        required: true,
        default: new Date()
    },
    createdTimestamp: {
        type: Number,
        default: Date.now,
        required: true
    },
    clicks: {
        type: Number,
        default: 0,
        required: true
    },
    nsfw: {
        type: Boolean,
        default: false,
        required: true
    }
});

module.exports = mongoose.model("URL", URLSchema);
