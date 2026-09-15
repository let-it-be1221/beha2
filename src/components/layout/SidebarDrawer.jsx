import React from 'react';
import { 
  Home, 
  Building2, 
  Users, 
  Bell, 
  BarChart2, 
  UserPlus, 
  Calendar, 
  X 
} from 'lucide-react';

export const SidebarDrawer = ({ isOpen, onClose, currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'houses', label: 'Houses', icon: Building2 },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'performance', label: 'Performance Status', icon: BarChart2 },
    { id: 'staff', label: 'Staff Members Form', icon: UserPlus },
    { id: 'calendar', label: 'Calendar & Schedule', icon: Calendar },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`sidebar-drawer ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.svg" alt="Logo" style={{ height: '30px' }} />
            <span style={{ fontWeight: '700', fontSize: '16px' }}>Beha Real Estate</span>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <ul className="sidebar-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <li
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
              >
                <Icon size={18} color={isActive ? '#60a5fa' : '#94a3b8'} />
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>

        <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid #334155', fontSize: '11px', color: '#94a3b8' }}>
          <div>Beha Marketing PLC &bull; Addis Ababa</div>
          <div>Version 2.4.0 (2026 G.C)</div>
        </div>
      </div>
    </>
  );
};
