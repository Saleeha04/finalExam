const mongoose = require('mongoose');
const attraction = require('./attraction')

const visitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^([a-zA-Z0-9_\.-]+)@([a-zA-Z0-9_\.-]+)\.([a-zA-Z\.]{2,6})$/, 
            'Please enter a valid email address'
        ]
    },
    visitedAttractions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'attraction'
        }
    ]
});

module.exports = mongoose.model('Visitor', visitorSchema);