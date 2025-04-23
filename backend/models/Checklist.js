const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
    instrumentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instrument'
    },
    name: String,
    type: String,
    quantity: Number,
    condition: String,
    inPossession: Boolean,
    notes: String
});

const checklistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    directorName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    items: [checklistItemSchema],
    notes: String,
    totalItems: Number,
});

module.exports = mongoose.model('Checklist', checklistSchema);
