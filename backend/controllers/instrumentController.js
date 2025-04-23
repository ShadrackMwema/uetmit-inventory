const Instrument = require('../models/Instrument');
const ChecklistHistory = require('../models/ChecklistHistory');

// Get all instruments
exports.getAllInstruments = async (req, res) => {
    try {
        const instruments = await Instrument.find();
        res.status(200).json(instruments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single instrument by ID
exports.getInstrumentById = async (req, res) => {
    try {
        const instrument = await Instrument.findById(req.params.id);
        if (!instrument) {
            return res.status(404).json({ message: 'Instrument not found' });
        }
        res.status(200).json(instrument);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new instrument
exports.createInstrument = async (req, res) => {
    const instrument = new Instrument({
        name: req.body.name,
        type: req.body.type,
        quantity: req.body.quantity,
        condition: req.body.condition || 'Good',
        inPossession: req.body.inPossession !== undefined ? req.body.inPossession : true,
        dateAdded: req.body.dateAdded,
    });

    try {
        const savedInstrument = await instrument.save();
        
        // Create history entry for new instrument
        const historyEntry = new ChecklistHistory({
            instrumentId: savedInstrument._id,
            instrumentName: savedInstrument.name,
            action: 'Added',
            currentState: {
                type: savedInstrument.type,
                quantity: savedInstrument.quantity,
                condition: savedInstrument.condition,
                inPossession: savedInstrument.inPossession
            },
            notes: 'Instrument added to inventory'
        });
        await historyEntry.save();
        
        res.status(201).json(savedInstrument);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an instrument
exports.updateInstrument = async (req, res) => {
    try {
        // Get the current state before updating
        const oldInstrument = await Instrument.findById(req.params.id);
        if (!oldInstrument) {
            return res.status(404).json({ message: 'Instrument not found' });
        }

        // Update the instrument
        const updatedInstrument = await Instrument.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        
        // Determine the type of action
        let action = 'Updated';
        if (oldInstrument.inPossession && !updatedInstrument.inPossession) {
            action = 'Checked Out';
        } else if (!oldInstrument.inPossession && updatedInstrument.inPossession) {
            action = 'Checked In';
        }

        // Create history entry for the update
        const historyEntry = new ChecklistHistory({
            instrumentId: updatedInstrument._id,
            instrumentName: updatedInstrument.name,
            action: action,
            previousState: {
                type: oldInstrument.type,
                quantity: oldInstrument.quantity,
                condition: oldInstrument.condition,
                inPossession: oldInstrument.inPossession
            },
            currentState: {
                type: updatedInstrument.type,
                quantity: updatedInstrument.quantity,
                condition: updatedInstrument.condition,
                inPossession: updatedInstrument.inPossession
            },
            notes: req.body.notes || `Instrument ${action.toLowerCase()}`
        });
        await historyEntry.save();
        
        res.status(200).json(updatedInstrument);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an instrument
exports.deleteInstrument = async (req, res) => {
    try {
        const instrument = await Instrument.findById(req.params.id);
        if (!instrument) {
            return res.status(404).json({ message: 'Instrument not found' });
        }
        
        // Create history record before deleting
        const historyEntry = new ChecklistHistory({
            instrumentId: instrument._id,
            instrumentName: instrument.name,
            action: 'Removed',
            previousState: {
                type: instrument.type,
                quantity: instrument.quantity,
                condition: instrument.condition,
                inPossession: instrument.inPossession
            },
            notes: 'Instrument removed from inventory'
        });
        await historyEntry.save();
        
        // Now delete the instrument
        await Instrument.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle possession status
exports.togglePossession = async (req, res) => {
    try {
        const instrument = await Instrument.findById(req.params.id);
        if (!instrument) {
            return res.status(404).json({ message: 'Instrument not found' });
        }

        const newStatus = !instrument.inPossession;
        instrument.inPossession = newStatus;
        
        const updatedInstrument = await instrument.save();
        
        // Create history entry
        const historyEntry = new ChecklistHistory({
            instrumentId: instrument._id,
            instrumentName: instrument.name,
            action: newStatus ? 'Checked In' : 'Checked Out',
            previousState: {
                inPossession: !newStatus
            },
            currentState: {
                inPossession: newStatus
            },
            notes: req.body.notes || `Instrument ${newStatus ? 'checked in' : 'checked out'}`
        });
        await historyEntry.save();
        
        res.status(200).json(updatedInstrument);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};