import { 
  Building2, 
  Handshake, 
  Mail, 
  BarChart3, 
  Users, 
  Calendar as CalendarIcon, 
  UserCircle2,
  ShieldCheck
} from 'lucide-react';
import { getRoleDashboardInfo } from './SidebarDrawer';

export const NavigationBanner = ({ 
  currentView, 
  onToggleSidebar, 
  onToggleProfile,
  onCalendarTitleClick,
  userSession
}) => {
  const roleInfo = getRoleDashboardInfo(userSession);
  const RoleIcon = roleInfo.icon;

  const renderTitleContent = () => {
    switch (currentView) {
      case 'houses':
        return (
          <div className="page-title-center">
            <Building2 size={30} color="#854d0e" />
            <span>Houses</span>
          </div>
        );
      case 'customers':
        return (
          <div className="page-title-center">
            <Handshake size={32} color="#15803d" />
            <span>Customers</span>
          </div>
        );
      case 'notifications':
        return (
          <div className="page-title-center">
            <Mail size={30} color="#000000" />
            <span>Notifications</span>
          </div>
        );
      case 'operations':
        return (
          <div className="page-title-center">
            <ShieldCheck size={30} color="#2563eb" />
            <span>Operations &amp; Approvals</span>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="page-title-center">
            <RoleIcon size={30} color={roleInfo.color || "#2563eb"} />
            <span>{roleInfo.label}</span>
          </div>
        );
    }
  };

  return (
    <div className="nav-banner">
      {/* 3 Blue Bars Hamburger */}
      <button 
        className="hamburger-btn" 
        onClick={onToggleSidebar}
        title="Toggle Menu"
      >
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
      </button>

      {/* Dynamic Title / Dual Calendar */}
      {renderTitleContent()}

      {/* Profile Avatar Button */}
      <button 
        className="profile-avatar-btn" 
        onClick={onToggleProfile}
        title="Account & Profile Details"
      >
        <UserCircle2 size={44} color="#0284c7" strokeWidth={1.5} />
      </button>
    </div>
  );
};
