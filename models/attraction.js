const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    entryFee: {
        type: Number,
        required: true,
        min: [0, 'Entry fee must be greater than or equal to 0']
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be between 0 and 5'],
        max: [5, 'Rating must be between 0 and 5']
    }
});

module.exports = mongoose.model('attraction', attractionSchema);