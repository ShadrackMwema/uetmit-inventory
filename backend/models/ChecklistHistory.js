const mongoose = require('mongoose');

const checklistHistorySchema = new mongoose.Schema({
    instrumentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instrument',
        required: true
    },
    instrumentName: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ['Added', 'Checked Out', 'Checked In', 'Updated', 'Removed'],
        required: true
    },
    previousState: {
        type: Object
    },
    currentState: {
        type: Object
    },
    notes: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    performedBy: {
        type: String,
        default: 'System User'
    }
});

module.exports = mongoose.model('ChecklistHistory', checklistHistorySchema);
