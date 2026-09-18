import React, { useState } from 'react';
import { 
  Database, FileText, CheckCircle2, AlertCircle, ShieldAlert, 
  Upload, HardDrive, Share2, Search, ExternalLink, RefreshCw 
} from 'lucide-react';

export const InformationDeptDashboard = ({ data, onRefresh }) => {
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  if (!data) return <div className="p-4">Loading Information Department Data Center...</div>;

  const { kpis, properties = [], contracts = [], incoming_feed = [], access_requests = [], security_alerts = [], backup_schedule = {} } = data;

  const filteredProperties = properties.filter((p) => {
    if (filterType !== 'ALL' && p.property_type !== filterType.toLowerCase()) return false;
    if (searchTerm && !p.title.toLowerCase().includes(searchTerm.toLowerCase()) && !p.property_code.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="role-dashboard-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={24} color="#0284c7" />
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Information Department Data Center</h2>
          <span className="role-badge-pill role-badge-info">Confidentiality & Inventory Keeper</span>
        </div>
        <div className="quick-action-bar">
          <button className="dash-btn-primary" onClick={() => alert("Property Intake form: properties ingested from Gen Heads are verified and published here (Articles 13.2, 16.6)")}>
            <Upload size={14} /> Verify & Publish Listing
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
            <span>Property Catalog</span>
            <FileText size={16} color="#0284c7" />
          </div>
          <div className="kpi-card-value">{kpis.total_properties || 0}</div>
          <div className="kpi-card-subtext">{kpis.published_properties || 0} Published & Verified (Art. 13.2)</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Active Contracts</span>
            <Database size={16} color="#16a34a" />
          </div>
          <div className="kpi-card-value">{kpis.active_contracts || 0}</div>
          <div className="kpi-card-subtext">Developer Partnership Agreements</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Incoming Data Feed</span>
            <Share2 size={16} color="#d97706" />
          </div>
          <div className="kpi-card-value">{kpis.pending_data_submissions || 0}</div>
          <div className="kpi-card-subtext">Recent Field Activity Diaries</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>System Backup Status</span>
            <HardDrive size={16} color="#9333ea" />
          </div>
          <div className="kpi-card-value" style={{ fontSize: '16px', color: '#16a34a' }}>HEALTHY</div>
          <div className="kpi-card-subtext">{backup_schedule.storage_usage || '24.2 MB encrypted'}</div>
        </div>
      </div>

      {/* Main Two Columns */}
      <div className="dashboard-two-col">
        {/* 1. Property Catalog Manager */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <FileText size={16} color="#0284c7" />
              <span>Property Catalog & Verification Registry (Article 13.2)</span>
            </div>
            <span className="panel-badge">{filteredProperties.length} Records</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Search by code or title..." 
              className="dash-input" 
              style={{ flex: 1, minWidth: '180px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="dash-input"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="VILLA">Villa</option>
              <option value="APARTMENT">Apartment</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title & Location</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((p) => (
                  <tr key={p.id}>
                    <td><code>{p.property_code}</code></td>
                    <td>
                      <strong>{p.title}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{p.subcity}, {p.specific_area}</div>
                    </td>
                    <td style={{ fontWeight: '700' }}>ETB {parseFloat(p.price).toLocaleString()}</td>
                    <td>
                      <span className="role-badge-pill role-badge-finance" style={{ fontSize: '10.5px' }}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Security & Incoming Data Feeds */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Incoming Field Diaries */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Share2 size={16} color="#2563eb" />
                <span>Incoming Field Data Feed (Article 13.1)</span>
              </div>
              <span className="panel-badge">Live Stream</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {incoming_feed.map((d) => (
                <div key={d.id} style={{ background: 'var(--bg-app)', padding: '10px 12px', borderRadius: '6px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                    <span>{d.member?.name || 'Field Agent'} ({d.team?.name || 'Team'})</span>
                    <span style={{ color: '#64748b', fontSize: '11px' }}>{d.report_date}</span>
                  </div>
                  <div style={{ color: '#475569', marginTop: '4px' }}>
                    {d.activity_summary}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Access Requests */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div className="panel-title">
                <ShieldAlert size={16} color="#dc2626" />
                <span>Security & Confidentiality Alerts (Article 13.3)</span>
              </div>
              <span className="panel-badge" style={{ color: '#dc2626' }}>Strictly Enforced</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              {security_alerts.slice(0, 4).map((a) => (
                <div key={a.id} style={{ borderLeft: '3px solid #0284c7', background: 'var(--bg-app)', padding: '8px 10px', borderRadius: '4px' }}>
                  <strong>{a.action}</strong>: {a.details}
                  <div style={{ color: '#64748b', fontSize: '10.5px', marginTop: '2px' }}>
                    User: {a.user?.name || 'System'} | IP: {a.ip_address} | {new Date(a.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
