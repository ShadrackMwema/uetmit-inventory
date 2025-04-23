import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const NewChecklist = () => {
    const history = useHistory();
    const [instruments, setInstruments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [directorName, setDirectorName] = useState('');
    const [notes, setNotes] = useState('');
    const [checklistItems, setChecklistItems] = useState([]);
    const [checklistTitle, setChecklistTitle] = useState(`Checklist ${new Date().toLocaleDateString()}`);
    const [checklistDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchInstruments();
    }, []);

    const fetchInstruments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/instruments');
            setInstruments(response.data);
            
            // Initialize checklist items from instruments
            const items = response.data.map(instrument => ({
                instrumentId: instrument._id,
                name: instrument.name,
                type: instrument.type,
                quantity: instrument.quantity,
                condition: instrument.condition || 'Good',
                inPossession: instrument.inPossession,
                notes: ''
            }));
            
            setChecklistItems(items);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching instruments:', error);
            setError('Failed to load instruments. Please try again later.');
            setLoading(false);
        }
    };

    const handleToggle = (id) => {
        setChecklistItems(prevItems => 
            prevItems.map(item => 
                item.instrumentId === id 
                ? { ...item, inPossession: !item.inPossession } 
                : item
            )
        );
    };

    const handleConditionChange = (id, newCondition) => {
        setChecklistItems(prevItems => 
            prevItems.map(item => 
                item.instrumentId === id 
                ? { ...item, condition: newCondition } 
                : item
            )
        );
    };

    const handleItemNoteChange = (id, note) => {
        setChecklistItems(prevItems => 
            prevItems.map(item => 
                item.instrumentId === id 
                ? { ...item, notes: note } 
                : item
            )
        );
    };

    const handleSubmitChecklist = async () => {
        if (!directorName.trim()) {
            alert('Please enter Director name for accountability');
            return;
        }

        try {
            setLoading(true);
            
            // Save the complete checklist
            const checklistData = {
                title: checklistTitle,
                directorName,
                date: checklistDate,
                notes,
                items: checklistItems
            };
            
            // First save the checklist
            await axios.post('http://localhost:5000/api/checklists', checklistData);
            
            // Then create history entries for each changed item
            for (const item of checklistItems) {
                const originalInstrument = instruments.find(i => i._id === item.instrumentId);
                
                if (!originalInstrument) continue;
                
                // Check if anything changed
                const statusChanged = originalInstrument.inPossession !== item.inPossession;
                const conditionChanged = originalInstrument.condition !== item.condition;
                
                if (statusChanged || conditionChanged) {
                    let action = 'Updated';
                    if (statusChanged) {
                        action = item.inPossession ? 'Checked In' : 'Checked Out';
                    }
                    
                    await axios.post('http://localhost:5000/api/history', {
                        instrumentId: item.instrumentId,
                        instrumentName: item.name,
                        action,
                        previousState: {
                            condition: originalInstrument.condition,
                            inPossession: originalInstrument.inPossession
                        },
                        currentState: {
                            condition: item.condition,
                            inPossession: item.inPossession
                        },
                        notes: `${action} by director: ${directorName}. ${item.notes || notes}`,
                        performedBy: directorName
                    });
                }
            }
            
            alert('Checklist saved successfully!');
            history.push('/checklists'); // Redirect to checklists view instead of history
        } catch (error) {
            console.error('Error saving checklist:', error);
            alert('Failed to save checklist. Please try again.');
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading instruments...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="new-checklist">
            <div className="print-header">
                <img src={process.env.PUBLIC_URL + "/image.png"} alt="UET MIT Logo" className="print-logo" />
                <h2>New Instruments Checklist</h2>
            </div>
            
            <div className="checklist-form">
                <div className="form-group">
                    <label htmlFor="checklistTitle">Checklist Title:</label>
                    <input
                        type="text"
                        id="checklistTitle"
                        value={checklistTitle}
                        onChange={(e) => setChecklistTitle(e.target.value)}
                        placeholder="Enter checklist title"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="directorName">Director Name (for accountability):</label>
                    <input
                        type="text"
                        id="directorName"
                        value={directorName}
                        onChange={(e) => setDirectorName(e.target.value)}
                        placeholder="Enter director's name"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="checklistDate">Checklist Date:</label>
                    <input
                        type="date"
                        id="checklistDate"
                        value={checklistDate}
                        readOnly
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="notes">Notes:</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any relevant notes about this checklist"
                        rows="3"
                    ></textarea>
                </div>
            </div>
            
            <div className="table-responsive">
                <table className="instruments-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Condition</th>
                            <th>Quantity</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {checklistItems.map((item) => (
                            <tr key={item.instrumentId} className={item.inPossession ? '' : 'checked-out'}>
                                <td data-label="Status">
                                    <div className="possession-toggle">
                                        <label className="switch">
                                            <input 
                                                type="checkbox" 
                                                checked={item.inPossession} 
                                                onChange={() => handleToggle(item.instrumentId)}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                        <span className="possession-label">
                                            {item.inPossession ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </td>
                                <td data-label="Name">{item.name}</td>
                                <td data-label="Type">{item.type}</td>
                                <td data-label="Condition">
                                    <select 
                                        className={`condition-select condition-${item.condition.toLowerCase()}`}
                                        value={item.condition}
                                        onChange={(e) => handleConditionChange(item.instrumentId, e.target.value)}
                                    >
                                        <option value="Excellent">Excellent</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>
                                        <option value="Damaged">Damaged</option>
                                    </select>
                                </td>
                                <td data-label="Quantity">{item.quantity}</td>
                                <td data-label="Notes">
                                    <input
                                        type="text"
                                        className="item-note"
                                        value={item.notes || ''}
                                        onChange={(e) => handleItemNoteChange(item.instrumentId, e.target.value)}
                                        placeholder="Item note"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="form-actions">
                <button onClick={handleSubmitChecklist} className="button">Save Checklist</button>
                <button onClick={() => history.push('/')} className="button cancel">Cancel</button>
            </div>
        </div>
    );
};

export default NewChecklist;
