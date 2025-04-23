import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PreviousChecklists = () => {
    const [checklists, setChecklists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedChecklist, setSelectedChecklist] = useState(null);

    useEffect(() => {
        fetchChecklists();
    }, []);

    const fetchChecklists = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/checklists');
            setChecklists(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching checklists:', error);
            setError('Failed to load checklists. Please try again later.');
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleViewChecklist = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/checklists/${id}`);
            setSelectedChecklist(response.data);
        } catch (error) {
            console.error('Error fetching checklist details:', error);
            alert('Failed to load checklist details.');
        }
    };

    const handleDeleteChecklist = async (id) => {
        if (window.confirm('Are you sure you want to delete this checklist?')) {
            try {
                await axios.delete(`http://localhost:5000/api/checklists/${id}`);
                setChecklists(checklists.filter(list => list._id !== id));
                if (selectedChecklist && selectedChecklist._id === id) {
                    setSelectedChecklist(null);
                }
            } catch (error) {
                console.error('Error deleting checklist:', error);
                alert('Failed to delete checklist.');
            }
        }
    };

    if (loading) return <div className="loading">Loading checklists...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="previous-checklists">
            <h2>Instrument Checklists</h2>
            <div className="action-buttons">
                <Link to="/new-checklist" className="button">Create New Checklist</Link>
                <Link to="/" className="button">Back to Dashboard</Link>
            </div>
            
            <div className="checklists-container">
                {checklists.length === 0 ? (
                    <p>No checklists found. Create your first checklist to get started!</p>
                ) : (
                    <div className="checklist-grid">
                        <div className="checklist-list">
                            <h3>Saved Checklists</h3>
                            <ul>
                                {checklists.map((checklist) => (
                                    <li 
                                        key={checklist._id}
                                        className={selectedChecklist && selectedChecklist._id === checklist._id ? 'selected' : ''}
                                    >
                                        <div 
                                            className="checklist-item"
                                            onClick={() => handleViewChecklist(checklist._id)}
                                        >
                                            <h4>{checklist.title}</h4>
                                            <p>Date: {formatDate(checklist.date)}</p>
                                            <p>Director: {checklist.directorName}</p>
                                            <p>Items: {checklist.totalItems || checklist.items?.length || 0}</p>
                                        </div>
                                        <button 
                                            className="delete-btn small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteChecklist(checklist._id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {selectedChecklist && (
                            <div className="checklist-details">
                                <div className="print-header">
                                    <img src={process.env.PUBLIC_URL + "/image.png"} alt="UET MIT Logo" className="print-logo" />
                                    <h3>{selectedChecklist.title}</h3>
                                </div>
                                <div className="checklist-metadata">
                                    <p><strong>Date:</strong> {formatDate(selectedChecklist.date)}</p>
                                    <p><strong>Director:</strong> {selectedChecklist.directorName}</p>
                                    {selectedChecklist.notes && (
                                        <p><strong>Notes:</strong> {selectedChecklist.notes}</p>
                                    )}
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
                                            {selectedChecklist.items && selectedChecklist.items.map((item) => (
                                                <tr 
                                                    key={item._id} 
                                                    className={!item.inPossession ? 'checked-out' : ''}
                                                >
                                                    <td data-label="Status">
                                                        <span className={`status-badge ${item.inPossession ? 'status-in' : 'status-out'}`}>
                                                            {item.inPossession ? 'In' : 'Out'}
                                                        </span>
                                                    </td>
                                                    <td data-label="Name">{item.name}</td>
                                                    <td data-label="Type">{item.type}</td>
                                                    <td data-label="Condition">
                                                        <span className={`condition-badge condition-${item.condition?.toLowerCase() || 'good'}`}>
                                                            {item.condition || 'Good'}
                                                        </span>
                                                    </td>
                                                    <td data-label="Quantity">{item.quantity}</td>
                                                    <td data-label="Notes">{item.notes || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <button className="button print-btn" onClick={() => window.print()}>
                                    Print Checklist
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviousChecklists;
