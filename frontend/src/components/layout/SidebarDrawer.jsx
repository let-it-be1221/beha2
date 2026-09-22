import { 
  Building2, 
  Users, 
  Bell, 
  X,
  LogOut,
  ShieldCheck,
  Briefcase,
  Layers,
  Building,
  Award,
  Crown
} from 'lucide-react';

export const getRoleDashboardInfo = (userSession) => {
  const role = (userSession?.primary_role || userSession?.role || '').toUpperCase();
  if (role.includes('CEO') || role.includes('EXECUTIVE')) {
    return { id: 'dashboard', label: 'CEO Command Center', icon: Crown, color: '#dc2626' };
  }
  if (role.includes('INFO')) {
    return { id: 'dashboard', label: 'Information Dept Center', icon: Layers, color: '#2563eb' };
  }
  if (role.includes('FIN')) {
    return { id: 'dashboard', label: 'Finance & Settlement', icon: Briefcase, color: '#16a34a' };
  }
  if (role.includes('SYS') || role.includes('ADMIN')) {
    return { id: 'dashboard', label: 'System Admin Console', icon: ShieldCheck, color: '#9333ea' };
  }
  if (role.includes('GEN')) {
    return { id: 'dashboard', label: 'Generation Head Console', icon: Building, color: '#d97706' };
  }
  if (role.includes('BRANCH') || role.includes('BR_')) {
    return { id: 'dashboard', label: 'Branch Operations Command', icon: Building2, color: '#ea580c' };
  }
  if (role.includes('LEADER') || role.includes('TL')) {
    return { id: 'dashboard', label: 'Team Leader Console', icon: Users, color: '#0891b2' };
  }
  return { id: 'dashboard', label: 'Sales Agent Workplace', icon: Award, color: '#2563eb' };
};

export const SidebarDrawer = ({ isOpen, onClose, currentView, onNavigate, onLogout, userSession }) => {
  const roleInfo = getRoleDashboardInfo(userSession);

  const navItems = [
    { id: 'dashboard', label: roleInfo.label, icon: roleInfo.icon, badgeColor: roleInfo.color },
    { id: 'houses', label: 'Houses', icon: Building2 },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
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
          {onLogout && (
            <li
              className="sidebar-nav-item"
              style={{ color: '#ef4444', marginTop: '12px' }}
              onClick={() => {
                onClose();
                onLogout();
              }}
            >
              <LogOut size={18} color="#ef4444" />
              <span>Sign Out / Switch Account</span>
            </li>
          )}
        </ul>

        <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid #334155', fontSize: '11px', color: '#94a3b8' }}>
          <div>Beha Marketing PLC &bull; Addis Ababa</div>
          <div>Version 2.4.0 (2026 G.C)</div>
        </div>
      </div>
    </>
  );
};
