import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../config';
import { 
  FaThLarge, 
  FaClipboardList, 
  FaListAlt, 
  FaHistory, 
  FaBoxOpen,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalInstruments: 0,
        checkedOut: 0,
        excellent: 0,
        good: 0,
        fair: 0,
        poor: 0,
        damaged: 0
    });
    const [loading, setLoading] = useState(true);
    const [animation, setAnimation] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (!loading) {
            setAnimation(true);
        }
    }, [loading]);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/instruments`);
            const instruments = response.data;
            
            const newStats = {
                totalInstruments: instruments.length,
                checkedOut: instruments.filter(i => !i.inPossession).length,
                excellent: instruments.filter(i => i.condition === 'Excellent').length,
                good: instruments.filter(i => i.condition === 'Good').length,
                fair: instruments.filter(i => i.condition === 'Fair').length,
                poor: instruments.filter(i => i.condition === 'Poor').length,
                damaged: instruments.filter(i => i.condition === 'Damaged').length
            };
            
            setStats(newStats);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="modern-dashboard">
            <div className="dashboard-nav-grid">
                <Link to="/instruments" className="nav-grid-item">
                    <div className="nav-icon-container">
                        <FaThLarge className="nav-grid-icon" />
                    </div>
                    <span>All Instruments</span>
                </Link>
                <Link to="/new-checklist" className="nav-grid-item">
                    <div className="nav-icon-container">
                        <FaClipboardList className="nav-grid-icon" />
                    </div>
                    <span>New Checklist</span>
                </Link>
                <Link to="/checklists" className="nav-grid-item">
                    <div className="nav-icon-container">
                        <FaListAlt className="nav-grid-icon" />
                    </div>
                    <span>Previous Checklists</span>
                </Link>
                <Link to="/history" className="nav-grid-item">
                    <div className="nav-icon-container">
                        <FaHistory className="nav-grid-icon" />
                    </div>
                    <span>History</span>
                </Link>
            </div>
            
            <div className="modern-stat-cards">
                <div className="modern-stat-card total">
                    <div className="stat-icon">
                        <FaBoxOpen />
                    </div>
                    <div className="stat-info">
                        <h4>Instruments</h4>
                        <div className="stat-value">{stats.totalInstruments}</div>
                    </div>
                </div>
                <div className="modern-stat-card checkout">
                    <div className="stat-icon">
                        <FaArrowDown />
                    </div>
                    <div className="stat-info">
                        <h4>Checked Out</h4>
                        <div className="stat-value">{stats.checkedOut}</div>
                    </div>
                </div>
                <div className="modern-stat-card excellent">
                    <div className="stat-icon">
                        <FaCheckCircle />
                    </div>
                    <div className="stat-info">
                        <h4>Excellent</h4>
                        <div className="stat-value">{stats.excellent}</div>
                    </div>
                </div>
                <div className="modern-stat-card damaged">
                    <div className="stat-icon">
                        <FaExclamationTriangle />
                    </div>
                    <div className="stat-info">
                        <h4>Damaged</h4>
                        <div className="stat-value">{stats.damaged}</div>
                    </div>
                </div>
            </div>
            
            <div className="modern-condition-summary">
                <h3>Instrument Condition</h3>
                <div className="condition-bar">
                    <div 
                        className="condition-segment excellent" 
                        style={{width: `${stats.totalInstruments ? (stats.excellent/stats.totalInstruments)*100 : 0}%`}}
                    ></div>
                    <div 
                        className="condition-segment good" 
                        style={{width: `${stats.totalInstruments ? (stats.good/stats.totalInstruments)*100 : 0}%`}}
                    ></div>
                    <div 
                        className="condition-segment fair" 
                        style={{width: `${stats.totalInstruments ? (stats.fair/stats.totalInstruments)*100 : 0}%`}}
                    ></div>
                    <div 
                        className="condition-segment poor" 
                        style={{width: `${stats.totalInstruments ? (stats.poor/stats.totalInstruments)*100 : 0}%`}}
                    ></div>
                    <div 
                        className="condition-segment damaged" 
                        style={{width: `${stats.totalInstruments ? (stats.damaged/stats.totalInstruments)*100 : 0}%`}}
                    ></div>
                </div>
                
                <div className="modern-legend">
                    <div className="legend-item"><span className="legend-color excellent"></span> Excellent: {stats.excellent}</div>
                    <div className="legend-item"><span className="legend-color good"></span> Good: {stats.good}</div>
                    <div className="legend-item"><span className="legend-color fair"></span> Fair: {stats.fair}</div>
                    <div className="legend-item"><span className="legend-color poor"></span> Poor: {stats.poor}</div>
                    <div className="legend-item"><span className="legend-color damaged"></span> Damaged: {stats.damaged}</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
