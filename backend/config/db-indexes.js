const mongoose = require('mongoose');

async function createIndexes() {
  try {
    console.log('Setting up database indexes...');
    
    // Create indexes for the collections
    const db = mongoose.connection;
    
    // Create indexes for instruments collection
    await db.collection('instruments').createIndex({ name: 1 });
    await db.collection('instruments').createIndex({ type: 1 });
    await db.collection('instruments').createIndex({ condition: 1 });
    await db.collection('instruments').createIndex({ inPossession: 1 });
    
    // Create indexes for checklist history
    await db.collection('checklisthistories').createIndex({ instrumentId: 1 });
    await db.collection('checklisthistories').createIndex({ timestamp: -1 });

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating database indexes:', error);
  }
}

module.exports = { createIndexes };
