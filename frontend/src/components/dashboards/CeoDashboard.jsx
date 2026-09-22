import React, { useState } from 'react';
import { 
  ShieldCheck, Award, FileText, CheckCircle, Clock, Users, DollarSign, 
  Building, AlertTriangle, Send, Calendar, RefreshCw, ChevronRight, TrendingUp 
} from 'lucide-react';
import { approvePaymentCertificate, scheduleMeeting, issueCeoDirective } from '../../services/api';

export const CeoDashboard = ({ data, onRefresh }) => {
  const [activeModal, setActiveModal] = useState(null); // 'meeting', 'directive', null
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    meeting_type: 'in_person',
    tier_scope: 'CEO_ASSEMBLY',
    scheduled_at: '',
    location_or_link: 'Beha HQ Boardroom',
    agenda: '',
  });
  const [directiveForm, setDirectiveForm] = useState({
    title: '',
    message: '',
    target_role: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!data) return <div className="p-4">Loading CEO Command Center...</div>;

  const { kpis = {}, pending_certificates = [], pending_upgrades = [], assemblies = [], contracts = [], heatmap = [], open_disputes = [], recent_audits = [] } = data || {};

  const handleApproveCert = async (id) => {
    if (!confirm(`Authorize Payment Certificate #${id} for immediate commission disbursement?`)) return;
    try {
      await approvePaymentCertificate(id);
      alert("Payment Certificate officially approved by CEO (Article 12.3)");
      onRefresh();
    } catch (err) {
      alert("Approval error: " + err.message);
    }
  };

  const handleScheduleAssembly = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await scheduleMeeting({
        ...meetingForm,
        organizer_id: 1, // CEO ID
      });
      alert("Assembly of Generation Heads scheduled successfully!");
      setActiveModal(null);
      onRefresh();
    } catch (err) {
      alert("Error scheduling assembly: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendDirective = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await issueCeoDirective(directiveForm);
      alert("Executive Directive broadcasted across the company!");
      setActiveModal(null);
      onRefresh();
    } catch (err) {
      alert("Error broadcasting directive: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="role-dashboard-wrapper">
      {/* Top Quick Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={24} color="#dc2626" />
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Executive CEO Command Center</h2>
          <span className="role-badge-pill role-badge-ceo">Highest Executive Authority</span>
        </div>
        <div className="quick-action-bar">
          <button className="dash-btn-primary" onClick={() => setActiveModal('directive')}>
            <Send size={14} /> Issue Directive
          </button>
          <button className="dash-btn-outline" onClick={() => setActiveModal('meeting')}>
            <Calendar size={14} /> Schedule Assembly
          </button>
          <button className="dash-btn-outline" onClick={onRefresh} title="Refresh Data">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="dashboard-kpi-grid">
        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Total Sales Volume</span>
            <DollarSign size={16} color="#2563eb" />
          </div>
          <div className="kpi-card-value">ETB {(kpis.total_sales_volume || 0).toLocaleString()}</div>
          <div className="kpi-card-subtext">
            <TrendingUp size={12} color="#16a34a" /> {kpis.total_sales_count || 0} Deals closed under guideline
          </div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Pending Approvals</span>
            <Clock size={16} color="#dc2626" />
          </div>
          <div className="kpi-card-value" style={{ color: '#dc2626' }}>{kpis.pending_approvals_count || 0}</div>
          <div className="kpi-card-subtext">
            {pending_certificates.length} Payment Certificates awaiting CEO signature
          </div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Active Sales Force</span>
            <Users size={16} color="#16a34a" />
          </div>
          <div className="kpi-card-value">{kpis.active_sales_members || 0}</div>
          <div className="kpi-card-subtext">Tiered agents across all generations</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Active Customer Base</span>
            <Building size={16} color="#d97706" />
          </div>
          <div className="kpi-card-value">{kpis.active_customers || 0}</div>
          <div className="kpi-card-subtext">Prospective & contracted buyers</div>
        </div>
      </div>

      {/* Two Column Layout: Pending Approvals & Performance Heatmap */}
      <div className="dashboard-two-col">
        {/* 1. Pending Approvals Queue */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <FileText size={16} color="#dc2626" />
              <span>Pending Payment Certificates Queue (Article 12.3)</span>
            </div>
            <span className="panel-badge">{pending_certificates.length} Pending</span>
          </div>

          {pending_certificates.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: '13px', padding: '12px 0' }}>
              All commission payment certificates have been approved by the CEO.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Cert #</th>
                    <th>Property / Deal</th>
                    <th>Gross Commission</th>
                    <th>Net Payout</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pending_certificates.map((cert) => (
                    <tr key={cert.id}>
                      <td><strong>{cert.certificate_no}</strong></td>
                      <td>
                        {cert.deal?.property?.title || 'Property Deal'}
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Agent: {cert.deal?.agent?.name || 'N/A'}
                        </div>
                      </td>
                      <td>ETB {parseFloat(cert.gross_amount).toLocaleString()}</td>
                      <td style={{ fontWeight: '700', color: '#16a34a' }}>
                        ETB {parseFloat(cert.net_disbursed).toLocaleString()}
                      </td>
                      <td>
                        <button 
                          className="dash-btn-success" 
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => handleApproveCert(cert.id)}
                        >
                          <CheckCircle size={12} /> Digital Sign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pending Upgrades */}
          {pending_upgrades.length > 0 && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--table-border)' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#9333ea' }}>
                System Upgrade Proposals from IT Dept:
              </div>
              {pending_upgrades.map((up) => (
                <div key={up.id} style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', marginBottom: '6px', fontSize: '12.5px' }}>
                  <div style={{ fontWeight: '700' }}>{up.title} (v{up.version})</div>
                  <div style={{ color: '#475569', fontSize: '11.5px', marginTop: '3px' }}>{up.study_notes}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Org-Wide Performance Heatmap */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <TrendingUp size={16} color="#2563eb" />
              <span>Org Performance Heatmap (Generations &rarr; Branches)</span>
            </div>
            <span className="panel-badge">{heatmap.length} Active Generations</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {heatmap.map((gen) => (
              <div key={gen.generation_id} style={{ border: '1px solid var(--table-border)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '800', fontSize: '13.5px' }}>{gen.generation_name}</span>
                  <span style={{ fontWeight: '700', color: '#2563eb', fontSize: '12px' }}>
                    Total: ETB {gen.total_volume.toLocaleString()} ({gen.total_deals} deals)
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {gen.branches.map((br) => (
                    <div key={br.branch_id} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-app)', padding: '6px 10px', borderRadius: '4px', fontSize: '12px' }}>
                      <span>&bull; {br.branch_name} ({br.teams_count} teams)</span>
                      <span style={{ fontWeight: '600' }}>ETB {br.sales_volume.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assembly of Generation Heads & Developer Contracts */}
      <div className="dashboard-two-col">
        {/* Assembly Meetings */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Users size={16} color="#d97706" />
              <span>Assembly of Generation Heads (Upcoming & Log)</span>
            </div>
            <button className="dash-btn-outline" onClick={() => setActiveModal('meeting')} style={{ fontSize: '11px' }}>
              + New Session
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {assemblies.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '12.5px' }}>No assemblies currently scheduled.</div>
            ) : (
              assemblies.map((m) => (
                <div key={m.id} style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #d97706' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '13px' }}>
                    <span>{m.title}</span>
                    <span style={{ color: '#64748b', fontSize: '11px' }}>{new Date(m.scheduled_at).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                    <strong>Agenda:</strong> {m.agenda || 'Regular operational review'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Venue: {m.location_or_link || 'HQ Executive Room'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Developer Contracts Management */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Building size={16} color="#0284c7" />
              <span>Developer Partner Contracts (Article 12.4)</span>
            </div>
            <span className="panel-badge">{contracts.length} Partners</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Developer</th>
                  <th>Contract Ref</th>
                  <th>Agreed Rate</th>
                  <th>Properties</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.developer_name}</strong></td>
                    <td><code>{c.contract_ref}</code></td>
                    <td style={{ fontWeight: '700', color: '#0284c7' }}>{c.agreed_commission_rate}%</td>
                    <td>{c.properties_count || 0} Listings</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Compliance & Audit Trail */}
      <div className="dashboard-panel">
        <div className="panel-header">
          <div className="panel-title">
            <ShieldCheck size={16} color="#475569" />
            <span>Executive Audit & Compliance Log</span>
          </div>
          <span className="panel-badge">{recent_audits.length} Recent Events</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {recent_audits.map((a) => (
                <tr key={a.id}>
                  <td style={{ color: '#64748b' }}>{new Date(a.created_at).toLocaleString()}</td>
                  <td><strong>{a.user?.name || 'System'}</strong></td>
                  <td><code>{a.action}</code></td>
                  <td>{a.details}</td>
                  <td style={{ color: '#64748b', fontSize: '11px' }}>{a.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Schedule Assembly */}
      {activeModal === 'meeting' && (
        <div className="dash-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="dash-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Schedule Assembly of Generation Heads</h3>
            <form onSubmit={handleScheduleAssembly} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="dash-form-group">
                <label>Assembly Title</label>
                <input 
                  type="text" 
                  className="dash-input" 
                  required
                  value={meetingForm.title} 
                  onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  placeholder="e.g. Q4 Strategic Growth & Expansion Assembly"
                />
              </div>

              <div className="dash-form-group">
                <label>Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="dash-input" 
                  required
                  value={meetingForm.scheduled_at} 
                  onChange={(e) => setMeetingForm({ ...meetingForm, scheduled_at: e.target.value })}
                />
              </div>

              <div className="dash-form-group">
                <label>Location / Zoom Link</label>
                <input 
                  type="text" 
                  className="dash-input" 
                  value={meetingForm.location_or_link} 
                  onChange={(e) => setMeetingForm({ ...meetingForm, location_or_link: e.target.value })}
                />
              </div>

              <div className="dash-form-group">
                <label>Agenda</label>
                <textarea 
                  className="dash-input" 
                  rows={3}
                  value={meetingForm.agenda} 
                  onChange={(e) => setMeetingForm({ ...meetingForm, agenda: e.target.value })}
                  placeholder="Review quarterly targets, developer agreements, performance grades..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="dash-btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="dash-btn-primary" disabled={submitting}>
                  {submitting ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Issue Directive */}
      {activeModal === 'directive' && (
        <div className="dash-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="dash-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Issue Executive CEO Directive</h3>
            <form onSubmit={handleSendDirective} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="dash-form-group">
                <label>Directive Title</label>
                <input 
                  type="text" 
                  className="dash-input" 
                  required
                  value={directiveForm.title} 
                  onChange={(e) => setDirectiveForm({ ...directiveForm, title: e.target.value })}
                  placeholder="e.g. Strict Enforcement of Article 22 Withholding Tax Deduction"
                />
              </div>

              <div className="dash-form-group">
                <label>Target Department / Scope</label>
                <select 
                  className="dash-input"
                  value={directiveForm.target_role}
                  onChange={(e) => setDirectiveForm({ ...directiveForm, target_role: e.target.value })}
                >
                  <option value="">Company-Wide (All Employees)</option>
                  <option value="GENERATION_HEAD">Generation Heads Only</option>
                  <option value="BRANCH_MANAGER">Branch Managers Only</option>
                  <option value="FINANCE_OFFICER">Finance Department</option>
                  <option value="INFORMATION_OFFICER">Information Department</option>
                </select>
              </div>

              <div className="dash-form-group">
                <label>Directive Content / Order</label>
                <textarea 
                  className="dash-input" 
                  rows={4}
                  required
                  value={directiveForm.message} 
                  onChange={(e) => setDirectiveForm({ ...directiveForm, message: e.target.value })}
                  placeholder="Enter executive instruction..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="dash-btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="dash-btn-primary" disabled={submitting}>
                  {submitting ? 'Broadcasting...' : 'Broadcast Directive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
