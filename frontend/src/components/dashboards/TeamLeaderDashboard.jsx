import React, { useState } from 'react';
import { 
  Users, CheckCircle2, PhoneCall, Calendar, Target, 
  FileText, MessageSquare, Plus, RefreshCw, Send 
} from 'lucide-react';
import { verifyDiary } from '../../services/api';

export const TeamLeaderDashboard = ({ data, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'members', 'pipeline', 'meetings'

  if (!data) return <div className="p-4">Loading Team Leader Operations Console...</div>;

  const { kpis = {}, team = {}, members = [], diary_review_queue = [], customers = [], morning_meetings = [] } = data || {};

  const handleVerify = async (diaryId) => {
    const feedback = prompt("Enter Team Leader coaching feedback & sign-off note (Article 8.4):");
    if (!feedback) return;
    try {
      await verifyDiary({
        diary_id: diaryId,
        leader_id: 7, // Team Leader ID
        leader_notes: feedback,
      });
      alert("Diary verified and leader feedback logged!");
      onRefresh();
    } catch (err) {
      alert("Verification error: " + err.message);
    }
  };

  return (
    <div className="role-dashboard-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={24} color="#0891b2" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Team Leader Field Operations Console</h2>
              <span className="role-badge-pill role-badge-teamleader">Level 3 Leadership</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Team: {team?.name || 'Eagle Sales Team'} ({team?.code || 'TM-01-AYAT'})
            </div>
          </div>
        </div>
        <div className="quick-action-bar">
          <button className="dash-btn-outline" onClick={onRefresh}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-kpi-grid">
        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Team Sales Volume</span>
            <Target size={16} color="#2563eb" />
          </div>
          <div className="kpi-card-value">ETB {(kpis.team_sales_volume || 0).toLocaleString()}</div>
          <div className="kpi-card-subtext">{kpis.deals_count || 0} Closed Deals</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Team Members</span>
            <Users size={16} color="#059669" />
          </div>
          <div className="kpi-card-value">{kpis.team_members_count || 0} Agents</div>
          <div className="kpi-card-subtext">Under direct mentorship & guidance</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Customer Pipeline</span>
            <PhoneCall size={16} color="#d97706" />
          </div>
          <div className="kpi-card-value">{kpis.customers_pipeline_count || 0}</div>
          <div className="kpi-card-subtext">Active prospective buyers</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Diaries Verification Queue</span>
            <FileText size={16} color="#dc2626" />
          </div>
          <div className="kpi-card-value" style={{ color: '#dc2626' }}>
            {kpis.pending_diaries_verification || 0}
          </div>
          <div className="kpi-card-subtext">Requires leader sign-off (Art. 8.4)</div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--table-border)', paddingBottom: '8px' }}>
        <button 
          className={`dash-btn-outline ${activeTab === 'queue' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('queue')}
        >
          Diary Review Queue ({diary_review_queue.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'members' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Team Agents Roster ({members.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'pipeline' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('pipeline')}
        >
          Customer Leads Pipeline ({customers.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'meetings' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('meetings')}
        >
          Morning Standups ({morning_meetings.length})
        </button>
      </div>

      {/* Tab 1: Diary Review Queue */}
      {activeTab === 'queue' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <FileText size={16} color="#dc2626" />
              <span>Daily Activity Diary Verification Queue (Article 8.4 & 18.3)</span>
            </div>
            <span className="panel-badge">{diary_review_queue.length} Total</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {diary_review_queue.map((d) => (
              <div key={d.id} style={{ border: '1px solid var(--table-border)', borderRadius: '8px', padding: '14px', background: 'var(--bg-app)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '800', fontSize: '14px' }}>{d.member?.name || 'Agent'}</span>
                  <span style={{ color: '#64748b', fontSize: '11.5px' }}>Date: {d.report_date}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#475569', marginBottom: '8px' }}>
                  <span>Calls: <strong>{d.calls_made || 0}</strong></span>
                  <span>New Leads: <strong>{d.customers_registered || 0}</strong></span>
                  <span>Field Visits: <strong>{d.field_visits_conducted || 0}</strong></span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#1e293b' }}>
                  <strong>Activity Summary:</strong> {d.activity_summary}
                </div>
                {d.challenges_encountered && (
                  <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>
                    <strong>Challenges:</strong> {d.challenges_encountered}
                  </div>
                )}
                {d.leader_notes ? (
                  <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '6px', background: '#dcfce7', padding: '6px 10px', borderRadius: '4px' }}>
                    <strong>Signed by Leader:</strong> {d.leader_notes}
                  </div>
                ) : (
                  <div style={{ marginTop: '10px' }}>
                    <button 
                      className="dash-btn-success" 
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                      onClick={() => handleVerify(d.id)}
                    >
                      <CheckCircle2 size={12} /> Add Leader Feedback & Sign
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Members Roster */}
      {activeTab === 'members' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Users size={16} color="#2563eb" />
              <span>Assigned Team Members (Direct Sales Agents)</span>
            </div>
            <span className="panel-badge">{members.length} Agents</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Official ID</th>
                  <th>Agent Name</th>
                  <th>Contact</th>
                  <th>Performance Grade</th>
                  <th>Role Type</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td><code>{m.official_id}</code></td>
                    <td><strong>{m.name}</strong></td>
                    <td>{m.phone}</td>
                    <td>Level {m.grade_level || 1}</td>
                    <td><span className="role-badge-pill role-badge-member">Direct Sales</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Customer Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <PhoneCall size={16} color="#d97706" />
              <span>Team Customer Inquiries & Pipeline</span>
            </div>
            <span className="panel-badge">{customers.length} Leads</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Budget</th>
                  <th>Interest</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.full_name}</strong></td>
                    <td>{c.phone}</td>
                    <td>ETB {parseFloat(c.budget_min || 0).toLocaleString()}</td>
                    <td>{c.preferred_property_type}</td>
                    <td><span className="role-badge-pill role-badge-branch">{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Morning Standups */}
      {activeTab === 'meetings' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Calendar size={16} color="#0891b2" />
              <span>Morning Daily Briefings & Decision Logs (Article 8.2)</span>
            </div>
            <span className="panel-badge">{morning_meetings.length} Meetings</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {morning_meetings.map((m) => (
              <div key={m.id} style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                  <span>{m.title}</span>
                  <span style={{ color: '#64748b', fontSize: '11px' }}>{new Date(m.scheduled_at).toLocaleTimeString()}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
                  <strong>Agenda:</strong> {m.agenda}
                </div>
                {m.decision_log && (
                  <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>
                    <strong>Action Decisions:</strong> {m.decision_log}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
