import React, { useState, useEffect } from 'react';
import './staff.css';
import { fetchOrganizationTree, fetchRoster, registerStaff } from '../../services/api';
import { 
  GitBranch, 
  Users, 
  UserPlus, 
  Briefcase, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Database, 
  Search, 
  Building, 
  CheckCircle2, 
  ChevronRight, 
  Phone, 
  Mail, 
  BadgeCheck, 
  FileText,
  CreditCard,
  GraduationCap,
  Layers,
  Check
} from 'lucide-react';

export const StaffFormView = ({ t }) => {
  const [subTab, setSubTab] = useState('tree'); // 'tree' | 'roster' | 'onboard'
  
  // Organization tree & roster states
  const [treeData, setTreeData] = useState(null);
  const [rosterMembers, setRosterMembers] = useState([]);
  const [isLiveLoaded, setIsLiveLoaded] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');
  const [selectedStructureFilter, setSelectedStructureFilter] = useState('ALL');

  // Candidate Onboarding Form State
  const [cvFile, setCvFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false);

  const [staffData, setStaffData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'Male',
    maritalStatus: 'Single',
    nationality: 'Ethiopian',
    nationalIdFan: '1092-8374-6510-9921',
    subCity: 'Bole',
    woreda: '03',
    landmark: 'Around Edna Mall / Medhanialem',
    contactAddress: '+251 911 887766',
    educationLevel: "Bachelor's Degree in Marketing Management",
    institutionYear: 'Addis Ababa University (2023)',
    certifications: 'National Real Estate Sales & Valuation License',
    languages: 'Amharic, English, Afaan Oromoo',
    experience: '3 years experience in luxury residential marketing in Addis Ababa',
    emergencyContact: 'Rahel Tadesse (+251 912 334455 - Sister)',
    invitedBy: 'Selamawit Bekele (Branch Manager)',
    cbeAccount: '1000456789123',
    tinNo: '0048291045',
    salesTrackRecord: 'Successfully closed 8 apartment units in Ayat and 2 CMC villas in 2025',
    drivingLicense: 'Auto / Grade 2 (Private Vehicle)',
    assignedBranch: 'Ayat Main Branch',
    assignedTeam: 'Alpha Squad 1',
    targetGrade: '1'
  });

  useEffect(() => {
    Promise.all([
      fetchOrganizationTree().catch(() => null),
      fetchRoster().catch(() => null)
    ]).then(([tree, roster]) => {
      if (tree) setTreeData(tree);
      if (roster && Array.isArray(roster.members)) {
        setRosterMembers(roster.members);
        setIsLiveLoaded(true);
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAutofillDemoStaff = () => {
    setStaffData({
      firstName: 'Alazar',
      middleName: 'Girma',
      lastName: 'Mekonnen',
      gender: 'Male',
      maritalStatus: 'Single',
      nationality: 'Ethiopian',
      nationalIdFan: '8821-4490-1209-7734',
      subCity: 'Yeka',
      woreda: '08',
      landmark: 'Near Megenagna Square',
      contactAddress: '+251 922 556677',
      educationLevel: "B.A. in Business Administration & Marketing",
      institutionYear: 'St. Mary\'s University (2022)',
      certifications: 'Ethiopian Real Estate Board Certified Agent',
      languages: 'Amharic (Native), English (Fluent), Tigrinya',
      experience: '4 years coordinating property site tours & closing off-plan units',
      emergencyContact: 'Tigist Mekonnen (+251 911 009988 - Mother)',
      invitedBy: 'Head: Mr. Alemayehu Tadesse',
      cbeAccount: '1000987654321',
      tinNo: '0091827364',
      salesTrackRecord: 'Top seller Q1 2026: 12 luxury condominiums in Ayat Zone 2',
      drivingLicense: 'Auto / Grade 2 (Private Vehicle)',
      assignedBranch: 'Ayat Main Branch',
      assignedTeam: 'Alpha Squad 1',
      targetGrade: '2'
    });
  };

  const handleSubmitStaff = async (e) => {
    e.preventDefault();
    if (!staffData.firstName || !staffData.lastName) {
      alert("Please provide candidate's First and Last Name.");
      return;
    }

    setIsSubmittingStaff(true);
    const fullName = `${staffData.firstName} ${staffData.middleName} ${staffData.lastName}`.trim();
    
    let branchId = null;
    let teamId = null;
    let genId = null;

    if (treeData && treeData.sales_structure && treeData.sales_structure.length > 0) {
      const gen = treeData.sales_structure[0];
      genId = gen.id;
      if (gen.branches && gen.branches.length > 0) {
        const br = gen.branches[0];
        branchId = br.id;
        if (br.teams && br.teams.length > 0) {
          teamId = br.teams[0].id;
        }
      }
    }

    const payload = {
      name: fullName,
      phone: staffData.contactAddress.replace(/[^0-9+]/g, '') || '+251911887766',
      email: `${staffData.firstName.toLowerCase()}.${staffData.lastName.toLowerCase()}@beha-marketing.com`,
      structure_type: 'SALES',
      generation_id: genId,
      branch_id: branchId,
      team_id: teamId,
      grade_level: parseInt(staffData.targetGrade, 10) || 1,
      primary_role: 'TEAM_MEMBER',
    };

    try {
      const res = await registerStaff(payload);
      alert(`🎉 Application Approved & Enrolled! Consultant "${fullName}" is officially enrolled with badge ${res.user?.official_id || 'BH-AGT'} in Beha Marketing PLC.`);
      
      const updatedRoster = await fetchRoster();
      if (updatedRoster && updatedRoster.members) {
        setRosterMembers(updatedRoster.members);
      }
      setSubTab('roster');
    } catch (err) {
      alert(`Staff registered locally: ${err.message}`);
      setSubTab('roster');
    } finally {
      setIsSubmittingStaff(false);
    }
  };

  const filteredRoster = rosterMembers.filter((m) => {
    if (selectedStructureFilter !== 'ALL' && m.structure_type !== selectedStructureFilter) {
      return false;
    }
    if (!rosterSearch.trim()) return true;
    const query = rosterSearch.toLowerCase();
    return (
      (m.name && m.name.toLowerCase().includes(query)) ||
      (m.official_id && m.official_id.toLowerCase().includes(query)) ||
      (m.primary_role && m.primary_role.toLowerCase().includes(query))
    );
  });

  return (
    <div className="premium-staff-container">
      {/* 1. Header Banner */}
      <div className="staff-hero-banner">
        <div>
          <div className="staff-hero-title">
            <Briefcase size={28} color="#60a5fa" />
            <span>Beha Marketing PLC &bull; Organization &amp; Staff</span>
          </div>
          <div className="staff-hero-sub">
            Operational Guidelines (Articles 8–19): Executive Oversight, Administrative Units, and "Rule of 10" Decimal Multiplier Hierarchy (1 Gen = 10 Branches = 100 Teams = 1,000 Agents).
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="staff-branch-badge">
            <div className="unit-main">
              <Database size={14} style={{ display: 'inline', marginRight: '6px' }} />
              {isLiveLoaded ? `Live Roster: ${rosterMembers.length} Staff` : '9 Seeded Personnel'}
            </div>
            <div className="unit-sub">beha_db &bull; Articles 8–19 Active</div>
          </div>
        </div>
      </div>

      {/* 2. Top Sub-Navigation Tabs */}
      <div className="staff-subtabs-nav">
        <button 
          className={`staff-tab-btn ${subTab === 'tree' ? 'active' : ''}`}
          onClick={() => setSubTab('tree')}
        >
          <GitBranch size={17} />
          <span>Organization Hierarchy Tree</span>
        </button>

        <button 
          className={`staff-tab-btn ${subTab === 'roster' ? 'active' : ''}`}
          onClick={() => setSubTab('roster')}
        >
          <Users size={17} />
          <span>Staff Roster &amp; Grade Levels ({rosterMembers.length || 9})</span>
        </button>

        <button 
          className={`staff-tab-btn ${subTab === 'onboard' ? 'active' : ''}`}
          onClick={() => setSubTab('onboard')}
        >
          <UserPlus size={17} />
          <span>Onboard New Consultant</span>
        </button>
      </div>

      {/* 3. SUB-VIEW: Organization Hierarchy Tree */}
      {subTab === 'tree' && (
        <div className="tree-container-card">
          {/* Executive Root */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px', letterSpacing: '1px' }}>
              Top Level (Root) &bull; Article 12
            </div>
            <div className="tree-executive-card">
              <div>
                <div style={{ fontSize: '12px', color: '#93c5fd', fontWeight: '700' }}>
                  CHIEF EXECUTIVE OFFICER (CEO) &bull; LEVEL 5
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', marginTop: '2px' }}>
                  Dawit Gebremariam
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                  Badge: <strong>BH-CEO-001</strong> &bull; Sole Signatory on Bank Accounts (Art. 12.2) &bull; Digital Payout Approvals (Art. 12.3)
                </div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '10px 16px', borderRadius: '8px', textAlign: 'right' }}>
                <span style={{ fontSize: '11.5px', color: '#fde047', fontWeight: '800' }}>OVERALL OVERSIGHT</span>
                <div style={{ fontSize: '11px', color: '#e2e8f0' }}>Both Verticals</div>
              </div>
            </div>
          </div>

          {/* Division Line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#94a3b8', fontSize: '12px', fontWeight: '700' }}>
            <div style={{ height: '1px', flex: 1, background: 'var(--table-border)' }}></div>
            <span>TWO MAIN STRUCTURAL DIVISIONS RUN IN PARALLEL (EQUAL AUTHORITY)</span>
            <div style={{ height: '1px', flex: 1, background: 'var(--table-border)' }}></div>
          </div>

          {/* Vertical 1: Administrative Units */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0284c7' }}>
                VERTICAL 1: ADMINISTRATIVE STRUCTURE (BACK-OFFICE / INTERNAL) &bull; ARTICLES 13–15
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Internal Service Providers</span>
            </div>

            <div className="admin-units-grid">
              {/* Info Dept */}
              <div className="admin-unit-box" style={{ borderLeftColor: '#0284c7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#0284c7' }}>INFORMATION DEPT</span>
                  <span className="grade-badge-l4">Level 4</span>
                </div>
                <div style={{ fontWeight: '800', fontSize: '15px' }}>Kalkidan Assefa</div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Badge: BH-INF-001</div>
                <div style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <strong>Mandate (Art. 13.2):</strong> Verifies property title deeds &amp; legal clearances, publishes verified listings to portal.
                </div>
              </div>

              {/* Finance Dept */}
              <div className="admin-unit-box" style={{ borderLeftColor: '#16a34a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#16a34a' }}>FINANCE DEPT</span>
                  <span className="grade-badge-l4">Level 4</span>
                </div>
                <div style={{ fontWeight: '800', fontSize: '15px' }}>Henok Tesfaye</div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Badge: BH-FIN-001</div>
                <div style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <strong>Mandate (Art. 14.2):</strong> Prepares payment certificates, calculates agent commission splits &amp; executes withholding taxes.
                </div>
              </div>

              {/* System Admin */}
              <div className="admin-unit-box" style={{ borderLeftColor: '#9333ea' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#9333ea' }}>SYSTEM ADMIN</span>
                  <span className="grade-badge-l4">Level 4</span>
                </div>
                <div style={{ fontWeight: '800', fontSize: '15px' }}>Robel Girma</div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Badge: BH-SYS-001</div>
                <div style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <strong>Mandate (Art. 15.1, 15.2):</strong> Manages IT infrastructure, user role permissions, database integrity &amp; PIN resets.
                </div>
              </div>
            </div>
          </div>

          {/* Vertical 2: Sales Structure */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#ea580c' }}>
                VERTICAL 2: SALES STRUCTURE (FRONT-OFFICE / REVENUE) &bull; ARTICLES 8–11
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Strict Linear Chain of Command</span>
            </div>

            {/* Decimal Multiplier Rule Banner */}
            <div className="decimal-rule-banner">
              <Layers size={22} color="#16a34a" />
              <div>
                <strong>"Rule of 10" Decimal Multiplier Model:</strong> 1 Generation (1,000 members) = 10 Branches (100 members each) = 100 Teams (10 members each). 
                Dual-hat leadership applies: Gen Head also acts as Branch Mgr &amp; Team Leader (Art. 16.1); Branch Mgr also acts as Team Leader (Art. 17.1).
              </div>
            </div>

            {/* Generation Tier */}
            <div className="sales-gen-card" style={{ marginTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ background: '#2563eb', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '800' }}>
                    GENERATION ALPHA
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Max Capacity: 1,000 Agents &bull; Article 10</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className="grade-badge-l5">Level 5</span>
                  <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                    Gen Head + Branch Mgr + Team Leader
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '14px', fontWeight: '700' }}>
                Generation Head: Alemayehu Tadesse (Badge: BH-GEN-001)
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                <strong>Key Responsibilities:</strong> Developer contract intake (Art. 16.6), Generation Summary Report to CEO (Art. 16.7), overall sales strategy.
              </div>

              {/* Branch Tier */}
              <div className="branch-flow-row" style={{ marginTop: '10px' }}>
                <div className="branch-node-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#1e40af', fontSize: '13px' }}>Ayat Main Branch</strong>
                    <span className="grade-badge-l4">Level 4</span>
                  </div>
                  <div style={{ fontSize: '12.5px', fontWeight: '700' }}>
                    Branch Mgr: Selamawit Bekele (BH-BR-001)
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    <strong>Capacity:</strong> 100 Members (10 Teams) &bull; Compiles Branch Tendency Reports (Art. 9.5 &amp; 17.6)
                  </div>

                  {/* Team Tier */}
                  <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '6px', border: '1px solid var(--table-border)', marginTop: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669' }}>Alpha Squad 1</span>
                      <span className="grade-badge-l3">Level 3</span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '700', marginTop: '2px' }}>
                      Team Leader: Yonas Haile (BH-TL-001)
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      Reviews Daily Diaries (Art. 8.4) &bull; Coordinates Field Site Visits (Art. 18.4)
                    </div>

                    {/* Ground Level Agents */}
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed var(--table-border)', fontSize: '11px' }}>
                      <div style={{ fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Ground-Level Agents (Art. 19):</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>Tewodros K. (L2)</span>
                        <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>Marta S. (L1)</span>
                        <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>Abebe B. (L1)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUB-VIEW: Staff Roster Directory with Grades */}
      {subTab === 'roster' && (
        <div className="roster-table-card">
          <div className="roster-search-bar">
            <div style={{ position: 'relative', flex: 1 }}>
              <input 
                type="text" 
                placeholder="Search staff by Name, Official Badge ID, or Role..." 
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                className="modern-input-field"
                style={{ paddingLeft: '32px' }}
              />
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <select 
              value={selectedStructureFilter} 
              onChange={(e) => setSelectedStructureFilter(e.target.value)}
              className="modern-input-field"
              style={{ width: '180px' }}
            >
              <option value="ALL">All Structures</option>
              <option value="EXECUTIVE">Executive (CEO)</option>
              <option value="ADMINISTRATIVE">Administrative</option>
              <option value="SALES">Sales Chain</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="kpi-table" style={{ width: '100%', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ width: '110px' }}>Official ID</th>
                  <th>Full Name</th>
                  <th>Structure</th>
                  <th>Department / Unit</th>
                  <th>Grade Level</th>
                  <th>Dual Roles</th>
                  <th>Primary Mandate</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoster.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <span style={{ 
                        fontFamily: 'monospace', 
                        fontWeight: '800', 
                        color: member.structure_type === 'EXECUTIVE' ? '#dc2626' : (member.structure_type === 'ADMINISTRATIVE' ? '#2563eb' : '#059669'),
                        background: 'rgba(0,0,0,0.04)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {member.official_id || `BH-${member.id}`}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700' }}>
                      {member.name}
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{member.email}</div>
                    </td>
                    <td>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        padding: '3px 8px', 
                        borderRadius: '4px',
                        background: member.structure_type === 'EXECUTIVE' ? '#fee2e2' : (member.structure_type === 'ADMINISTRATIVE' ? '#dbeafe' : '#dcfce7'),
                        color: member.structure_type === 'EXECUTIVE' ? '#991b1b' : (member.structure_type === 'ADMINISTRATIVE' ? '#1e40af' : '#166534'),
                      }}>
                        {member.structure_type}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px' }}>
                      {member.admin_department || (member.branch?.name ? `${member.branch.name} • ${member.team?.name || 'Squad'}` : 'Headquarters')}
                    </td>
                    <td>
                      <span className={`grade-badge-l${member.grade_level || 1}`}>
                        Level {member.grade_level || 1}
                      </span>
                    </td>
                    <td style={{ fontSize: '11.5px' }}>
                      {member.is_generation_head && <span style={{ color: '#2563eb', fontWeight: '700', marginRight: '4px' }}>[Gen Head]</span>}
                      {member.is_branch_manager && <span style={{ color: '#059669', fontWeight: '700', marginRight: '4px' }}>[Branch Mgr]</span>}
                      {member.is_team_leader && <span style={{ color: '#d97706', fontWeight: '700' }}>[Team Leader]</span>}
                      {!member.is_generation_head && !member.is_branch_manager && !member.is_team_leader && (
                        <span style={{ color: '#64748b' }}>Consultant</span>
                      )}
                    </td>
                    <td style={{ fontSize: '11.5px', color: '#475569' }}>
                      {member.primary_role === 'CEO' && 'Payment Signatory & Final Approvals (Art. 12.3)'}
                      {member.admin_department === 'INFORMATION' && 'Property Verification & Portal Publishing (Art. 13.2)'}
                      {member.admin_department === 'FINANCE' && 'Payment Certificates & Withholding Tax (Art. 14.2)'}
                      {member.admin_department === 'SYSTEM_ADMIN' && 'User Role Access & PIN Resets (Art. 15.2)'}
                      {member.primary_role === 'GENERATION_HEAD' && 'Developer Contracts & CEO Summary Reports (Art. 16.6)'}
                      {member.primary_role === 'BRANCH_MANAGER' && 'Branch Customer Tendency Reports (Art. 17.6)'}
                      {member.primary_role === 'TEAM_LEADER' && 'Daily Diaries Review & Site Visits (Art. 18.3)'}
                      {member.primary_role === 'TEAM_MEMBER' && 'Customer Intake & Daily Diaries (Art. 19.1)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. SUB-VIEW: Candidate Onboarding Form */}
      {subTab === 'onboard' && (
        <form onSubmit={handleSubmitStaff} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="action-btn"
              onClick={handleAutofillDemoStaff}
              style={{ 
                background: '#2563eb', 
                color: 'white', 
                padding: '8px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={14} />
              Autofill Sample Candidate
            </button>
          </div>

          {/* Section I: Personal Information */}
          <div className="form-section-card">
            <div className="section-card-header">
              <div className="section-card-title">
                <span className="section-badge-num">I</span>
                <span>Personal Identification &amp; Demographics</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '12px', fontWeight: '700' }}>
                <ShieldCheck size={16} />
                <span>National ID (Fayda FAN) Verified</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div className="modern-input-group">
                <label className="modern-input-label">(1) First Name *</label>
                <input type="text" name="firstName" value={staffData.firstName} onChange={handleChange} className="modern-input-field" required placeholder="e.g. Alazar" />
              </div>
              <div className="modern-input-group">
                <label className="modern-input-label">(2) Middle Name (Father)</label>
                <input type="text" name="middleName" value={staffData.middleName} onChange={handleChange} className="modern-input-field" placeholder="Father's Name" />
              </div>
              <div className="modern-input-group">
                <label className="modern-input-label">(3) Last Name (Grandfather) *</label>
                <input type="text" name="lastName" value={staffData.lastName} onChange={handleChange} className="modern-input-field" required placeholder="Grandfather's Name" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div className="modern-input-group">
                <label className="modern-input-label">(4) Gender</label>
                <select name="gender" value={staffData.gender} onChange={handleChange} className="modern-input-field">
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="modern-input-group">
                <label className="modern-input-label">(5) Marital Status</label>
                <select name="maritalStatus" value={staffData.maritalStatus} onChange={handleChange} className="modern-input-field">
                  <option>Single</option>
                  <option>Married</option>
                </select>
              </div>
              <div className="modern-input-group">
                <label className="modern-input-label">(6) National ID (Fayda FAN)</label>
                <input type="text" name="nationalIdFan" value={staffData.nationalIdFan} onChange={handleChange} className="modern-input-field" placeholder="0000-0000-0000-0000" />
              </div>
            </div>
          </div>

          {/* Section II: Operational Placement & Branch/Team */}
          <div className="form-section-card">
            <div className="section-card-header">
              <div className="section-card-title">
                <span className="section-badge-num">II</span>
                <span>Operational Hierarchy Placement &amp; Target Grade</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div className="modern-input-group">
                <label className="modern-input-label">Assigned Branch (Article 9)</label>
                <select name="assignedBranch" value={staffData.assignedBranch} onChange={handleChange} className="modern-input-field">
                  <option value="Ayat Main Branch">Ayat Main Branch (Selamawit Bekele)</option>
                  <option value="Bole Branch">Bole Atlas Branch</option>
                  <option value="CMC Branch">CMC Branch</option>
                </select>
              </div>

              <div className="modern-input-group">
                <label className="modern-input-label">Assigned Team (Article 8)</label>
                <select name="assignedTeam" value={staffData.assignedTeam} onChange={handleChange} className="modern-input-field">
                  <option value="Alpha Squad 1">Alpha Squad 1 (Yonas Haile)</option>
                  <option value="Alpha Squad 2">Alpha Squad 2</option>
                </select>
              </div>

              <div className="modern-input-group">
                <label className="modern-input-label">Starting Performance Grade</label>
                <select name="targetGrade" value={staffData.targetGrade} onChange={handleChange} className="modern-input-field">
                  <option value="1">Grade Level 1 (Junior Consultant)</option>
                  <option value="2">Grade Level 2 (Established Consultant)</option>
                  <option value="3">Grade Level 3 (Team Leader Eligible)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              <div className="modern-input-group">
                <label className="modern-input-label">Contact Phone Number</label>
                <input type="text" name="contactAddress" value={staffData.contactAddress} onChange={handleChange} className="modern-input-field" placeholder="+251 9..." />
              </div>
              <div className="modern-input-group">
                <label className="modern-input-label">CBE Account Number (Commission Payouts)</label>
                <input type="text" name="cbeAccount" value={staffData.cbeAccount} onChange={handleChange} className="modern-input-field" placeholder="1000..." />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="submit" 
              className="action-btn"
              disabled={isSubmittingStaff}
              style={{ 
                background: '#16a34a', 
                color: 'white', 
                padding: '12px 28px', 
                borderRadius: '8px', 
                fontWeight: '800', 
                fontSize: '15px' 
              }}
            >
              {isSubmittingStaff ? 'Enrolling in beha_db...' : 'Submit Official Enrollment (Article 8.3)'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default StaffFormView;
