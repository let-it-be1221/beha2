import React from 'react';
import {
  User,
  Wallet,
  BarChart,
  UserPlus,
  Settings as SettingsIcon,
  LogOut,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { getRoleMenu, getRoleMeta } from '../../data/roleMenus';

// Profile popover - shows role-specific quick actions + always-on Settings & Logout.
// Performance / Add Member / Operations links are now filtered by the same
// role-menu configuration used in SidebarDrawer, so a Team Member no longer
// sees the "Add New Member" item (which is reserved for SysAdmin / CEO).
export const ProfilePopover = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenSettings,
  onLogout,
  userSession,
}) => {
  if (!isOpen) return null;

  const isGuest = userSession?.isGuest;
  const userName = userSession?.name || 'Abebe Kebede (Agent)';
  const userIdDisplay = userSession?.userId || 'BH-8842';
  const roleMeta = getRoleMeta(userSession);

  // Build a curated list of role-applicable quick links.
  // Skip "dashboard" (we're already on the profile popover while viewing it)
  // and "calendar" (the popover is meant for quick account actions).
  const roleMenu = getRoleMenu(userSession).filter(
    (item) => !['dashboard', 'calendar', 'notifications'].includes(item.id)
  );

  // Icon override for items that should look like account actions rather than nav items.
  const iconFor = (id, defaultIcon) => {
    switch (id) {
      case 'performance': return BarChart;
      case 'staff':        return UserPlus; // "Add New Member" semantics for SysAdmin/CEO
      case 'operations':   return ShieldCheck;
      case 'customers':    return Users;
      default:             return defaultIcon;
    }
  };

  // Label override for "staff" so it reads as an action rather than a roster view
  // for high-privilege roles (CEO, SysAdmin); other roles keep the generic label.
  const labelFor = (id, defaultLabel) => {
    const roleKey = roleMeta.key;
    if (id === 'staff' && (roleKey === 'ceo' || roleKey === 'sysadmin')) {
      return 'Add New Member';
    }
    return defaultLabel;
  };

  return (
    <div className="profile-menu-popover">
      <div
        className="profile-menu-item"
        style={{ fontWeight: '700', color: '#60a5fa', background: '#0f172a' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={16} />
          <span>{isGuest ? 'Guest User (Preview)' : userName}</span>
        </div>
      </div>

      <div className="profile-menu-item">
        <span style={{ color: '#94a3b8', fontSize: '12px' }}>Official ID No.</span>
        <span style={{ fontWeight: '600' }}>
          {isGuest ? 'GUEST-001' : userIdDisplay}
        </span>
      </div>

      <div className="profile-menu-item">
        <span style={{ color: '#94a3b8', fontSize: '12px' }}>Role</span>
        <span style={{ fontWeight: '700', color: roleMeta.color }}>
          {roleMeta.label}
        </span>
      </div>

      <div className="profile-menu-item highlight">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wallet size={15} color="#22c55e" />
          <span>Balance (ETB)</span>
        </div>
        <span style={{ fontWeight: '700', color: '#22c55e' }}>
          {isGuest ? '0 ETB' : '148,500 ETB'}
        </span>
      </div>

      {/* Role-gated quick action links */}
      {roleMenu.map((item) => {
        const Icon = iconFor(item.id, item.icon);
        return (
          <div
            key={item.id}
            className="profile-menu-item"
            title={item.article ? `Authorized by: ${item.article}` : undefined}
            onClick={() => {
              onNavigate(item.id);
              onClose();
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon size={15} />
              <span>{labelFor(item.id, item.label)}</span>
            </div>
            <span style={{ color: '#60a5fa' }}>&rarr;</span>
          </div>
        );
      })}

      {/* Always available: Settings */}
      <div
        className="profile-menu-item"
        onClick={() => {
          onOpenSettings();
          onClose();
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingsIcon size={15} />
          <span>Settings</span>
        </div>
      </div>

      {/* Always available: Sign Out */}
      {onLogout && (
        <div
          className="profile-menu-item"
          style={{
            color: '#ef4444',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
          onClick={() => {
            onClose();
            onLogout();
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={15} color="#ef4444" />
            <span>Sign Out / Switch Account</span>
          </div>
        </div>
      )}
    </div>
  );
};
