const express = require('express');
const router = express.Router();
const instrumentController = require('../controllers/instrumentController');
const historyController = require('../controllers/historyController');
const checklistController = require('../controllers/checklistController');

// Instrument routes
router.get('/instruments', instrumentController.getAllInstruments);
router.get('/instruments/:id', instrumentController.getInstrumentById);
router.post('/instruments', instrumentController.createInstrument);
router.put('/instruments/:id', instrumentController.updateInstrument);
router.delete('/instruments/:id', instrumentController.deleteInstrument);
router.patch('/instruments/:id/possession', instrumentController.togglePossession);

// History routes
router.get('/history', historyController.getAllHistory);
router.get('/history/instrument/:instrumentId', historyController.getInstrumentHistory);
router.post('/history', historyController.createHistoryEntry);

// Checklist routes
router.get('/checklists', checklistController.getAllChecklists);
router.get('/checklists/:id', checklistController.getChecklistById);
router.post('/checklists', checklistController.createChecklist);
router.delete('/checklists/:id', checklistController.deleteChecklist);

module.exports = router;