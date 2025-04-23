import React, { useState, useEffect } from 'react';

const Settings = () => {
    const [settings, setSettings] = useState({
        institutionName: 'UET MIT',
        logoUrl: '',
        defaultDateFormat: 'MM/DD/YYYY',
        requireDirectorApproval: true,
        showNotifications: true,
        theme: 'default'
    });

    useEffect(() => {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        // Save settings to localStorage
        localStorage.setItem('appSettings', JSON.stringify(settings));
        alert('Settings saved successfully!');
    };

    return (
        <div className="settings-page">
            <h2>Application Settings</h2>
            
            <div className="settings-form">
                <div className="form-group">
                    <label htmlFor="institutionName">Institution Name:</label>
                    <input
                        type="text"
                        id="institutionName"
                        name="institutionName"
                        value={settings.institutionName}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="logoUrl">Logo URL (optional):</label>
                    <input
                        type="text"
                        id="logoUrl"
                        name="logoUrl"
                        value={settings.logoUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/logo.png"
                    />
                    {settings.logoUrl && (
                        <div className="logo-preview">
                            <img src={settings.logoUrl} alt="Institution Logo" height="50" />
                        </div>
                    )}
                </div>
                
                <div className="form-group">
                    <label htmlFor="defaultDateFormat">Date Format:</label>
                    <select
                        id="defaultDateFormat"
                        name="defaultDateFormat"
                        value={settings.defaultDateFormat}
                        onChange={handleChange}
                    >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                </div>
                
                <div className="form-group checkbox-group">
                    <label className="checkbox-container">
                        <input
                            type="checkbox"
                            id="requireDirectorApproval"
                            name="requireDirectorApproval"
                            checked={settings.requireDirectorApproval}
                            onChange={handleChange}
                        />
                        <span className="checkbox-label">Require Director Approval for Checklists</span>
                    </label>
                </div>
                
                <div className="form-group checkbox-group">
                    <label className="checkbox-container">
                        <input
                            type="checkbox"
                            id="showNotifications"
                            name="showNotifications"
                            checked={settings.showNotifications}
                            onChange={handleChange}
                        />
                        <span className="checkbox-label">Show Notifications</span>
                    </label>
                </div>
                
                <div className="form-group">
                    <label htmlFor="theme">Theme:</label>
                    <select
                        id="theme"
                        name="theme"
                        value={settings.theme}
                        onChange={handleChange}
                    >
                        <option value="default">Default</option>
                        <option value="dark">Dark Mode</option>
                        <option value="light">Light Mode</option>
                        <option value="colorful">Colorful</option>
                    </select>
                </div>
                
                <div className="form-actions">
                    <button onClick={handleSave} className="button">Save Settings</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
