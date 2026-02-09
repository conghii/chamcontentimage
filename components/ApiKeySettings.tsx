import React, { useState, useEffect } from 'react';

interface ApiKeySettingsProps {
    onApiKeyChange: (apiKey: string) => void;
    showSettings: boolean;
    onToggleSettings: () => void;
}

export function ApiKeySettings({ onApiKeyChange, showSettings, onToggleSettings }: ApiKeySettingsProps) {
    const [apiKey, setApiKey] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        // Load API key from localStorage on mount
        const savedApiKey = localStorage.getItem('gemini_api_key');
        if (savedApiKey) {
            setApiKey(savedApiKey);
            setIsSaved(true);
            onApiKeyChange(savedApiKey);
        }
    }, []);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey.trim());
            onApiKeyChange(apiKey.trim());
            setIsSaved(true);
            onToggleSettings(); // Close on save
            alert('✅ API Key đã được lưu thành công!');
        } else {
            alert('⚠️ Vui lòng nhập API key');
        }
    };

    const handleClear = () => {
        if (confirm('Bạn có chắc muốn xóa API key?')) {
            localStorage.removeItem('gemini_api_key');
            setApiKey('');
            setIsSaved(false);
            onApiKeyChange('');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000
        }}>
            {/* Settings Button */}
            <button
                onClick={onToggleSettings}
                style={{
                    padding: '10px 20px',
                    backgroundColor: isSaved ? '#4CAF50' : '#FF9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                {isSaved ? '✅' : '⚙️'} API Key
            </button>

            {/* Settings Panel */}
            {showSettings && (
                <div style={{
                    position: 'absolute',
                    top: '50px',
                    right: '0',
                    width: '350px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    padding: '20px',
                    border: '2px solid #4CAF50'
                }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333' }}>
                        🔑 Gemini API Key
                    </h3>

                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                        Nhập API key từ{' '}
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#4CAF50' }}
                        >
                            Google AI Studio
                        </a>
                    </p>

                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type={isVisible ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                                boxSizing: 'border-box'
                            }}
                        />
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            marginTop: '8px',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="checkbox"
                                checked={isVisible}
                                onChange={(e) => setIsVisible(e.target.checked)}
                            />
                            Hiện API key
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleSave}
                            style={{
                                flex: 1,
                                padding: '10px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}
                        >
                            💾 Lưu
                        </button>

                        {isSaved && (
                            <button
                                onClick={handleClear}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}
                            >
                                🗑️ Xóa
                            </button>
                        )}
                    </div>

                    {isSaved && (
                        <div style={{
                            marginTop: '12px',
                            padding: '10px',
                            backgroundColor: '#E8F5E9',
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: '#2E7D32'
                        }}>
                            ✅ API key đã được lưu trong localStorage
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
