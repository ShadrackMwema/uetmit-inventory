import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ChecklistHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'added', 'updated', 'checked-in', 'checked-out', 'removed'

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://backend-2e41jr3zw-shadracks-projects-a6bc7ac0.vercel.app/api/history');
            setHistory(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching history:', error);
            setError('Failed to load history. Please try again later.');
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusChangeText = (entry) => {
        if (entry.action === 'Added') {
            return `New instrument added to inventory.`;
        }
        
        if (entry.action === 'Removed') {
            return `Instrument removed from inventory.`;
        }
        
        if (!entry.previousState || !entry.currentState) {
            return `Status updated.`;
        }
        
        const changes = [];
        
        if (entry.previousState.inPossession !== undefined && 
            entry.currentState.inPossession !== undefined && 
            entry.previousState.inPossession !== entry.currentState.inPossession) {
            changes.push(entry.currentState.inPossession ? 
                'Checked in to inventory' : 
                'Checked out from inventory');
        }
        
        if (entry.previousState.condition !== entry.currentState.condition) {
            changes.push(`Condition changed from "${entry.previousState.condition}" to "${entry.currentState.condition}"`);
        }
        
        if (entry.previousState.quantity !== entry.currentState.quantity) {
            changes.push(`Quantity changed from ${entry.previousState.quantity} to ${entry.currentState.quantity}`);
        }
        
        if (changes.length === 0) {
            return 'Details updated';
        }
        
        return changes.join('. ');
    };

    const filteredHistory = history.filter(entry => {
        if (filter === 'all') return true;
        if (filter === 'added' && entry.action === 'Added') return true;
        if (filter === 'checked-in' && entry.action === 'Checked In') return true;
        if (filter === 'checked-out' && entry.action === 'Checked Out') return true;
        if (filter === 'updated' && entry.action === 'Updated') return true;
        if (filter === 'removed' && entry.action === 'Removed') return true;
        return false;
    });

    if (loading) return <div className="loading">Loading history...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="history-container">
            <h2 className="history-title">Inventory History</h2>
            <div className="action-buttons">
                <Link to="/" className="button">Back to Dashboard</Link>
            </div>
            
            <div className="filter-controls">
                <label htmlFor="filter">Filter by action:</label>
                <select 
                    id="filter" 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Actions</option>
                    <option value="added">Added</option>
                    <option value="updated">Updated</option>
                    <option value="checked-in">Checked In</option>
                    <option value="checked-out">Checked Out</option>
                    <option value="removed">Removed</option>
                </select>
            </div>
            
            {filteredHistory.length === 0 ? (
                <p className="history-empty">No history entries found matching your filter criteria.</p>
            ) : (
                <div className="history-timeline">
                    {filteredHistory.map((entry) => (
                        <div key={entry._id} className={`history-item history-${entry.action.toLowerCase().replace(' ', '-')}`}>
                            <div className="history-content">
                                <div className="history-date">{formatDate(entry.timestamp)}</div>
                                <h3>
                                    <span className={`action-badge action-${entry.action.toLowerCase().replace(' ', '-')}`}>
                                        {entry.action}
                                    </span>
                                    {entry.instrumentName}
                                </h3>
                                <p className="change-description">{getStatusChangeText(entry)}</p>
                                {entry.notes && <p className="notes"><strong>Notes:</strong> {entry.notes}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChecklistHistory;
