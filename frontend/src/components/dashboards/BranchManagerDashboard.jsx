import React, { useState } from 'react';
import { 
  Building2, Users, FileText, CheckCircle2, TrendingUp, 
  MapPin, AlertCircle, RefreshCw, Send, Plus, ArrowRight 
} from 'lucide-react';

export const BranchManagerDashboard = ({ data, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('teams'); // 'teams', 'diaries', 'tendency', 'customers'
  const [showTendencyModal, setShowTendencyModal] = useState(false);
  const [tendencyForm, setTendencyForm] = useState({
    summary: '',
    objections: '',
    budget: '',
  });

  if (!data) return <div className="p-4">Loading Branch Manager Operations Command...</div>;

  const { kpis = {}, branch = {}, teams = [], customers = [], diaries = [], tendency_reports = [], disputes = [] } = data || {};

  const handleSubmitTendency = (e) => {
    e.preventDefault();
    alert("Tendency Report compiled and submitted to Generation Head (Article 17.6)");
    setShowTendencyModal(false);
    setTendencyForm({ summary: '', objections: '', budget: '' });
  };

  return (
    <div className="role-dashboard-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={24} color="#ea580c" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Branch Manager Operations Command</h2>
              <span className="role-badge-pill role-badge-branch">Level 4 Executive</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Branch: {branch?.name || 'Ayat Main Branch'} ({branch?.code || 'BR-01'})
            </div>
          </div>
        </div>
        <div className="quick-action-bar">
          <button className="dash-btn-primary" onClick={() => setShowTendencyModal(true)}>
            <Plus size={14} /> Draft Tendency Report
          </button>
          <button className="dash-btn-outline" onClick={onRefresh}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-kpi-grid">
        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Branch Sales Volume</span>
            <TrendingUp size={16} color="#2563eb" />
          </div>
          <div className="kpi-card-value">ETB {(kpis.branch_sales_volume || 0).toLocaleString()}</div>
          <div className="kpi-card-subtext">{kpis.deals_count || 0} Total Closed Deals</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Active Teams</span>
            <Users size={16} color="#16a34a" />
          </div>
          <div className="kpi-card-value">{kpis.total_teams || 0}</div>
          <div className="kpi-card-subtext">Operating field sales units</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Customer Pipeline</span>
            <Building2 size={16} color="#d97706" />
          </div>
          <div className="kpi-card-value">{kpis.active_customers || 0}</div>
          <div className="kpi-card-subtext">Active leads under branch agents</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Pending Diaries</span>
            <FileText size={16} color="#dc2626" />
          </div>
          <div className="kpi-card-value" style={{ color: '#dc2626' }}>
            {kpis.pending_diaries || 0}
          </div>
          <div className="kpi-card-subtext">Awaiting team leader verification</div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--table-border)', paddingBottom: '8px' }}>
        <button 
          className={`dash-btn-outline ${activeTab === 'teams' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          Branch Teams Leaderboard ({teams.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'diaries' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('diaries')}
        >
          Daily Activity Diaries ({diaries.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'customers' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          Branch Customer Pipeline ({customers.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'tendency' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('tendency')}
        >
          Tendency Reports ({tendency_reports.length})
        </button>
      </div>

      {/* Tab 1: Teams Leaderboard */}
      {activeTab === 'teams' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Users size={16} color="#2563eb" />
              <span>Branch Teams Performance Leaderboard</span>
            </div>
            <span className="panel-badge">{teams.length} Teams</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Code</th>
                  <th>Leader</th>
                  <th>Target Deals</th>
                  <th>Members</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t) => (
                  <tr key={t.id}>
                    <td><strong>{t.name}</strong></td>
                    <td><code>{t.code}</code></td>
                    <td>{t.leader}</td>
                    <td style={{ fontWeight: '700' }}>{t.target_sales} Monthly Deals</td>
                    <td>{t.members_count} Agents</td>
                    <td>
                      <span className="role-badge-pill role-badge-finance">ACTIVE</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Diaries */}
      {activeTab === 'diaries' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <FileText size={16} color="#16a34a" />
              <span>Daily Activity Diaries Flow (Article 8.4)</span>
            </div>
            <span className="panel-badge">{diaries.length} Diaries</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {diaries.map((d) => (
              <div key={d.id} style={{ border: '1px solid var(--table-border)', borderRadius: '6px', padding: '10px 14px', background: 'var(--bg-app)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '13px' }}>
                  <span>{d.member?.name || 'Agent'} ({d.team?.name || 'Team'})</span>
                  <span style={{ color: '#64748b', fontSize: '11px' }}>{d.report_date}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#1e293b', marginTop: '4px' }}>
                  <strong>Activity:</strong> {d.activity_summary}
                </div>
                {d.challenges_encountered && (
                  <div style={{ fontSize: '11.5px', color: '#dc2626', marginTop: '3px' }}>
                    <strong>Challenges:</strong> {d.challenges_encountered}
                  </div>
                )}
                {d.leader_notes && (
                  <div style={{ fontSize: '11.5px', color: '#2563eb', marginTop: '3px' }}>
                    <strong>Leader Feedback:</strong> {d.leader_notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Customers */}
      {activeTab === 'customers' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Building2 size={16} color="#0284c7" />
              <span>Branch Customer Registry & Lead Stages</span>
            </div>
            <span className="panel-badge">{customers.length} Leads</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Customer Code</th>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Budget Range</th>
                  <th>Preferred Type</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td><code>{c.customer_code}</code></td>
                    <td><strong>{c.full_name}</strong></td>
                    <td>{c.phone}</td>
                    <td>ETB {parseFloat(c.budget_min || 0).toLocaleString()} - {parseFloat(c.budget_max || 0).toLocaleString()}</td>
                    <td>{c.preferred_property_type || 'Villa'}</td>
                    <td>
                      <span className="role-badge-pill role-badge-branch">{c.status.toUpperCase()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Tendency Reports */}
      {activeTab === 'tendency' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <FileText size={16} color="#d97706" />
              <span>Customer Tendency Reports Prepared for Gen Head</span>
            </div>
            <button className="dash-btn-primary" onClick={() => setShowTendencyModal(true)} style={{ fontSize: '11px' }}>
              + Draft New Report
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tendency_reports.map((r) => (
              <div key={r.id} style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #ea580c' }}>
                <div style={{ fontWeight: '700', fontSize: '13px' }}>Period: {r.period_start} to {r.period_end}</div>
                <div style={{ fontSize: '12px', marginTop: '4px', color: '#334155' }}>
                  <strong>Tendency:</strong> {r.market_tendency_summary}
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px', color: '#64748b' }}>
                  <strong>Objections:</strong> {r.customer_objections_analysis}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Tendency Report */}
      {showTendencyModal && (
        <div className="dash-modal-overlay" onClick={() => setShowTendencyModal(false)}>
          <div className="dash-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Compile Branch Customer Tendency Report</h3>
            <form onSubmit={handleSubmitTendency} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="dash-form-group">
                <label>Market Tendency & Demand Summary</label>
                <textarea 
                  className="dash-input" 
                  rows={3} 
                  required
                  placeholder="e.g. Strong demand for 3-bedroom villas in Ayat Zone 3..."
                  value={tendencyForm.summary}
                  onChange={(e) => setTendencyForm({ ...tendencyForm, summary: e.target.value })}
                />
              </div>

              <div className="dash-form-group">
                <label>Customer Objections & Concerns</label>
                <textarea 
                  className="dash-input" 
                  rows={3} 
                  required
                  placeholder="e.g. Concerns over developer title deed delivery timeline..."
                  value={tendencyForm.objections}
                  onChange={(e) => setTendencyForm({ ...tendencyForm, objections: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="dash-btn-outline" onClick={() => setShowTendencyModal(false)}>Cancel</button>
                <button type="submit" className="dash-btn-primary">Submit to Gen Head</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
