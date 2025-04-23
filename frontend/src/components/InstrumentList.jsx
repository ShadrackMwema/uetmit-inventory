import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const InstrumentList = () => {
    const [instruments, setInstruments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInstruments();
    }, []);

    const fetchInstruments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/instruments');
            setInstruments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching instruments:', error);
            setError('Failed to load instruments. Please try again later.');
            setLoading(false);
        }
    };

    const deleteInstrument = async (id) => {
        if (window.confirm('Are you sure you want to delete this instrument?')) {
            try {
                await axios.delete(`http://localhost:5000/api/instruments/${id}`);
                // Update the UI by removing the deleted instrument
                setInstruments(instruments.filter(instrument => instrument._id !== id));
            } catch (error) {
                console.error('Error deleting instrument:', error);
                alert('Failed to delete instrument. Please try again.');
            }
        }
    };

    if (loading) return <div className="loading">Loading instruments...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="instrument-list">
            <h2>Instruments Inventory</h2>
            <div className="action-buttons">
                <Link to="/add" className="button">Add New Instrument</Link>
                <Link to="/new-checklist" className="button">Perform Checklist</Link>
                <Link to="/history" className="button history-btn">View History</Link>
            </div>
            
            {instruments.length === 0 ? (
                <p>No instruments found. Add some!</p>
            ) : (
                <div className="table-responsive">
                    <table className="instruments-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Condition</th>
                                <th>Quantity</th>
                                <th>Date Added</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instruments.map((instrument) => (
                                <tr key={instrument._id} className={instrument.inPossession ? '' : 'checked-out'}>
                                    <td data-label="Name">{instrument.name}</td>
                                    <td data-label="Type">{instrument.type}</td>
                                    <td data-label="Condition">
                                        <span className={`condition-badge condition-${instrument.condition?.toLowerCase() || 'good'}`}>
                                            {instrument.condition || 'Good'}
                                        </span>
                                    </td>
                                    <td data-label="Quantity">{instrument.quantity}</td>
                                    <td data-label="Date Added">{new Date(instrument.dateAdded).toLocaleDateString()}</td>
                                    <td data-label="Actions">
                                        <div className="action-buttons">
                                            <Link to={`/edit/${instrument._id}`} className="edit-btn">Edit</Link>
                                            <button 
                                                onClick={() => deleteInstrument(instrument._id)}
                                                className="delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InstrumentList;