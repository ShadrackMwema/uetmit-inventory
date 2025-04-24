const mongoose = require('mongoose');

async function createIndexes() {
  try {
    console.log('Setting up database indexes...');
    
    // Create indexes for the Instrument collection
    const Instrument = mongoose.model('Instrument');
    await Instrument.collection.createIndex({ name: 1 });
    await Instrument.collection.createIndex({ type: 1 });
    await Instrument.collection.createIndex({ condition: 1 });
    await Instrument.collection.createIndex({ inPossession: 1 });
    
    // Create indexes for the ChecklistHistory collection
    const ChecklistHistory = mongoose.model('ChecklistHistory');
    await ChecklistHistory.collection.createIndex({ instrumentId: 1 });
    await ChecklistHistory.collection.createIndex({ action: 1 });
    await ChecklistHistory.collection.createIndex({ timestamp: -1 });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating database indexes:', error);
  }
}

module.exports = { createIndexes };
