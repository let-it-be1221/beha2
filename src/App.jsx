import React, { useState, useEffect } from 'react';
import './modules.css';
import { TRANSLATIONS } from './data/mockData';
import { TopUtilityBar } from './components/layout/TopUtilityBar';
import { BrandHeader } from './components/layout/BrandHeader';
import { NavigationBanner } from './components/layout/NavigationBanner';
import { SidebarDrawer } from './components/layout/SidebarDrawer';
import { ProfilePopover } from './components/layout/ProfilePopover';
import { SponsorBanner } from './components/layout/SponsorBanner';
import { SettingsModal } from './components/layout/SettingsModal';

import { DashboardView } from './components/views/DashboardView';
import { HousesView } from './components/views/HousesView';
import { CustomersView } from './components/views/CustomersView';
import { NotificationsView } from './components/views/NotificationsView';
import { PerformanceView } from './components/views/PerformanceView';
import { StaffFormView } from './components/views/StaffFormView';
import { CalendarView } from './components/views/CalendarView';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('beha_theme') || 'light');
  const [lang, setLang] = useState('en');
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Translations object
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Synchronize theme with HTML data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('beha_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('house') || q.includes('villa') || q.includes('apartment') || q.includes('condo') || q.includes('rent')) {
      setCurrentView('houses');
    } else if (q.includes('customer') || q.includes('lead') || q.includes('client')) {
      setCurrentView('customers');
    } else if (q.includes('notif') || q.includes('message') || q.includes('notice')) {
      setCurrentView('notifications');
    } else if (q.includes('perf') || q.includes('kpi') || q.includes('sale') || q.includes('chart')) {
      setCurrentView('performance');
    } else if (q.includes('staff') || q.includes('agent') || q.includes('cv') || q.includes('member')) {
      setCurrentView('staff');
    } else if (q.includes('cal') || q.includes('date') || q.includes('event')) {
      setCurrentView('calendar');
    } else {
      alert(`Searching Beha database for: "${searchQuery}"`);
    }
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'houses':
        return <HousesView t={t} />;
      case 'customers':
        return <CustomersView t={t} />;
      case 'notifications':
        return <NotificationsView t={t} />;
      case 'performance':
        return <PerformanceView t={t} />;
      case 'staff':
        return <StaffFormView t={t} />;
      case 'calendar':
        return <CalendarView t={t} />;
      case 'dashboard':
      default:
        return <DashboardView t={t} onNavigate={(view) => setCurrentView(view)} />;
    }
  };

  return (
    <div className="app-container">
      {/* 1. Top Utility Bar */}
      <TopUtilityBar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        lang={lang} 
        setLang={setLang} 
        t={t} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* 2. Brand & Hierarchy Header */}
      <BrandHeader 
        t={t} 
        onLogoClick={() => setCurrentView('dashboard')} 
      />

      {/* 3. Dynamic Page Navigation Title Banner */}
      <NavigationBanner 
        currentView={currentView}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onToggleProfile={() => setIsProfileOpen((prev) => !prev)}
        onCalendarTitleClick={() => setCurrentView('calendar')}
      />

      {/* Slide-out Sidebar Drawer */}
      <SidebarDrawer 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* Profile Menu Dropdown */}
      <ProfilePopover 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onNavigate={(view) => setCurrentView(view)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 4. Active Main Content View */}
      <main className="main-view-container">
        {renderActiveView()}
      </main>

      {/* 5. Sponsor Partner Banner (Bank of Abyssinia) */}
      <SponsorBanner t={t} />

      {/* 6. Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        lang={lang}
        setLang={setLang}
        t={t}
      />
    </div>
  );
}

export default App;
