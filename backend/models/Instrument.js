const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    condition: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Damaged'],
        default: 'Good'
    },
    inPossession: {
        type: Boolean,
        default: true
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Instrument', instrumentSchema);