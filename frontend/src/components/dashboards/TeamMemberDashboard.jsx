import React, { useState } from 'react';
import { 
  Award, TrendingUp, Users, FileText, CheckCircle2, 
  Search, Building, Plus, RefreshCw, Send, DollarSign 
} from 'lucide-react';
import { submitDiary } from '../../services/api';

export const TeamMemberDashboard = ({ data, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('diaries'); // 'diaries', 'deals', 'customers', 'catalog'
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [diaryForm, setDiaryForm] = useState({
    calls_made: 10,
    customers_registered: 1,
    field_visits_conducted: 1,
    activity_summary: '',
    challenges_encountered: '',
  });

  if (!data) return <div className="p-4">Loading Direct Sales Agent Workplace...</div>;

  const { kpis = {}, user = {}, my_deals = [], my_disbursements = [], my_diaries = [], my_customers = [], property_catalog = [] } = data || {};

  const handlePostDiary = async (e) => {
    e.preventDefault();
    try {
      await submitDiary({
        member_id: user?.id || 8,
        team_id: user?.team_id || 1,
        report_date: new Date().toISOString().split('T')[0],
        ...diaryForm,
      });
      alert("Daily Activity Diary submitted for Team Leader verification (Article 8.4)!");
      setShowDiaryModal(false);
      setDiaryForm({ calls_made: 10, customers_registered: 1, field_visits_conducted: 1, activity_summary: '', challenges_encountered: '' });
      onRefresh();
    } catch (err) {
      alert("Diary submission error: " + err.message);
    }
  };

  return (
    <div className="role-dashboard-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={24} color="#2563eb" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Direct Sales Agent Workplace</h2>
              <span className="role-badge-pill role-badge-member">Article 22 Commission Earner (1.5%)</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Logged as: {user?.name || 'Sales Agent'} ({user?.official_id || 'BH-AGT-001'})
            </div>
          </div>
        </div>
        <div className="quick-action-bar">
          <button className="dash-btn-primary" onClick={() => setShowDiaryModal(true)}>
            <Plus size={14} /> Submit Daily Diary
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
            <span>My Earned Net Commission</span>
            <DollarSign size={16} color="#16a34a" />
          </div>
          <div className="kpi-card-value" style={{ color: '#16a34a' }}>
            ETB {(kpis.my_earned_net_commission || 0).toLocaleString()}
          </div>
          <div className="kpi-card-subtext">Net after statutory 2% tax withholding</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>My Closed Deals</span>
            <TrendingUp size={16} color="#2563eb" />
          </div>
          <div className="kpi-card-value">{kpis.my_deals_count || 0} Deals</div>
          <div className="kpi-card-subtext">ETB {(kpis.my_sales_volume || 0).toLocaleString()} Gross Value</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>My Active Customers</span>
            <Users size={16} color="#d97706" />
          </div>
          <div className="kpi-card-value">{kpis.my_active_customers || 0}</div>
          <div className="kpi-card-subtext">Registered client relationships</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Diaries Submitted</span>
            <FileText size={16} color="#9333ea" />
          </div>
          <div className="kpi-card-value">{kpis.my_diaries_submitted || 0}</div>
          <div className="kpi-card-subtext">Daily track records filed</div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--table-border)', paddingBottom: '8px' }}>
        <button 
          className={`dash-btn-outline ${activeTab === 'diaries' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('diaries')}
        >
          My Daily Activity Diaries ({my_diaries.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'deals' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('deals')}
        >
          My Closed Deals & Commission Payouts ({my_deals.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'customers' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          My Customers ({my_customers.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'catalog' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          Available Properties ({property_catalog.length})
        </button>
      </div>

      {/* Tab 1: My Diaries */}
      {activeTab === 'diaries' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <FileText size={16} color="#2563eb" />
              <span>Daily Activity Diaries (Article 8.4 & 19.2)</span>
            </div>
            <button className="dash-btn-primary" onClick={() => setShowDiaryModal(true)} style={{ fontSize: '11px' }}>
              + Record Today&apos;s Diary
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {my_diaries.map((d) => (
              <div key={d.id} style={{ border: '1px solid var(--table-border)', borderRadius: '8px', padding: '12px', background: 'var(--bg-app)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '13px' }}>
                  <span>Report Date: {d.report_date}</span>
                  <span style={{ color: d.status === 'reviewed' ? '#16a34a' : '#d97706', fontSize: '11px', textTransform: 'uppercase' }}>
                    {d.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: '#475569', margin: '6px 0' }}>
                  <span>Calls: <strong>{d.calls_made || 0}</strong></span>
                  <span>Registrations: <strong>{d.customers_registered || 0}</strong></span>
                  <span>Field Visits: <strong>{d.field_visits_conducted || 0}</strong></span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#1e293b' }}>
                  {d.activity_summary}
                </div>
                {d.leader_notes && (
                  <div style={{ marginTop: '8px', background: '#dcfce7', padding: '6px 10px', borderRadius: '4px', fontSize: '11.5px', color: '#16a34a' }}>
                    <strong>Leader Feedback:</strong> {d.leader_notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Deals & Commissions */}
      {activeTab === 'deals' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <TrendingUp size={16} color="#16a34a" />
              <span>My Closed Transactions & Commission Breakdown</span>
            </div>
            <span className="panel-badge">{my_deals.length} Deals</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Deal Code</th>
                  <th>Property</th>
                  <th>Customer</th>
                  <th>Sale Price</th>
                  <th>Commission Status</th>
                </tr>
              </thead>
              <tbody>
                {my_deals.map((deal) => (
                  <tr key={deal.id}>
                    <td><code>{deal.deal_code}</code></td>
                    <td><strong>{deal.property?.title || 'Property'}</strong></td>
                    <td>{deal.customer?.full_name || 'Buyer'}</td>
                    <td style={{ fontWeight: '700' }}>ETB {parseFloat(deal.sale_price).toLocaleString()}</td>
                    <td>
                      <span className="role-badge-pill role-badge-finance">
                        {deal.deal_status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Customers */}
      {activeTab === 'customers' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Users size={16} color="#0284c7" />
              <span>My Registered Clients (Article 8.3 & 19.1)</span>
            </div>
            <span className="panel-badge">{my_customers.length} Clients</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Preference</th>
                  <th>Budget</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>
                {my_customers.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.full_name}</strong></td>
                    <td>{c.phone}</td>
                    <td>{c.preferred_property_type}</td>
                    <td>ETB {parseFloat(c.budget_min || 0).toLocaleString()}</td>
                    <td><span className="role-badge-pill role-badge-gen">{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Available Properties */}
      {activeTab === 'catalog' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Building size={16} color="#d97706" />
              <span>Verified Properties Available for Pitching</span>
            </div>
            <span className="panel-badge">{property_catalog.length} Available</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
            {property_catalog.map((p) => (
              <div key={p.id} style={{ border: '1px solid var(--table-border)', borderRadius: '8px', padding: '14px', background: 'var(--bg-app)' }}>
                <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '4px' }}>{p.title}</div>
                <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '8px' }}>{p.subcity}, {p.specific_area}</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#2563eb', marginBottom: '6px' }}>
                  ETB {parseFloat(p.price).toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700' }}>
                  Article 22 Commission: 1.5% (ETB {(parseFloat(p.price) * 0.015).toLocaleString()})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Submit Daily Activity Diary */}
      {showDiaryModal && (
        <div className="dash-modal-overlay" onClick={() => setShowDiaryModal(false)}>
          <div className="dash-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Submit Daily Activity Diary</h3>
            <form onSubmit={handlePostDiary} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div className="dash-form-group">
                  <label>Calls Made</label>
                  <input 
                    type="number" 
                    className="dash-input" 
                    value={diaryForm.calls_made} 
                    onChange={(e) => setDiaryForm({ ...diaryForm, calls_made: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="dash-form-group">
                  <label>New Clients</label>
                  <input 
                    type="number" 
                    className="dash-input" 
                    value={diaryForm.customers_registered} 
                    onChange={(e) => setDiaryForm({ ...diaryForm, customers_registered: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="dash-form-group">
                  <label>Site Visits</label>
                  <input 
                    type="number" 
                    className="dash-input" 
                    value={diaryForm.field_visits_conducted} 
                    onChange={(e) => setDiaryForm({ ...diaryForm, field_visits_conducted: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="dash-form-group">
                <label>Daily Activity Summary (Article 19.2)</label>
                <textarea 
                  className="dash-input" 
                  rows={3} 
                  required
                  placeholder="Conducted site visit with diaspora buyer to Ayat Villa..."
                  value={diaryForm.activity_summary} 
                  onChange={(e) => setDiaryForm({ ...diaryForm, activity_summary: e.target.value })}
                />
              </div>

              <div className="dash-form-group">
                <label>Challenges / Customer Objections Encountered</label>
                <textarea 
                  className="dash-input" 
                  rows={2} 
                  placeholder="Buyer inquired about bank financing options..."
                  value={diaryForm.challenges_encountered} 
                  onChange={(e) => setDiaryForm({ ...diaryForm, challenges_encountered: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="dash-btn-outline" onClick={() => setShowDiaryModal(false)}>Cancel</button>
                <button type="submit" className="dash-btn-primary">Submit to Team Leader</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
