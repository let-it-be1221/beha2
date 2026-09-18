import React from 'react';
import { 
  User, 
  CreditCard, 
  Key, 
  Wallet, 
  BarChart, 
  UserPlus, 
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';

export const ProfilePopover = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onOpenSettings,
  onLogout,
  userSession
}) => {
  if (!isOpen) return null;

  const isGuest = userSession?.isGuest;
  const userName = userSession?.name || 'Abebe Kebede (Agent)';
  const userIdDisplay = userSession?.userId || 'BH-8842';

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
        <span style={{ fontWeight: '600' }}>{isGuest ? 'GUEST-001' : userIdDisplay}</span>
      </div>

      <div className="profile-menu-item">
        <span style={{ color: '#94a3b8', fontSize: '12px' }}>Confidential ID No.</span>
        <span style={{ fontWeight: '600', color: '#f59e0b' }}>{isGuest ? 'READ-ONLY' : 'SEC-9011-X'}</span>
      </div>

      <div className="profile-menu-item highlight">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wallet size={15} color="#22c55e" />
          <span>Balance (ETB)</span>
        </div>
        <span style={{ fontWeight: '700', color: '#22c55e' }}>{isGuest ? '0 ETB' : '148,500 ETB'}</span>
      </div>

      <div 
        className="profile-menu-item" 
        onClick={() => {
          onNavigate('performance');
          onClose();
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart size={15} />
          <span>Performance Status</span>
        </div>
        <span style={{ color: '#60a5fa' }}>&rarr;</span>
      </div>

      <div 
        className="profile-menu-item"
        onClick={() => {
          onNavigate('staff');
          onClose();
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={15} />
          <span>Add New Member</span>
        </div>
        <span style={{ color: '#60a5fa' }}>&rarr;</span>
      </div>

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

      {onLogout && (
        <div 
          className="profile-menu-item"
          style={{ color: '#ef4444', borderTop: '1px solid rgba(255,255,255,0.08)' }}
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
