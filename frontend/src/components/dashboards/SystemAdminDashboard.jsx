import React, { useState } from 'react';
import { 
  Server, Shield, Users, HardDrive, Activity, CheckCircle, 
  XCircle, AlertCircle, Plus, RefreshCw, Send, Lock 
} from 'lucide-react';
import { triggerBackup, reviewAccessRequest, submitSystemUpgrade } from '../../services/api';

export const SystemAdminDashboard = ({ data, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'audits', 'access', 'upgrades'
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeForm, setUpgradeForm] = useState({
    title: '',
    version: '',
    study_notes: '',
    impact_assessment: '',
  });

  if (!data) return <div className="p-4">Loading System Administration & Security Control...</div>;

  const { kpis, users = [], audit_logs = [], access_requests = [], system_upgrades = [], system_health = {} } = data;

  const handleBackup = async () => {
    try {
      const res = await triggerBackup();
      alert(`Success! Database snapshot generated:\n${res.filename}\nTimestamp: ${res.timestamp}`);
      onRefresh();
    } catch (err) {
      alert("Backup error: " + err.message);
    }
  };

  const handleReviewAccess = async (requestId, status) => {
    const notes = prompt(`Enter review notes for ${status} decision:`);
    if (notes === null) return;
    try {
      await reviewAccessRequest({
        request_id: requestId,
        reviewed_by_id: 4, // SysAdmin ID
        status,
        review_notes: notes,
      });
      alert(`Access request ${status} successfully!`);
      onRefresh();
    } catch (err) {
      alert("Error reviewing request: " + err.message);
    }
  };

  const handleSubmitUpgrade = async (e) => {
    e.preventDefault();
    try {
      await submitSystemUpgrade({
        ...upgradeForm,
        submitted_by_id: 4, // SysAdmin
      });
      alert("System upgrade proposal submitted to CEO for authorization!");
      setShowUpgradeModal(false);
      setUpgradeForm({ title: '', version: '', study_notes: '', impact_assessment: '' });
      onRefresh();
    } catch (err) {
      alert("Error submitting upgrade: " + err.message);
    }
  };

  return (
    <div className="role-dashboard-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={24} color="#9333ea" />
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>System Administration & Security Control</h2>
          <span className="role-badge-pill role-badge-admin">Infrastructure & RBAC Custodian</span>
        </div>
        <div className="quick-action-bar">
          <button className="dash-btn-primary" onClick={() => setShowUpgradeModal(true)}>
            <Plus size={14} /> Propose System Upgrade
          </button>
          <button className="dash-btn-outline" onClick={handleBackup}>
            <HardDrive size={14} /> Trigger DB Backup
          </button>
          <button className="dash-btn-outline" onClick={onRefresh}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-kpi-grid">
        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>User Accounts</span>
            <Users size={16} color="#2563eb" />
          </div>
          <div className="kpi-card-value">{kpis.total_accounts || 0}</div>
          <div className="kpi-card-subtext">Registered across 8 hierarchy roles</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Security Audits</span>
            <Shield size={16} color="#16a34a" />
          </div>
          <div className="kpi-card-value">{kpis.security_audits || 0}</div>
          <div className="kpi-card-subtext">Tracked system operations & logins</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Access Requests</span>
            <Lock size={16} color="#dc2626" />
          </div>
          <div className="kpi-card-value" style={{ color: '#dc2626' }}>
            {kpis.pending_access_requests || 0}
          </div>
          <div className="kpi-card-subtext">Pending role privilege reviews</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Server Health</span>
            <Activity size={16} color="#16a34a" />
          </div>
          <div className="kpi-card-value" style={{ color: '#16a34a', fontSize: '18px' }}>
            {system_health.server_status || 'ONLINE'}
          </div>
          <div className="kpi-card-subtext">Latency: {system_health.api_latency_ms || 4.2}ms | PHP {system_health.php_version}</div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--table-border)', paddingBottom: '8px' }}>
        <button 
          className={`dash-btn-outline ${activeTab === 'users' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Accounts & RBAC ({users.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'audits' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('audits')}
        >
          Audit Logs ({audit_logs.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'access' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('access')}
        >
          Access Requests ({access_requests.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'upgrades' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('upgrades')}
        >
          Upgrade Pipeline ({system_upgrades.length})
        </button>
      </div>

      {/* Tab 1: Users */}
      {activeTab === 'users' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Users size={16} color="#2563eb" />
              <span>Registered Accounts & Role Entitlements</span>
            </div>
            <span className="panel-badge">{users.length} Total Users</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Official ID</th>
                  <th>Name & Contact</th>
                  <th>Structure</th>
                  <th>Primary Role</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><code>{u.official_id}</code></td>
                    <td>
                      <strong>{u.name}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{u.email} | {u.phone}</div>
                    </td>
                    <td>{u.structure_type}</td>
                    <td>
                      <span className="role-badge-pill role-badge-member">
                        {u.primary_role}
                      </span>
                    </td>
                    <td>Level {u.grade_level || 1}</td>
                    <td>
                      <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '11px' }}>
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Audits */}
      {activeTab === 'audits' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Shield size={16} color="#16a34a" />
              <span>Real-Time Security Audit Trail</span>
            </div>
            <span className="panel-badge">{audit_logs.length} Logged Events</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>IP Address</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {audit_logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ color: '#64748b' }}>{new Date(log.created_at).toLocaleString()}</td>
                    <td><strong>{log.user?.name || 'System Admin'}</strong></td>
                    <td><code>{log.action}</code></td>
                    <td style={{ color: '#64748b' }}>{log.ip_address}</td>
                    <td>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Access Requests */}
      {activeTab === 'access' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Lock size={16} color="#dc2626" />
              <span>Role Escalation & Permission Requests</span>
            </div>
            <span className="panel-badge">{access_requests.length} Requests</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Requester</th>
                  <th>Requested Role</th>
                  <th>Justification</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {access_requests.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.user?.name || 'Staff Member'}</strong></td>
                    <td><span className="role-badge-pill role-badge-gen">{r.requested_role}</span></td>
                    <td style={{ fontSize: '12px', color: '#475569' }}>{r.justification}</td>
                    <td>
                      <span className="role-badge-pill role-badge-member">{r.status.toUpperCase()}</span>
                    </td>
                    <td>
                      {r.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            className="dash-btn-success" 
                            style={{ padding: '3px 8px', fontSize: '11px' }}
                            onClick={() => handleReviewAccess(r.id, 'approved')}
                          >
                            Approve
                          </button>
                          <button 
                            className="dash-btn-outline" 
                            style={{ padding: '3px 8px', fontSize: '11px', color: '#dc2626' }}
                            onClick={() => handleReviewAccess(r.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: System Upgrades */}
      {activeTab === 'upgrades' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Server size={16} color="#9333ea" />
              <span>System Upgrade Pipeline (Study &rarr; CEO Approval &rarr; Deploy)</span>
            </div>
            <button className="dash-btn-primary" onClick={() => setShowUpgradeModal(true)} style={{ fontSize: '11px' }}>
              + Propose Upgrade
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {system_upgrades.map((u) => (
              <div key={u.id} style={{ border: '1px solid var(--table-border)', borderRadius: '8px', padding: '14px', background: 'var(--bg-app)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '800', fontSize: '14px' }}>{u.title} (v{u.version})</span>
                  <span className="role-badge-pill role-badge-gen">{u.status.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#334155' }}>
                  <strong>Study Notes:</strong> {u.study_notes}
                </div>
                {u.impact_assessment && (
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    <strong>Impact Assessment:</strong> {u.impact_assessment}
                  </div>
                )}
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
                  Submitted by: {u.submitted_by?.name || 'SysAdmin'} | Submitted at: {new Date(u.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Propose Upgrade */}
      {showUpgradeModal && (
        <div className="dash-modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="dash-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Propose System Upgrade to CEO</h3>
            <form onSubmit={handleSubmitUpgrade} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="dash-form-group">
                <label>Upgrade Title</label>
                <input 
                  type="text" 
                  className="dash-input" 
                  required
                  value={upgradeForm.title}
                  onChange={(e) => setUpgradeForm({ ...upgradeForm, title: e.target.value })}
                  placeholder="e.g. Offline Daily Activity Diary Sync Engine"
                />
              </div>

              <div className="dash-form-group">
                <label>Target Version</label>
                <input 
                  type="text" 
                  className="dash-input" 
                  required
                  value={upgradeForm.version}
                  onChange={(e) => setUpgradeForm({ ...upgradeForm, version: e.target.value })}
                  placeholder="2.4.0"
                />
              </div>

              <div className="dash-form-group">
                <label>Technical Study Notes</label>
                <textarea 
                  className="dash-input" 
                  rows={3}
                  required
                  value={upgradeForm.study_notes}
                  onChange={(e) => setUpgradeForm({ ...upgradeForm, study_notes: e.target.value })}
                  placeholder="Describe technical architecture, feasibility study..."
                />
              </div>

              <div className="dash-form-group">
                <label>Impact Assessment & Downtime</label>
                <input 
                  type="text" 
                  className="dash-input" 
                  value={upgradeForm.impact_assessment}
                  onChange={(e) => setUpgradeForm({ ...upgradeForm, impact_assessment: e.target.value })}
                  placeholder="e.g. Zero downtime, enhances field agent productivity by 35%"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="dash-btn-outline" onClick={() => setShowUpgradeModal(false)}>Cancel</button>
                <button type="submit" className="dash-btn-primary">Submit to CEO</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
