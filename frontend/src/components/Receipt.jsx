import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Receipt = () => {
    const [instruments, setInstruments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date] = useState(new Date().toLocaleDateString());

    useEffect(() => {
        const fetchInstruments = async () => {
            try {
                const response = await axios.get('https://backend-2e41jr3zw-shadracks-projects-a6bc7ac0.vercel.app/api/instruments');
                setInstruments(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching instruments:', error);
                setLoading(false);
            }
        };

        fetchInstruments();
    }, []);

    if (loading) return <div className="loading">Loading receipt data...</div>;

    return (
        <div className="receipt">
            <div className="print-header">
                <img src={process.env.PUBLIC_URL + "/image.png"} alt="UET MIT Logo" className="print-logo" />
                <h2>UET MIT Instruments Receipt</h2>
            </div>
            <p><strong>Date:</strong> {date}</p>
            <h3>Instruments List:</h3>
            {instruments.length === 0 ? (
                <p>No instruments found in the inventory.</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instruments.map((instrument) => (
                                <tr key={instrument._id}>
                                    <td>{instrument.name}</td>
                                    <td>{instrument.type}</td>
                                    <td>{instrument.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p><strong>Total Items:</strong> {instruments.reduce((total, item) => total + item.quantity, 0)}</p>
                </>
            )}
            <button onClick={() => window.print()} className="button">Print Receipt</button>
        </div>
    );
};

export default Receipt;