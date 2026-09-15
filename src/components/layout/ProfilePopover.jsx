import React from 'react';
import { 
  User, 
  CreditCard, 
  Key, 
  Wallet, 
  BarChart, 
  UserPlus, 
  Settings as SettingsIcon 
} from 'lucide-react';

export const ProfilePopover = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onOpenSettings 
}) => {
  if (!isOpen) return null;

  return (
    <div className="profile-menu-popover">
      <div 
        className="profile-menu-item"
        style={{ fontWeight: '700', color: '#60a5fa', background: '#0f172a' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={16} />
          <span>Abebe Kebede (Agent)</span>
        </div>
      </div>

      <div className="profile-menu-item">
        <span style={{ color: '#94a3b8', fontSize: '12px' }}>Official ID No.</span>
        <span style={{ fontWeight: '600' }}>BH-8842</span>
      </div>

      <div className="profile-menu-item">
        <span style={{ color: '#94a3b8', fontSize: '12px' }}>Confidential ID No.</span>
        <span style={{ fontWeight: '600', color: '#f59e0b' }}>SEC-9011-X</span>
      </div>

      <div className="profile-menu-item highlight">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wallet size={15} color="#22c55e" />
          <span>Balance (ETB)</span>
        </div>
        <span style={{ fontWeight: '700', color: '#22c55e' }}>148,500 ETB</span>
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
    </div>
  );
};
