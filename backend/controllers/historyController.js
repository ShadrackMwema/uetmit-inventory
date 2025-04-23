const ChecklistHistory = require('../models/ChecklistHistory');

// Get all history entries
exports.getAllHistory = async (req, res) => {
    try {
        const history = await ChecklistHistory.find()
            .sort({ timestamp: -1 }); // Sort by timestamp descending (newest first)
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get history entries for a specific instrument
exports.getInstrumentHistory = async (req, res) => {
    try {
        const history = await ChecklistHistory.find({ 
            instrumentId: req.params.instrumentId 
        }).sort({ timestamp: -1 });
        
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a history entry
exports.createHistoryEntry = async (req, res) => {
    const historyEntry = new ChecklistHistory({
        instrumentId: req.body.instrumentId,
        instrumentName: req.body.instrumentName,
        action: req.body.action,
        previousState: req.body.previousState,
        currentState: req.body.currentState,
        notes: req.body.notes,
        performedBy: req.body.performedBy || 'System User'
    });

    try {
        const savedEntry = await historyEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
