const Checklist = require('../models/Checklist');
const Instrument = require('../models/Instrument');

// Get all checklists
exports.getAllChecklists = async (req, res) => {
    try {
        const checklists = await Checklist.find()
            .sort({ date: -1 });
        res.status(200).json(checklists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single checklist
exports.getChecklistById = async (req, res) => {
    try {
        const checklist = await Checklist.findById(req.params.id);
        if (!checklist) {
            return res.status(404).json({ message: 'Checklist not found' });
        }
        res.status(200).json(checklist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new checklist
exports.createChecklist = async (req, res) => {
    try {
        const { title, directorName, date, notes, items } = req.body;
        
        // Create new checklist
        const newChecklist = new Checklist({
            title,
            directorName,
            date: date || new Date(),
            notes,
            items,
            totalItems: items ? items.length : 0
        });
        
        const savedChecklist = await newChecklist.save();
        
        // Update instruments with the new conditions and possession statuses
        if (items && items.length > 0) {
            for (const item of items) {
                await Instrument.findByIdAndUpdate(
                    item.instrumentId,
                    { 
                        condition: item.condition,
                        inPossession: item.inPossession
                    }
                );
            }
        }
        
        res.status(201).json(savedChecklist);
    } catch (error) {
        console.error('Error creating checklist:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a checklist
exports.deleteChecklist = async (req, res) => {
    try {
        const checklist = await Checklist.findById(req.params.id);
        if (!checklist) {
            return res.status(404).json({ message: 'Checklist not found' });
        }
        
        await Checklist.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Checklist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
