import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

const InstrumentForm = () => {
    const { id } = useParams();
    const history = useHistory();
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        quantity: 1,
        condition: 'Good',
        inPossession: true,
        dateAdded: new Date().toISOString().split('T')[0],
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            fetchInstrument(id);
        }
    }, [id]);

    const fetchInstrument = async (instrumentId) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://uetmit-inventory.vercel.app/api/instruments/${instrumentId}`);
            const instrument = response.data;
            
            // Format date for input field
            const formattedDate = instrument.dateAdded 
                ? new Date(instrument.dateAdded).toISOString().split('T')[0] 
                : new Date().toISOString().split('T')[0];
            
            setFormData({
                name: instrument.name,
                type: instrument.type,
                quantity: instrument.quantity,
                condition: instrument.condition || 'Good',
                inPossession: instrument.inPossession !== undefined ? instrument.inPossession : true,
                dateAdded: formattedDate,
                notes: ''
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching instrument:', error);
            alert('Failed to load instrument data. Please try again.');
            setLoading(false);
            history.push('/');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : 
                    name === 'quantity' ? parseInt(value, 10) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            if (isEdit) {
                await axios.put(`https://uetmit-inventory.vercel.app/api/instruments/${id}`, {
                    ...formData,
                    notes: formData.notes || `Instrument updated on ${new Date().toLocaleDateString()}`
                });
                alert('Instrument updated successfully!');
            } else {
                await axios.post('https://uetmit-inventory.vercel.app/api/instruments', formData);
                alert('Instrument added successfully!');
            }
            
            setLoading(false);
            history.push('/');
        } catch (error) {
            console.error('Error saving instrument:', error);
            alert(`Failed to ${isEdit ? 'update' : 'add'} instrument. Please check your input and try again.`);
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="instrument-form">
            <h2>{isEdit ? 'Edit Instrument' : 'Add New Instrument'}</h2>
            
            <div className="form-group">
                <label htmlFor="name">Instrument Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="type">Instrument Type:</label>
                <input
                    type="text"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="quantity">Quantity:</label>
                <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="condition">Condition:</label>
                <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                    <option value="Damaged">Damaged</option>
                </select>
            </div>
            
            <div className="form-group checkbox-group">
                <label className="checkbox-container">
                    <input
                        type="checkbox"
                        id="inPossession"
                        name="inPossession"
                        checked={formData.inPossession}
                        onChange={handleChange}
                    />
                    <span className="checkbox-label">Currently in Possession</span>
                </label>
            </div>
            
            <div className="form-group">
                <label htmlFor="dateAdded">Date Added:</label>
                <input
                    type="date"
                    id="dateAdded"
                    name="dateAdded"
                    value={formData.dateAdded}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="notes">Notes:</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Optional notes about this update"
                ></textarea>
            </div>
            
            <div className="form-actions">
                <button type="submit" className="button">{isEdit ? 'Update' : 'Add'} Instrument</button>
                <button type="button" className="button cancel" onClick={() => history.push('/')}>Cancel</button>
            </div>
        </form>
    );
};

export default InstrumentForm;