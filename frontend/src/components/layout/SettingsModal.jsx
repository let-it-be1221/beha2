import React, { useState } from 'react';
import { Settings, Check, X, Shield, Moon, Globe, DollarSign, Database } from 'lucide-react';
import { checkBackendHealth } from '../../services/api';

export const SettingsModal = ({ isOpen, onClose, theme, toggleTheme, lang, setLang, t }) => {
  const [currency, setCurrency] = useState('ETB');
  const [calendarPref, setCalendarPref] = useState('Dual');
  const [dbStatus, setDbStatus] = useState({ loading: false, data: null, error: null });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8', fontWeight: '800' }}>
            <Settings size={20} />
            <span>Beha System Settings</span>
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13.5px' }}>
          {/* Agency Details */}
          <div style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '6px', border: '1px solid var(--table-border)' }}>
            <strong>Agency:</strong> Beha Marketing PLC (Ayat Square, Addis Ababa)<br />
            <strong>Assigned Agent ID:</strong> BH-8842 &bull; <strong>Branch:</strong> 01 &bull; <strong>Team:</strong> 01
          </div>

          {/* Theme Option */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Appearance Theme:</span>
            <button 
              className="action-btn" 
              onClick={toggleTheme}
              style={{ border: '1px solid var(--table-border)', padding: '4px 12px' }}
            >
              {theme === 'dark' ? 'Dark Mode (Active)' : 'Light Mode (Active)'}
            </button>
          </div>

          {/* Language Option */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Language / ቋንቋ:</span>
            <button 
              className="action-btn"
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              style={{ border: '1px solid var(--table-border)', padding: '4px 12px' }}
            >
              {lang === 'en' ? 'English (Switch to አማርኛ)' : 'አማርኛ (Switch to English)'}
            </button>
          </div>

          {/* Currency Display */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Default Valuation Currency:</span>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)} 
              className="crm-input"
              style={{ maxWidth: '140px' }}
            >
              <option value="ETB">ETB (Ethiopian Birr)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          {/* Calendar Display Mode */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Date &amp; Calendar System:</span>
            <select 
              value={calendarPref} 
              onChange={(e) => setCalendarPref(e.target.value)}
              className="crm-input"
              style={{ maxWidth: '140px' }}
            >
              <option value="Dual">Dual (E.C. &amp; G.C.)</option>
              <option value="EC">Ethiopian (E.C.) Only</option>
              <option value="GC">Gregorian (G.C.) Only</option>
            </select>
          </div>

          {/* Database & Backend Connectivity */}
          <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '6px', border: '1px solid var(--table-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: '600' }}>XAMPP MySQL Database (beha_db):</span>
              <button
                className="action-btn"
                onClick={async () => {
                  setDbStatus({ loading: true, data: null, error: null });
                  try {
                    const res = await checkBackendHealth();
                    if (res.database?.connected) {
                      setDbStatus({ loading: false, data: res, error: null });
                    } else {
                      setDbStatus({ loading: false, data: null, error: res.message || 'Connection failed' });
                    }
                  } catch (err) {
                    setDbStatus({ loading: false, data: null, error: err.message });
                  }
                }}
                style={{ fontSize: '11px', padding: '3px 8px', border: '1px solid #10b981', color: '#10b981' }}
              >
                {dbStatus.loading ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
            {dbStatus.data && (
              <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span>&bull; Status: Connected &amp; Operational</span>
                <span>&bull; Database: {dbStatus.data.database.name} ({dbStatus.data.database.driver})</span>
                <span>&bull; Tables ({dbStatus.data.database.table_count}): {dbStatus.data.database.tables.join(', ')}</span>
              </div>
            )}
            {dbStatus.error && (
              <div style={{ fontSize: '12px', color: '#ef4444' }}>
                <span>&bull; Connection Error: {dbStatus.error}</span>
              </div>
            )}
            {!dbStatus.data && !dbStatus.error && !dbStatus.loading && (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Target: <code>http://localhost/Beha/backend/public/api</code> &bull; DB: <code>beha_db</code>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button 
            className="action-btn"
            style={{ background: '#2563eb', color: 'white', padding: '8px 20px', borderRadius: '6px' }}
            onClick={() => {
              alert("Settings updated!");
              onClose();
            }}
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
