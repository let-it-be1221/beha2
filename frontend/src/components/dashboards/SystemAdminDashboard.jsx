import React, { useState } from 'react';
import { 
  Server, Shield, Users, HardDrive, Activity, CheckCircle, 
  XCircle, AlertCircle, Plus, RefreshCw, Send, Lock, 
  Trash2, Ban, UserCheck, KeyRound, Eye, ShieldAlert
} from 'lucide-react';
import { 
  triggerBackup, 
  reviewAccessRequest, 
  submitSystemUpgrade,
  toggleUserBan,
  deleteUser,
  addNewUser,
  deleteAccessRequest,
  resetStaffPin
} from '../../services/api';

export const SystemAdminDashboard = ({ data, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'audits', 'access', 'upgrades'
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(null); // target user for PIN reset
  const [newPinValue, setNewPinValue] = useState('1234');
  
  const [userForm, setUserForm] = useState({
    name: '',
    official_id: 'BH-AGT-' + Math.floor(100 + Math.random() * 900),
    email: '',
    phone: '+251911' + Math.floor(100000 + Math.random() * 900000),
    structure_type: 'SALES',
    admin_department: '',
    primary_role: 'TEAM_MEMBER',
    grade_level: 1,
    pin: '1234',
    password: 'password'
  });

  const [upgradeForm, setUpgradeForm] = useState({
    title: '',
    version: '',
    study_notes: '',
    impact_assessment: '',
  });

  const [submitting, setSubmitting] = useState(false);

  if (!data) return <div className="p-4">Loading System Administration &amp; Security Control...</div>;

  const { kpis = {}, users = [], audit_logs = [], access_requests = [], system_upgrades = [], system_health = {} } = data || {};

  // 1. Add User Handler
  const handleAddUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addNewUser(userForm);
      alert(`User ${userForm.name} (${userForm.official_id}) registered successfully into Beha system!`);
      setShowAddUserModal(false);
      setUserForm({
        name: '',
        official_id: 'BH-AGT-' + Math.floor(100 + Math.random() * 900),
        email: '',
        phone: '+251911' + Math.floor(100000 + Math.random() * 900000),
        structure_type: 'SALES',
        admin_department: '',
        primary_role: 'TEAM_MEMBER',
        grade_level: 1,
        pin: '1234',
        password: 'password'
      });
      onRefresh();
    } catch (err) {
      alert("Error adding user: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Ban / Unban User Handler
  const handleToggleBan = async (user) => {
    const isBanned = user.status === 'banned' || user.status === 'suspended';
    const actionText = isBanned ? 'reactivate & unban' : 'ban & suspend';
    if (!confirm(`Are you sure you want to ${actionText} user ${user.name} (${user.official_id})?`)) return;
    
    try {
      await toggleUserBan(user.id);
      alert(`User ${user.name} has been ${isBanned ? 'reactivated' : 'banned'} successfully.`);
      onRefresh();
    } catch (err) {
      alert("Error updating user status: " + err.message);
    }
  };

  // 3. Delete User Handler
  const handleDeleteUser = async (user) => {
    if (!confirm(`CAUTION: Are you sure you want to permanently DELETE user ${user.name} (${user.official_id})? This cannot be undone.`)) return;
    
    try {
      await deleteUser(user.id);
      alert(`User ${user.name} deleted successfully.`);
      onRefresh();
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  // 4. Reset PIN Handler
  const handleResetPin = async (e) => {
    e.preventDefault();
    if (!showPinModal) return;
    try {
      await resetStaffPin(showPinModal.id, newPinValue);
      alert(`PIN successfully reset to ${newPinValue} for ${showPinModal.name}`);
      setShowPinModal(null);
      setNewPinValue('1234');
      onRefresh();
    } catch (err) {
      alert("Error resetting PIN: " + err.message);
    }
  };

  // 5. Review Access Request (Approve / Reject)
  const handleReviewAccess = async (requestId, status) => {
    const notes = prompt(`Enter review notes for ${status} decision:`) || (status === 'approved' ? 'Approved by System Admin' : 'Rejected per policy');
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

  // 6. Delete / Remove Access Request
  const handleDeleteAccessRequest = async (requestId) => {
    if (!confirm("Are you sure you want to remove/dismiss this access request?")) return;
    try {
      await deleteAccessRequest(requestId);
      alert("Access request removed successfully.");
      onRefresh();
    } catch (err) {
      alert("Error removing access request: " + err.message);
    }
  };

  // 7. Backup Trigger
  const handleBackup = async () => {
    try {
      const res = await triggerBackup();
      alert(`Success! Database snapshot generated:\n${res.filename}\nTimestamp: ${res.timestamp}`);
      onRefresh();
    } catch (err) {
      alert("Backup error: " + err.message);
    }
  };

  // 8. Submit Upgrade
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
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>System Administration &amp; Security Control</h2>
          <span className="role-badge-pill role-badge-admin">Infrastructure &amp; RBAC Custodian</span>
        </div>
        <div className="quick-action-bar">
          <button className="dash-btn-primary" onClick={() => setShowAddUserModal(true)}>
            <Plus size={14} /> Add New User
          </button>
          <button className="dash-btn-outline" onClick={() => setShowUpgradeModal(true)}>
            <Server size={14} /> Propose Upgrade
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
          <div className="kpi-card-value">{users.length}</div>
          <div className="kpi-card-subtext">Registered across 8 hierarchy roles</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Security Audits</span>
            <Shield size={16} color="#16a34a" />
          </div>
          <div className="kpi-card-value">{audit_logs.length}</div>
          <div className="kpi-card-subtext">Tracked system operations &amp; logins</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Access Requests</span>
            <Lock size={16} color="#dc2626" />
          </div>
          <div className="kpi-card-value" style={{ color: '#dc2626' }}>
            {access_requests.filter(r => r.status === 'pending').length}
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
          <div className="kpi-card-subtext">Latency: {system_health.api_latency_ms || 4.2}ms | PHP {system_health.php_version || '8.2'}</div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--table-border)', paddingBottom: '8px', flexWrap: 'wrap' }}>
        <button 
          className={`dash-btn-outline ${activeTab === 'users' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Accounts &amp; RBAC ({users.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'access' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('access')}
        >
          Access Requests ({access_requests.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'audits' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('audits')}
        >
          Audit Logs ({audit_logs.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'upgrades' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('upgrades')}
        >
          Upgrade Pipeline ({system_upgrades.length})
        </button>
      </div>

      {/* Tab 1: Users Management (Add, Ban, Delete, Reset PIN) */}
      {activeTab === 'users' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Users size={16} color="#2563eb" />
              <span>Registered Accounts, RBAC Roles &amp; Administrative Actions</span>
            </div>
            <button className="dash-btn-primary" onClick={() => setShowAddUserModal(true)} style={{ fontSize: '11.5px', padding: '4px 10px' }}>
              <Plus size={13} /> Add New User
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Official ID</th>
                  <th>Name &amp; Contact</th>
                  <th>Structure</th>
                  <th>Primary Role</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isBanned = u.status === 'banned' || u.status === 'suspended';
                  return (
                    <tr key={u.id} style={{ background: isBanned ? 'rgba(239, 68, 68, 0.05)' : 'inherit' }}>
                      <td><code style={{ fontWeight: '700', color: '#2563eb' }}>{u.official_id}</code></td>
                      <td>
                        <strong>{u.name}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{u.email} &bull; {u.phone}</div>
                      </td>
                      <td>{u.structure_type}</td>
                      <td>
                        <span className="role-badge-pill role-badge-member">
                          {u.primary_role}
                        </span>
                      </td>
                      <td>Level {u.grade_level || 1}</td>
                      <td>
                        {isBanned ? (
                          <span style={{ color: '#dc2626', fontWeight: '800', fontSize: '11px', background: '#fee2e2', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fca5a5' }}>
                            BANNED / SUSPENDED
                          </span>
                        ) : (
                          <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '11px', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          {/* Ban / Reactivate Button */}
                          <button 
                            className={isBanned ? "dash-btn-success" : "dash-btn-outline"} 
                            style={{ padding: '3px 8px', fontSize: '11px', color: isBanned ? '#16a34a' : '#d97706', borderColor: isBanned ? '#16a34a' : '#f59e0b' }}
                            onClick={() => handleToggleBan(u)}
                            title={isBanned ? "Reactivate and unban this user" : "Ban and suspend this user"}
                          >
                            {isBanned ? <UserCheck size={11} style={{ display: 'inline', marginRight: '3px' }} /> : <Ban size={11} style={{ display: 'inline', marginRight: '3px' }} />}
                            {isBanned ? 'Unban' : 'Ban'}
                          </button>

                          {/* Reset PIN Button */}
                          <button 
                            className="dash-btn-outline" 
                            style={{ padding: '3px 8px', fontSize: '11px', color: '#2563eb' }}
                            onClick={() => setShowPinModal(u)}
                            title="Reset 4-digit PIN (Article 15.2)"
                          >
                            <KeyRound size={11} style={{ display: 'inline', marginRight: '3px' }} /> PIN
                          </button>

                          {/* Delete User Button */}
                          <button 
                            className="dash-btn-outline" 
                            style={{ padding: '3px 8px', fontSize: '11px', color: '#dc2626', borderColor: '#fca5a5' }}
                            onClick={() => handleDeleteUser(u)}
                            title="Permanently delete user account"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Access Requests (Approve, Reject, Remove) */}
      {activeTab === 'access' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Lock size={16} color="#dc2626" />
              <span>Role Escalation &amp; Permission Requests</span>
            </div>
            <span className="panel-badge">{access_requests.length} Total Requests</span>
          </div>

          {access_requests.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: '13px', padding: '16px 0' }}>
              No access or role elevation requests currently pending.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Requester</th>
                    <th>Requested Role</th>
                    <th>Justification</th>
                    <th>Status</th>
                    <th>Review Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {access_requests.map((r) => {
                    const isPending = r.status === 'pending';
                    return (
                      <tr key={r.id}>
                        <td>
                          <strong>{r.user?.name || 'Staff Member'}</strong>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{r.user?.official_id}</div>
                        </td>
                        <td><span className="role-badge-pill role-badge-gen">{r.requested_role}</span></td>
                        <td style={{ fontSize: '12px', color: '#475569' }}>{r.justification}</td>
                        <td>
                          <span className={`role-badge-pill ${r.status === 'approved' ? 'role-badge-finance' : (r.status === 'rejected' ? 'role-badge-ceo' : 'role-badge-member')}`}>
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {isPending && (
                              <>
                                <button 
                                  className="dash-btn-success" 
                                  style={{ padding: '3px 8px', fontSize: '11px' }}
                                  onClick={() => handleReviewAccess(r.id, 'approved')}
                                >
                                  <CheckCircle size={11} style={{ display: 'inline', marginRight: '3px' }} /> Approve
                                </button>
                                <button 
                                  className="dash-btn-outline" 
                                  style={{ padding: '3px 8px', fontSize: '11px', color: '#dc2626', borderColor: '#fca5a5' }}
                                  onClick={() => handleReviewAccess(r.id, 'rejected')}
                                >
                                  <XCircle size={11} style={{ display: 'inline', marginRight: '3px' }} /> Reject
                                </button>
                              </>
                            )}

                            {/* Remove / Delete Request button */}
                            <button 
                              className="dash-btn-outline" 
                              style={{ padding: '3px 8px', fontSize: '11px', color: '#64748b' }}
                              onClick={() => handleDeleteAccessRequest(r.id)}
                              title="Dismiss & Remove this access request record"
                            >
                              <Trash2 size={11} /> Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Audits */}
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

      {/* MODAL 1: ADD NEW USER */}
      {showAddUserModal && (
        <div className="dash-modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="dash-modal-box" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Add &amp; Provision New Staff Member</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 12px 0' }}>
              Register employee per Beha Guidelines with official RBAC credentials, grade level, and assigned structure.
            </p>

            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="dash-form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className="dash-input" 
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    placeholder="e.g. Almaz Tadesse"
                  />
                </div>

                <div className="dash-form-group">
                  <label>Official ID</label>
                  <input 
                    type="text" 
                    className="dash-input" 
                    required
                    value={userForm.official_id}
                    onChange={(e) => setUserForm({ ...userForm, official_id: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="dash-form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="dash-input" 
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="almaz@beha.et"
                  />
                </div>

                <div className="dash-form-group">
                  <label>Phone Number</label>
                  <input 
                    type="text" 
                    className="dash-input" 
                    required
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="dash-form-group">
                  <label>Organizational Structure</label>
                  <select 
                    className="dash-input"
                    value={userForm.structure_type}
                    onChange={(e) => setUserForm({ ...userForm, structure_type: e.target.value })}
                  >
                    <option value="SALES">Sales Structure (Commission Only - Art. 22.2)</option>
                    <option value="ADMINISTRATIVE">Administrative Structure (Salary - Art. 22.1)</option>
                    <option value="EXECUTIVE">Executive Directorate (CEO)</option>
                  </select>
                </div>

                <div className="dash-form-group">
                  <label>Primary Role</label>
                  <select 
                    className="dash-input"
                    value={userForm.primary_role}
                    onChange={(e) => setUserForm({ ...userForm, primary_role: e.target.value })}
                  >
                    <option value="TEAM_MEMBER">Direct Sales Agent (Level 1 &amp; 2)</option>
                    <option value="TEAM_LEADER">Team Leader (Level 3)</option>
                    <option value="BRANCH_MANAGER">Branch Manager (Level 4)</option>
                    <option value="GENERATION_HEAD">Generation Head (Level 5)</option>
                    <option value="INFORMATION_OFFICER">Information Officer</option>
                    <option value="FINANCE_OFFICER">Finance Officer</option>
                    <option value="SYSTEM_ADMIN">System Administrator</option>
                    <option value="CEO">Chief Executive Officer (CEO)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="dash-form-group">
                  <label>Performance Grade</label>
                  <select 
                    className="dash-input"
                    value={userForm.grade_level}
                    onChange={(e) => setUserForm({ ...userForm, grade_level: parseInt(e.target.value) })}
                  >
                    <option value={1}>Level 1 (Direct Agent)</option>
                    <option value={2}>Level 2 (Senior Agent)</option>
                    <option value={3}>Level 3 (Team Leader)</option>
                    <option value={4}>Level 4 (Branch Manager / Admin)</option>
                    <option value={5}>Level 5 (Generation Head / CEO)</option>
                  </select>
                </div>

                <div className="dash-form-group">
                  <label>Initial PIN</label>
                  <input 
                    type="text" 
                    className="dash-input" 
                    required
                    value={userForm.pin}
                    onChange={(e) => setUserForm({ ...userForm, pin: e.target.value })}
                  />
                </div>

                <div className="dash-form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    className="dash-input" 
                    required
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="dash-btn-outline" onClick={() => setShowAddUserModal(false)}>Cancel</button>
                <button type="submit" className="dash-btn-primary" disabled={submitting}>
                  {submitting ? 'Registering...' : 'Register User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESET PIN */}
      {showPinModal && (
        <div className="dash-modal-overlay" onClick={() => setShowPinModal(null)}>
          <div className="dash-modal-box" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Reset Staff PIN (Article 15.2)</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 12px 0' }}>
              Set a new 4-digit operational access PIN for <strong>{showPinModal.name}</strong> ({showPinModal.official_id}).
            </p>

            <form onSubmit={handleResetPin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="dash-form-group">
                <label>New 4-Digit PIN</label>
                <input 
                  type="text" 
                  className="dash-input" 
                  required
                  maxLength={8}
                  value={newPinValue}
                  onChange={(e) => setNewPinValue(e.target.value)}
                  placeholder="e.g. 1234"
                  style={{ fontSize: '18px', letterSpacing: '4px', textAlign: 'center', fontWeight: '800' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="dash-btn-outline" onClick={() => setShowPinModal(null)}>Cancel</button>
                <button type="submit" className="dash-btn-primary">Update PIN</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PROPOSE UPGRADE */}
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
                <label>Impact Assessment &amp; Downtime</label>
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
