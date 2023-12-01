const mongoose = require("mongoose");

function createShortURL() {
    var chars = "QWERTYUIOPASDFGHJKLZXCVBNMabcdefghijklmnopqrstuvwxyz1234567890";
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
}, {
    timestamps: true
});

module.exports = mongoose.model("URL", URLSchema);
