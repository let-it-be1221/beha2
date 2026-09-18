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

export const NavigationBanner = ({ 
  currentView, 
  onToggleSidebar, 
  onToggleProfile,
  onCalendarTitleClick
}) => {
  const renderTitleContent = () => {
    switch (currentView) {
      case 'operations':
        return (
          <div className="page-title-center">
            <ShieldCheck size={32} color="#2563eb" />
            <span>Operations &amp; CEO Approvals</span>
          </div>
        );
      case 'houses':
        return (
          <div className="page-title-center">
            <Building2 size={32} color="#854d0e" />
            <span>Houses</span>
          </div>
        );
      case 'customers':
        return (
          <div className="page-title-center">
            <Handshake size={34} color="#15803d" />
            <span>Customers</span>
          </div>
        );
      case 'notifications':
        return (
          <div className="page-title-center">
            <Mail size={32} color="#000000" />
            <span>Notifications</span>
          </div>
        );
      case 'performance':
        return (
          <div className="page-title-center">
            <BarChart3 size={32} color="#1d4ed8" />
            <span>Performance Status</span>
          </div>
        );
      case 'staff':
        return (
          <div className="page-title-center">
            <Users size={32} color="#3b82f6" />
            <span>Organization &amp; Staff</span>
          </div>
        );
      case 'calendar':
        return (
          <div className="page-title-center">
            <CalendarIcon size={32} color="#0284c7" />
            <span>Calendar &amp; Schedule</span>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div 
            className="dual-calendar-display" 
            onClick={onCalendarTitleClick} 
            style={{ cursor: 'pointer' }}
            title="Click to view full Ethiopian Calendar"
          >
            <CalendarIcon size={36} color="#0284c7" />
            <div>
              <div className="dual-date-ethiopian font-ethiopic">
                ሐሙስ፣ 21 ነሐሴ 2018 ዓ.ም
              </div>
              <div className="dual-date-gregorian">
                Thursday, 30 Jul 2026 G.C
              </div>
            </div>
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
