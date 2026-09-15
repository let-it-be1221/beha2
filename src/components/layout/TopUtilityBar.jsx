import React from 'react';
import { Search, Moon, Sun, Globe, LogOut } from 'lucide-react';

export const TopUtilityBar = ({ 
  theme, 
  toggleTheme, 
  lang, 
  setLang, 
  t, 
  searchQuery, 
  setSearchQuery,
  onSearch,
  onLogout,
  userSession
}) => {
  return (
    <div className="top-utility-bar">
      <div className="search-box-wrap">
        <Search size={14} className="text-secondary" />
        <input 
          type="text" 
          placeholder={t.searchPlaceholder} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch && onSearch()}
        />
        <button className="action-btn" onClick={onSearch} style={{ padding: '2px 6px', fontSize: '12px' }}>
          {t.searchBtn}
        </button>
      </div>

      <div className="utility-actions">
        {userSession?.isGuest && (
          <span 
            style={{ 
              background: '#0022ff', 
              color: '#ffffff', 
              padding: '2px 8px', 
              borderRadius: '9999px', 
              fontSize: '11px', 
              fontWeight: '700' 
            }}
          >
            {t.guestMode || 'Guest Mode'}
          </span>
        )}

        {/* Dark / Light Mode Toggle */}
        <button 
          className="action-btn" 
          onClick={toggleTheme}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#3b82f6" />}
        </button>

        {/* Language Switcher */}
        <button 
          className="action-btn font-ethiopic" 
          onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
          title="Toggle Language"
        >
          <Globe size={15} color="#06b6d4" />
          <span>{lang === 'en' ? 'አማ' : 'EN'}</span>
        </button>

        {/* Logout / Switch Account */}
        <button 
          className="action-btn logout-btn" 
          onClick={onLogout}
          title="Logout / Switch Account"
        >
          <LogOut size={13} />
          <span>{t.logout}</span>
        </button>
      </div>
    </div>
  );
};
