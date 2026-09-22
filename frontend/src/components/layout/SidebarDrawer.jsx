import {
  Building2,
  Users,
  X,
  LogOut,
  ShieldCheck,
  Briefcase,
  Layers,
  Building,
  Award,
  Crown,
} from 'lucide-react';
import {
  getRoleMenu,
  getRoleMeta,
  resolveRoleKey,
} from '../../data/roleMenus';

// Legacy helper retained for backwards compatibility with NavigationBanner.jsx
// and any other existing imports.
// @deprecated Prefer `getRoleMeta` from roleMenus.js for new code.
export const getRoleDashboardInfo = (userSession) => {
  const meta = getRoleMeta(userSession);
  const roleKey = resolveRoleKey(userSession);

  // Map to legacy icon set so existing imports keep working visually.
  const legacyIcon = (() => {
    switch (roleKey) {
      case 'ceo':         return Crown;
      case 'information': return Layers;
      case 'finance':     return Briefcase;
      case 'sysadmin':    return ShieldCheck;
      case 'genhead':     return Building;
      case 'branchmgr':   return Building2;
      case 'teamleader':  return Users;
      default:            return Award;
    }
  })();

  return {
    id: 'dashboard',
    label: meta.label,
    icon: legacyIcon,
    color: meta.color,
  };
};

export const SidebarDrawer = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  onLogout,
  userSession,
}) => {
  // Curated per-role menu items (replaces the old 4-item hardcoded list)
  const navItems = getRoleMenu(userSession);
  const roleMeta = getRoleMeta(userSession);

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
            <span style={{ fontWeight: '700', fontSize: '16px' }}>
              Beha Real Estate
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Role badge header */}
        <div
          style={{
            padding: '8px 16px 12px',
            borderBottom: '1px solid #1e293b',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#64748b',
            }}
          >
            Signed in as
          </div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: '700',
              color: roleMeta.color,
              marginTop: '2px',
            }}
          >
            {userSession?.name || 'Beha User'}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            {roleMeta.label}
          </div>
        </div>

        <ul className="sidebar-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const activeColor = item.color || '#60a5fa';
            return (
              <li
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={item.article ? `Authorized by: ${item.article}` : undefined}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
              >
                <Icon
                  size={18}
                  color={isActive ? activeColor : '#94a3b8'}
                />
                <span>{item.label}</span>
                {item.article && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: '9px',
                      color: '#475569',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {item.article.split(' ')[0]}
                  </span>
                )}
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

        <div
          style={{
            marginTop: 'auto',
            padding: '16px',
            borderTop: '1px solid #334155',
            fontSize: '11px',
            color: '#94a3b8',
          }}
        >
          <div>Beha Marketing PLC &bull; Addis Ababa</div>
          <div>Version 2.4.0 (2026 G.C)</div>
        </div>
      </div>
    </>
  );
};
