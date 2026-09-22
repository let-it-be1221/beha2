// frontend/src/data/roleMenus.js
// ============================================================================
//  Beha Marketing PLC - Role-Based Menu Configuration
// ----------------------------------------------------------------------------
//  Maps each of the 8 roles to the navigation items they are authorized
//  to access, with explicit references to the Beha Operational Guidelines
//  (Articles 1 - 25) justifying every access decision.
//
//  Usage:
//    import { getRoleMenu, resolveRoleKey } from '../data/roleMenus';
//    const menu = getRoleMenu(userSession);
//    menu.forEach(item => <SidebarItem icon={item.icon} label={item.label} ... />);
// ============================================================================

import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Users,
  Bell,
  BarChart3,
  UserCheck,
  Calendar,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Canonical menu item definitions (icon + default label)
// ---------------------------------------------------------------------------
export const MENU_ITEMS = {
  dashboard:     { id: 'dashboard',     label: 'My Dashboard',  icon: LayoutDashboard },
  operations:    { id: 'operations',    label: 'Operations',    icon: ShieldCheck },
  houses:        { id: 'houses',        label: 'Properties',    icon: Building2 },
  customers:     { id: 'customers',     label: 'Customers',     icon: Users },
  notifications: { id: 'notifications', label: 'Notifications', icon: Bell },
  performance:   { id: 'performance',   label: 'Performance',    icon: BarChart3 },
  staff:         { id: 'staff',         label: 'Staff & Roster', icon: UserCheck },
  calendar:      { id: 'calendar',      label: 'Calendar',       icon: Calendar },
};

// ---------------------------------------------------------------------------
// Role-specific dashboard labels (replaces generic "My Dashboard" text)
// ---------------------------------------------------------------------------
export const ROLE_DASHBOARD_LABELS = {
  ceo:         'CEO Command Center',
  information: 'Information Dept Center',
  finance:     'Finance & Settlement',
  sysadmin:    'System Admin Console',
  genhead:     'Generation Head Console',
  branchmgr:   'Branch Operations Command',
  teamleader:  'Team Leader Console',
  teammember:  'Sales Agent Workplace',
};

// ---------------------------------------------------------------------------
// Role color theme (used for active-state highlight + role pill badge)
// ---------------------------------------------------------------------------
export const ROLE_COLORS = {
  ceo:         '#dc2626', // crimson - executive authority
  information: '#2563eb', // blue    - data & IT
  finance:     '#16a34a', // green   - money flow
  sysadmin:    '#9333ea', // purple  - security
  genhead:     '#d97706', // amber   - generational oversight
  branchmgr:   '#ea580c', // orange  - branch
  teamleader:  '#0891b2', // cyan    - team
  teammember:  '#2563eb', // blue    - field
};

// ---------------------------------------------------------------------------
// Resolve role key from userSession
// ---------------------------------------------------------------------------
export function resolveRoleKey(userSession) {
  if (!userSession) return 'teammember';
  const role = (userSession.primary_role || userSession.role || '').toUpperCase();
  if (role.includes('CEO') || role.includes('EXECUTIVE')) return 'ceo';
  if (role.includes('INFO'))                              return 'information';
  if (role.includes('FIN'))                               return 'finance';
  if (role.includes('SYS') || role.includes('ADMIN'))     return 'sysadmin';
  if (role.includes('GEN'))                               return 'genhead';
  if (role.includes('BRANCH') || role.includes('BR_'))   return 'branchmgr';
  if (role.includes('LEADER') || role.includes('TL'))    return 'teamleader';
  return 'teammember';
}

// ---------------------------------------------------------------------------
// Role -> ordered menu entries (each with Article reference for traceability)
// ---------------------------------------------------------------------------
export const ROLE_MENUS = {
  // 1. CEO - Sole signatory, executive oversight
  //    Articles 12, 16.7, 22.1
  ceo: [
    { id: 'dashboard',     article: 'Art. 12' },
    { id: 'operations',    article: 'Art. 12.3 (CEO digital authorization)' },
    { id: 'staff',         article: 'Art. 12.1 (sole signatory)' },
    { id: 'performance',   article: 'Art. 16.7 (Generation summary)' },
    { id: 'customers',     article: 'Company-wide CRM oversight' },
    { id: 'houses',        article: 'Strategic inventory view' },
    { id: 'notifications', article: 'Art. 12.5 (Executive directives)' },
    { id: 'calendar',      article: 'Art. 12.6 (Assembly of Gen Heads)' },
  ],

  // 2. Information Department - Property verification & cybersecurity
  //    Articles 13.1, 13.2, 13.3
  information: [
    { id: 'dashboard',     article: 'Art. 13.1 (Document registry)' },
    { id: 'operations',    article: 'Art. 13.2 (Verify & publish), 13.3 (Access audit)' },
    { id: 'houses',        article: 'Art. 13.2 (Property listing manager)' },
    { id: 'staff',         article: 'Read-only cross-reference' },
    { id: 'notifications', article: 'Cybersecurity alerts' },
    { id: 'calendar',      article: 'Developer intake schedule' },
  ],

  // 3. Finance Department - Commission disbursement & payroll
  //    Articles 14.1, 14.2, 14.5, 22
  finance: [
    { id: 'dashboard',     article: 'Art. 14.1 (Finance oversight)' },
    { id: 'operations',    article: 'Art. 14.2, 22.3 (Payment certificates & disbursement)' },
    { id: 'staff',         article: 'Art. 22.1 (Admin payroll ledger)' },
    { id: 'performance',   article: 'Art. 22.4 (Commission ledger)' },
    { id: 'houses',        article: 'Read-only (commission rate basis)' },
    { id: 'notifications', article: 'Art. 14.5 (2% tax reconciliation)' },
    { id: 'calendar',      article: 'Disbursement batch schedule' },
  ],

  // 4. System Administrator - IT infrastructure & RBAC
  //    Articles 15.1, 15.2
  sysadmin: [
    { id: 'dashboard',     article: 'Art. 15.1 (IT infrastructure)' },
    { id: 'staff',         article: 'Art. 15.1 (RBAC management)' },
    { id: 'operations',    article: 'Art. 15.2 (PIN reset, ban/unban, access review)' },
    { id: 'performance',   article: 'Server health & uptime' },
    { id: 'notifications', article: 'System & security alerts' },
    { id: 'calendar',      article: 'Maintenance windows' },
  ],

  // 5. Generation Head - 10-branch oversight
  //    Articles 10, 16.5, 16.6, 16.7
  genhead: [
    { id: 'dashboard',     article: 'Art. 10, 16 (Generation oversight)' },
    { id: 'operations',    article: 'Art. 16.5 (Inter-branch dispute resolution)' },
    { id: 'staff',         article: 'Art. 10 (10 Branch Managers)' },
    { id: 'customers',     article: 'Generation-wide pipeline' },
    { id: 'houses',        article: 'Art. 16.6 (Developer contract intake)' },
    { id: 'performance',   article: 'Art. 16.7 (Generation summary report)' },
    { id: 'notifications', article: 'Assemblies & directives' },
    { id: 'calendar',      article: 'Bi-weekly assemblies' },
  ],

  // 6. Branch Manager - 10-team oversight & tendency reports
  //    Articles 9, 17, 18.2
  branchmgr: [
    { id: 'dashboard',     article: 'Art. 9, 17 (Branch oversight)' },
    { id: 'customers',     article: 'Art. 18.2 (Lead reassignment)' },
    { id: 'operations',    article: 'Art. 17.6 (Tendency reports)' },
    { id: 'staff',         article: 'Art. 9 (10 Team Leaders)' },
    { id: 'houses',        article: 'Branch inventory view' },
    { id: 'performance',   article: 'Team leaderboard' },
    { id: 'notifications', article: 'Branch alerts' },
    { id: 'calendar',      article: 'Branch review meetings' },
  ],

  // 7. Team Leader - 10-member team & morning standups
  //    Articles 8, 18
  teamleader: [
    { id: 'dashboard',     article: 'Art. 8, 18 (Team oversight)' },
    { id: 'customers',     article: 'Team pipeline' },
    { id: 'operations',    article: 'Art. 8.4 (Diary verification)' },
    { id: 'houses',        article: 'Property catalog for team' },
    { id: 'staff',         article: 'Direct team roster' },
    { id: 'performance',   article: 'Team target tracker' },
    { id: 'notifications', article: 'Standup reminders' },
    { id: 'calendar',      article: 'Art. 8.2 (Morning standup)' },
  ],

  // 8. Team Member / Direct Sales Agent - personal pipeline
  //    Articles 8.3, 19, 22.3
  teammember: [
    { id: 'dashboard',     article: 'Art. 19 (Sales agent workplace)' },
    { id: 'customers',     article: 'Art. 8.3 (Personal CRM)' },
    { id: 'houses',        article: 'Art. 19.3 (Verified property catalog)' },
    { id: 'operations',    article: 'Art. 19.2 (Daily diary submission)' },
    { id: 'performance',   article: 'Art. 22.3 (1.5% commission tracker)' },
    { id: 'notifications', article: 'Personal notifications' },
    { id: 'calendar',      article: 'Site visit schedule' },
  ],
};

// ---------------------------------------------------------------------------
// Public helper: build the fully-resolved menu array for a user session
// ---------------------------------------------------------------------------
// Returns: [{ id, label, icon, article, color? }, ...]
//   - Dashboard label is overridden with role-specific title
//   - Dashboard color is overridden with role-specific color
//   - Other items keep default label & no special color
// ---------------------------------------------------------------------------
export function getRoleMenu(userSession) {
  const roleKey = resolveRoleKey(userSession);
  const entries = ROLE_MENUS[roleKey] || ROLE_MENUS.teammember;
  const dashboardLabel = ROLE_DASHBOARD_LABELS[roleKey] || 'My Dashboard';
  const roleColor = ROLE_COLORS[roleKey] || '#2563eb';

  return entries.map((entry) => {
    const item = MENU_ITEMS[entry.id] || {
      id: entry.id,
      label: entry.id,
      icon: LayoutDashboard,
    };
    return {
      id: item.id,
      label: entry.id === 'dashboard' ? dashboardLabel : item.label,
      icon: item.icon,
      article: entry.article,
      color: entry.id === 'dashboard' ? roleColor : undefined,
    };
  });
}

// ---------------------------------------------------------------------------
// Helper: lookup role metadata (label, color) for use in NavigationBanner etc.
// ---------------------------------------------------------------------------
export function getRoleMeta(userSession) {
  const roleKey = resolveRoleKey(userSession);
  return {
    key: roleKey,
    label: ROLE_DASHBOARD_LABELS[roleKey] || 'My Dashboard',
    color: ROLE_COLORS[roleKey] || '#2563eb',
  };
}

export default {
  MENU_ITEMS,
  ROLE_MENUS,
  ROLE_DASHBOARD_LABELS,
  ROLE_COLORS,
  resolveRoleKey,
  getRoleMenu,
  getRoleMeta,
};
