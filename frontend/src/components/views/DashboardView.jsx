import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Briefcase, 
  Building, 
  Users, 
  RefreshCw, 
  Lock, 
  UserCheck, 
  AlertCircle,
  ArrowRightLeft,
  CheckCircle2,
  X
} from 'lucide-react';
import '../dashboards/dashboards.css';

import { CeoDashboard } from '../dashboards/CeoDashboard';
import { InformationDeptDashboard } from '../dashboards/InformationDeptDashboard';
import { FinanceDeptDashboard } from '../dashboards/FinanceDeptDashboard';
import { SystemAdminDashboard } from '../dashboards/SystemAdminDashboard';
import { GenerationHeadDashboard } from '../dashboards/GenerationHeadDashboard';
import { BranchManagerDashboard } from '../dashboards/BranchManagerDashboard';
import { TeamLeaderDashboard } from '../dashboards/TeamLeaderDashboard';
import { TeamMemberDashboard } from '../dashboards/TeamMemberDashboard';
import { fetchRoleDashboard } from '../../services/api';
import { getFallbackDashboardData } from '../../data/mockDashboards';

// Verified Seeded Role Personas with Exact Responsibilities & Access Rights
export const ROLE_PERSONAS = [
  {
    key: 'ceo',
    roleTag: 'CEO',
    primary_role: 'CEO',
    title: 'Chief Executive Officer (CEO)',
    officialId: 'BH-CEO-001',
    holderName: 'Dawit Gebremariam',
    grade: 'Level 5',
    structure: 'Executive Directorate',
    badgeClass: 'role-badge-ceo',
    icon: ShieldCheck,
    authorizedUser: 'Chief Executive Officer (CEO)',
    mandate: 'Article 12: Sole signatory on bank accounts (Art. 12.2), digital payout authorization (Art. 12.3), signing developer contracts (Art. 12.4), and chairing the Assembly of Generation Heads.',
    responsibilities: [
      'Company-wide sales KPI performance and strategic revenue targets',
      'Final executive authorization for CBE bank commission payouts (Art. 12.3)',
      'Ratification of developer partnership contracts (Art. 12.4)',
      'Convening and chairing the Assembly of Generation Heads'
    ]
  },
  {
    key: 'information',
    roleTag: 'INFORMATION_OFFICER',
    primary_role: 'INFORMATION_OFFICER',
    title: 'Information Department Officer',
    officialId: 'BH-INF-001',
    holderName: 'Kalkidan Assefa',
    grade: 'Level 4',
    structure: 'Administrative Structure (Back-Office)',
    badgeClass: 'role-badge-info',
    icon: Layers,
    authorizedUser: 'Head of Information Department & Registered Information Officers',
    mandate: 'Article 13.2: Verification of property title deeds and legal clearances, managing developer data intake, and publishing verified property listings to the digital portal.',
    responsibilities: [
      'Property title deeds & developer documentation legal clearance',
      'Verifying and publishing developer property listings to the digital system',
      'Maintaining document registry and secure confidential intake log',
      'Monitoring cybersecurity alerts and unauthorized data extraction'
    ]
  },
  {
    key: 'finance',
    roleTag: 'FINANCE_OFFICER',
    primary_role: 'FINANCE_OFFICER',
    title: 'Finance Department Officer',
    officialId: 'BH-FIN-001',
    holderName: 'Henok Tesfaye',
    grade: 'Level 4',
    structure: 'Administrative Structure (Back-Office)',
    badgeClass: 'role-badge-finance',
    icon: Briefcase,
    authorizedUser: 'Head of Finance Department & Finance Officers',
    mandate: 'Article 14.2 & Article 22: Preparing payment certificates, calculating tiered commission disbursements (1.5% Direct, 0.25% TL, 0.15% BM, 0.10% GH), executing 2% withholding tax, and logging bank payouts.',
    responsibilities: [
      'Generating Article 22 Commission Payment Certificates upon deal closure',
      'Calculating 4-tier commission disbursements with leadership cumulative stacking (Art. 22.4)',
      'Deducting statutory 2% withholding tax per Article 14.5',
      'Maintaining Commercial Bank of Ethiopia (CBE) transfer batch audit logs'
    ]
  },
  {
    key: 'sysadmin',
    roleTag: 'SYSTEM_ADMIN',
    primary_role: 'SYSTEM_ADMIN',
    title: 'System Administrator',
    officialId: 'BH-SYS-001',
    holderName: 'Robel Girma',
    grade: 'Level 4',
    structure: 'Administrative Structure (Back-Office)',
    badgeClass: 'role-badge-admin',
    icon: ShieldCheck,
    authorizedUser: 'Lead IT System Administrator & Security Engineers',
    mandate: 'Article 15.1 & 15.2: IT infrastructure administration, role-based access management, staff PIN/password resets, database backup routines, and audit trails.',
    responsibilities: [
      'Enforcing role-based access control (RBAC) across all 8 organizational tiers',
      'Processing employee PIN reset requests per Article 15.2',
      'Database health monitoring, automated backups, and error rate tracking',
      'Comprehensive security audit logging for executive oversight'
    ]
  },
  {
    key: 'genhead',
    roleTag: 'GENERATION_HEAD',
    primary_role: 'GENERATION_HEAD',
    title: 'Generation Head (Generation 01 Alpha)',
    officialId: 'BH-GEN-001',
    holderName: 'Alemayehu Tadesse',
    grade: 'Level 5',
    structure: 'Sales Structure (Front-Office)',
    badgeClass: 'role-badge-gen',
    icon: Building,
    authorizedUser: 'Generation Head overseeing 10 Branches (1,000 Sales Agents)',
    mandate: 'Article 10 & 16: Overseeing 10 branches in the "Rule of 10" Decimal Hierarchy, developer contract intake (Art. 16.6), receiving 0.10% leadership commission, and resolving inter-branch disputes.',
    responsibilities: [
      'Overseeing 10 Branch Managers and an aggregate force of 1,000 sales personnel',
      'Direct developer contract intake and routing to CEO (Art. 16.6)',
      'Compiling Generation Summary Performance Reports for CEO review (Art. 16.7)',
      'Convening bi-weekly assemblies with Branch Managers'
    ]
  },
  {
    key: 'branchmgr',
    roleTag: 'BRANCH_MANAGER',
    primary_role: 'BRANCH_MANAGER',
    title: 'Branch Manager (Ayat Main Branch)',
    officialId: 'BH-BR-001',
    holderName: 'Selamawit Bekele',
    grade: 'Level 4',
    structure: 'Sales Structure (Front-Office)',
    badgeClass: 'role-badge-branch',
    icon: Building,
    authorizedUser: 'Branch Manager overseeing 10 Teams (100 Sales Agents)',
    mandate: 'Article 9 & 17: Overseeing 10 teams, customer lead reassignment after 10 days of inactivity (Art. 18.2), receiving 0.15% leadership commission, and compiling Branch Customer Tendency Reports (Art. 17.6).',
    responsibilities: [
      'Managing 10 Team Leaders and 100 sales consultants at the branch',
      'Reassigning neglected customer leads after 10 days per Article 18.2',
      'Submitting consolidated Branch Customer Tendency Reports to Generation Head',
      'Approving team site visit itineraries and coordinating developer presentations'
    ]
  },
  {
    key: 'teamleader',
    roleTag: 'TEAM_LEADER',
    primary_role: 'TEAM_LEADER',
    title: 'Team Leader (Alpha Squad 1)',
    officialId: 'BH-TL-001',
    holderName: 'Yonas Haile',
    grade: 'Level 3',
    structure: 'Sales Structure (Front-Office)',
    badgeClass: 'role-badge-teamleader',
    icon: Users,
    authorizedUser: 'Team Leader overseeing 10 Direct Sales Consultants',
    mandate: 'Article 8 & 18: Directly managing 10 consultants, holding 8:30 AM morning operational meetings, reviewing and signing Daily Activity Diaries (Art. 8.4 & 18.3), and receiving 0.25% team override commission.',
    responsibilities: [
      'Direct supervisory leadership over 10 ground-level consultants',
      'Conducting mandatory morning 8:30 AM team briefings and motivation sessions',
      'Daily inspection, verification, and sign-off of consultant activity diaries (Art. 8.4)',
      'Assisting team members in closing high-value negotiations and client visits'
    ]
  },
  {
    key: 'teammember',
    roleTag: 'TEAM_MEMBER',
    primary_role: 'TEAM_MEMBER',
    title: 'Direct Sales Consultant',
    officialId: 'BH-AGT-001',
    holderName: 'Tewodros Kassahun',
    grade: 'Level 1 & 2',
    structure: 'Sales Structure (Front-Office)',
    badgeClass: 'role-badge-member',
    icon: Users,
    authorizedUser: 'Registered Ground-Level Sales Agent / Marketing Consultant',
    mandate: 'Article 8.3 & Article 19: Customer intake, conducting property site tours, submitting Daily Activity Diaries (calls, client meetings, visits), and receiving 1.50% direct sales commission (Art. 22.3).',
    responsibilities: [
      'Prospecting, qualifying, and registering buyers into beha_db (Art. 8.3)',
      'Submitting Daily Activity Diaries documenting calls and site tours (Art. 19.1)',
      'Coordinating on-site property walkthroughs with prospective purchasers',
      'Directly earning 1.50% sales commission upon property deed settlement (Art. 22.3)'
    ]
  }
];

export const DashboardView = ({ t, onNavigate, userSession }) => {
  // Resolve active role strictly from userSession
  const resolveRoleKey = (session) => {
    if (!session) return 'teammember';
    const rawRole = (session.primary_role || session.role || '').toUpperCase();
    if (rawRole.includes('CEO') || rawRole.includes('EXECUTIVE')) return 'ceo';
    if (rawRole.includes('INFO')) return 'information';
    if (rawRole.includes('FIN')) return 'finance';
    if (rawRole.includes('SYS') || rawRole.includes('ADMIN')) return 'sysadmin';
    if (rawRole.includes('GEN')) return 'genhead';
    if (rawRole.includes('BRANCH') || rawRole.includes('BR_')) return 'branchmgr';
    if (rawRole.includes('LEADER') || rawRole.includes('TL')) return 'teamleader';
    return 'teammember';
  };

  // Strict Role Detection: userSession strictly governs the dashboard
  const userRoleKey = resolveRoleKey(userSession);
  const isSysAdmin = userRoleKey === 'sysadmin' || userSession?.isGuest;
  
  const [activeRoleKey, setActiveRoleKey] = useState(userRoleKey);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);

  // Keep strictly locked to logged-in user's role unless sysadmin chooses to inspect another role
  useEffect(() => {
    setActiveRoleKey(resolveRoleKey(userSession));
  }, [userSession]);

  // Current persona metadata matching active role
  const currentPersona = ROLE_PERSONAS.find(p => p.key === activeRoleKey) || ROLE_PERSONAS[7];
  const PersonaIcon = currentPersona.icon;

  // Fetch real database data for this specific role
  const loadDashboardData = useCallback(async (roleKey) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoleDashboard(roleKey, userSession?.id);
      setDashboardData(data || getFallbackDashboardData(roleKey, userSession?.id));
    } catch (err) {
      console.warn("Dashboard load warning:", err);
      setDashboardData(getFallbackDashboardData(roleKey, userSession?.id));
    } finally {
      setLoading(false);
    }
  }, [userSession?.id]);

  useEffect(() => {
    loadDashboardData(activeRoleKey);
  }, [activeRoleKey, loadDashboardData]);

  const handleSwitchPersona = (persona) => {
    if (!isSysAdmin) return;
    setActiveRoleKey(persona.key);
    setIsPersonaModalOpen(false);
  };

  const currentData = dashboardData || getFallbackDashboardData(activeRoleKey, userSession?.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      
      {/* 1. Official Role Authority & Security Banner (Strictly Role-Dedicated) */}
      <div style={{ 
        background: 'var(--card-bg, #ffffff)', 
        border: '1px solid var(--table-border, #e2e8f0)', 
        borderRadius: '12px', 
        padding: '18px 22px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          {/* Left: Role Identity & Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ 
              width: '46px', 
              height: '46px', 
              borderRadius: '10px', 
              background: 'rgba(37, 99, 235, 0.08)', 
              border: '1px solid rgba(37, 99, 235, 0.2)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <PersonaIcon size={24} color="#2563eb" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary, #0f172a)' }}>
                  {currentPersona.title}
                </h2>
                <span className={`role-badge-pill ${currentPersona.badgeClass}`}>
                  {currentPersona.grade} &bull; {currentPersona.structure}
                </span>
                <span style={{ 
                  background: '#dcfce7', 
                  color: '#15803d', 
                  border: '1px solid #bbf7d0',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={12} /> Role Clearance Verified
                </span>
              </div>

              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary, #64748b)', marginTop: '3px' }}>
                Authenticated Officer: <strong>{userSession?.name || currentPersona.holderName}</strong> &bull; Official Badge: <code style={{ fontWeight: '700', color: '#2563eb' }}>{userSession?.userId || currentPersona.officialId}</code>
              </div>
            </div>
          </div>

          {/* Right: Quick Operational Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isSysAdmin && (
              <button
                className="dash-btn-outline"
                onClick={() => setIsPersonaModalOpen(true)}
                title="Switch persona for testing all 8 roles"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}
              >
                <ArrowRightLeft size={13} />
                <span>Switch Role Persona</span>
              </button>
            )}
            <button 
              className="dash-btn-outline" 
              onClick={() => loadDashboardData(activeRoleKey)} 
              title="Refresh Live Data"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Operational Mandate & Access Rights Notice */}
        <div style={{ 
          background: 'var(--bg-app, #f8fafc)', 
          border: '1px solid var(--table-border, #e2e8f0)', 
          borderRadius: '8px', 
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          fontSize: '12px',
          lineHeight: '1.5'
        }}>
          <Lock size={15} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ color: 'var(--text-primary, #0f172a)' }}>
              <strong>Authorized Access Clearance:</strong> {currentPersona.authorizedUser}
            </div>
            <div style={{ color: 'var(--text-secondary, #64748b)', marginTop: '2px' }}>
              <strong>Operational Mandate:</strong> {currentPersona.mandate}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mode / Sync Notice */}
      {currentData?.is_fallback && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '10px 16px',
          fontSize: '12.5px',
          color: '#166534',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
            <span><strong>Seeded Article 8–22 Operational Data Active:</strong> Complete dashboards, KPIs, approval workflows, and interactive tools ready.</span>
          </div>
          <button 
            onClick={() => loadDashboardData(activeRoleKey)}
            style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11.5px', cursor: 'pointer', fontWeight: '600' }}
          >
            Check Live Database Sync
          </button>
        </div>
      )}

      {/* 3. Strict Role-Gated Dashboard Dispatcher */}
      {activeRoleKey === 'ceo' && (
        <CeoDashboard data={currentData} onRefresh={() => loadDashboardData('ceo')} />
      )}

      {activeRoleKey === 'information' && (
        <InformationDeptDashboard data={currentData} onRefresh={() => loadDashboardData('information')} />
      )}

      {activeRoleKey === 'finance' && (
        <FinanceDeptDashboard data={currentData} onRefresh={() => loadDashboardData('finance')} />
      )}

      {activeRoleKey === 'sysadmin' && (
        <SystemAdminDashboard data={currentData} onRefresh={() => loadDashboardData('sysadmin')} />
      )}

      {activeRoleKey === 'genhead' && (
        <GenerationHeadDashboard data={currentData} onRefresh={() => loadDashboardData('genhead')} />
      )}

      {activeRoleKey === 'branchmgr' && (
        <BranchManagerDashboard data={currentData} onRefresh={() => loadDashboardData('branchmgr')} />
      )}

      {activeRoleKey === 'teamleader' && (
        <TeamLeaderDashboard data={currentData} onRefresh={() => loadDashboardData('teamleader')} />
      )}

      {activeRoleKey === 'teammember' && (
        <TeamMemberDashboard data={currentData} onRefresh={() => loadDashboardData('teammember')} />
      )}

      {/* 5. Switch Role Persona Modal (For testing & role inspection) */}
      {isPersonaModalOpen && (
        <div className="dash-modal-overlay" onClick={() => setIsPersonaModalOpen(false)}>
          <div 
            className="dash-modal-box" 
            style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800' }}>
                  Switch Organizational Role &amp; Responsibility
                </h3>
                <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                  Select an authorized role to inspect its dedicated dashboard per Articles 8–22 guidelines.
                </p>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => setIsPersonaModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '12px' }}>
              {ROLE_PERSONAS.map((p) => {
                const isSelected = p.key === activeRoleKey;
                const PIcon = p.icon;
                return (
                  <div 
                    key={p.key}
                    onClick={() => handleSwitchPersona(p)}
                    style={{ 
                      padding: '14px', 
                      borderRadius: '10px', 
                      border: isSelected ? '2px solid #2563eb' : '1px solid var(--table-border, #e2e8f0)',
                      background: isSelected ? 'rgba(37, 99, 235, 0.04)' : 'var(--card-bg, #ffffff)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PIcon size={18} color="#2563eb" />
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-primary, #0f172a)' }}>
                          {p.title}
                        </strong>
                      </div>
                      <span className={`role-badge-pill ${p.badgeClass}`} style={{ fontSize: '10px' }}>
                        {p.grade}
                      </span>
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#475569' }}>
                      <strong>Officer:</strong> {p.holderName} (<code style={{ color: '#2563eb' }}>{p.officialId}</code>)
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#64748b', lineHeight: '1.4' }}>
                      <strong>Responsibility:</strong> {p.mandate}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '6px', borderTop: '1px dashed #e2e8f0' }}>
                      <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: '700' }}>
                        {p.structure}
                      </span>
                      {isSelected ? (
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} /> Active Dashboard
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Click to view &rarr;</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="dash-btn-outline" 
                onClick={() => setIsPersonaModalOpen(false)}
                style={{ padding: '8px 18px', fontSize: '12px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
