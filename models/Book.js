const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publishDate: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: Date.now
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Book = mongoose.model('Book', BookSchema)
module.exports = Book;