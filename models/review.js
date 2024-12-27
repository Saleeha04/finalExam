const mongoose = require('mongoose');
const attraction = require('./attraction');
const visitor = require('./visitor');

const reviewSchema = new mongoose.Schema({
    attraction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'attraction',
        required: true
    },
    visitor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'visitor',
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: [1, 'Score must be between 1 and 5'],
        max: [5, 'Score must be between 1 and 5']
    },
    comment: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('review', reviewSchema);