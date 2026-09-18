import React, { useState } from 'react';
import { 
  Briefcase, TrendingUp, Building, Users, AlertTriangle, 
  Calendar, CheckCircle, FileText, Plus, RefreshCw, ChevronRight 
} from 'lucide-react';
import { scheduleMeeting, resolveDispute } from '../../services/api';

export const GenerationHeadDashboard = ({ data, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('branches'); // 'branches', 'tendency', 'disputes', 'meetings'

  if (!data) return <div className="p-4">Loading Generation Head Oversight Console...</div>;

  const { kpis, generation, branches = [], tendency_reports = [], disputes = [], meetings = [] } = data;

  const handleResolveDispute = async (disputeId) => {
    const notes = prompt("Enter resolution terms for this operational grievance (Article 16.4):");
    if (!notes) return;
    try {
      await resolveDispute({
        dispute_id: disputeId,
        resolved_by_id: 5, // Gen Head
        resolution_notes: notes,
      });
      alert("Dispute officially resolved by Generation Head!");
      onRefresh();
    } catch (err) {
      alert("Resolution error: " + err.message);
    }
  };

  return (
    <div className="role-dashboard-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={24} color="#d97706" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Generation Head Oversight Console</h2>
              <span className="role-badge-pill role-badge-gen">Level 5 Senior Leadership</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Scope: {generation?.name || 'Generation Alpha'} (Article 10 & 16)
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
            <span>Generation Sales Volume</span>
            <TrendingUp size={16} color="#2563eb" />
          </div>
          <div className="kpi-card-value">ETB {(kpis.total_generation_volume || 0).toLocaleString()}</div>
          <div className="kpi-card-subtext">{kpis.total_deals_closed || 0} Total Generation Deals</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Active Branches</span>
            <Building size={16} color="#059669" />
          </div>
          <div className="kpi-card-value">{kpis.branches_count || 0}</div>
          <div className="kpi-card-subtext">Operating under Generation jurisdiction</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Active Sales Force</span>
            <Users size={16} color="#d97706" />
          </div>
          <div className="kpi-card-value">{kpis.active_agents_count || 0}</div>
          <div className="kpi-card-subtext">Agents across all generation branches</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Tendency Reports</span>
            <FileText size={16} color="#9333ea" />
          </div>
          <div className="kpi-card-value">{kpis.pending_tendency_reports || 0}</div>
          <div className="kpi-card-subtext">Branch market feedback submitted</div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--table-border)', paddingBottom: '8px' }}>
        <button 
          className={`dash-btn-outline ${activeTab === 'branches' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('branches')}
        >
          Branch Rollup & Teams ({branches.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'tendency' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('tendency')}
        >
          Customer Tendency Reports ({tendency_reports.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'disputes' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('disputes')}
        >
          Grievances & Disputes ({disputes.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'meetings' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('meetings')}
        >
          Generation Assemblies ({meetings.length})
        </button>
      </div>

      {/* Tab 1: Branch Rollup */}
      {activeTab === 'branches' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Building size={16} color="#2563eb" />
              <span>Branch Hierarchy & Operational Overview</span>
            </div>
            <span className="panel-badge">{branches.length} Branches</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Branch Name</th>
                  <th>Branch Code</th>
                  <th>Manager</th>
                  <th>City / Hub</th>
                  <th>Teams Count</th>
                  <th>Total Agents</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((br) => (
                  <tr key={br.id}>
                    <td><strong>{br.name}</strong></td>
                    <td><code>{br.code}</code></td>
                    <td>{br.manager}</td>
                    <td>{br.city || 'Addis Ababa'}</td>
                    <td>{br.teams_count} Teams</td>
                    <td style={{ fontWeight: '700' }}>{br.agents_count} Agents</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Tendency Reports */}
      {activeTab === 'tendency' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <FileText size={16} color="#d97706" />
              <span>Branch Customer Tendency Reports (Article 9.5 & 17.6)</span>
            </div>
            <span className="panel-badge">{tendency_reports.length} Reports</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tendency_reports.map((r) => (
              <div key={r.id} style={{ border: '1px solid var(--table-border)', borderRadius: '8px', padding: '14px', background: 'var(--bg-app)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '800', fontSize: '13.5px' }}>
                    Branch: {r.branch?.name || 'Ayat Branch'}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '11.5px' }}>
                    Period: {r.period_start} to {r.period_end}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#1e293b' }}>
                  <strong>Market Inclination Summary:</strong> {r.market_tendency_summary}
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>
                  <strong>Customer Objections & Needs:</strong> {r.customer_objections_analysis}
                </div>
                <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '6px' }}>
                  Demanded Properties: {Array.isArray(r.demanded_property_types) ? r.demanded_property_types.join(', ') : 'Villas & Apartments'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Disputes */}
      {activeTab === 'disputes' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <AlertTriangle size={16} color="#dc2626" />
              <span>Lead Jurisdiction & Commission Disputes</span>
            </div>
            <span className="panel-badge">{disputes.length} Active</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Raised By</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((d) => (
                  <tr key={d.id}>
                    <td><code>{d.dispute_code}</code></td>
                    <td>
                      <strong>{d.title}</strong>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{d.description}</div>
                    </td>
                    <td><span className="role-badge-pill role-badge-gen">{d.category}</span></td>
                    <td>{d.raised_by?.name || 'Agent'}</td>
                    <td>
                      <span className="role-badge-pill role-badge-branch">{d.status.toUpperCase()}</span>
                    </td>
                    <td>
                      {d.status !== 'resolved' && (
                        <button 
                          className="dash-btn-success" 
                          style={{ padding: '3px 8px', fontSize: '11px' }}
                          onClick={() => handleResolveDispute(d.id)}
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Meetings */}
      {activeTab === 'meetings' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Calendar size={16} color="#2563eb" />
              <span>Generation Head Strategic Meetings</span>
            </div>
            <span className="panel-badge">{meetings.length} Scheduled</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {meetings.map((m) => (
              <div key={m.id} style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                  <span>{m.title}</span>
                  <span style={{ color: '#64748b', fontSize: '11px' }}>{new Date(m.scheduled_at).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                  {m.agenda || 'Regular generation agenda'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
