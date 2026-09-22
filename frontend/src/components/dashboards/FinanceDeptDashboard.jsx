import React, { useState } from 'react';
import { 
  CreditCard, CheckCircle, Clock, AlertCircle, DollarSign, 
  FileCheck, Shield, Users, RefreshCw, Send, ArrowUpRight 
} from 'lucide-react';
import { disburseCertificate } from '../../services/api';

export const FinanceDeptDashboard = ({ data, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('disbursements'); // 'disbursements', 'certificates', 'payroll', 'tax'

  if (!data) return <div className="p-4">Loading Finance & Commission Settlement Center...</div>;

  const { kpis = {}, certificates = [], disbursements = [], admin_payroll = [], tax_deduction_ledger = [] } = data || {};

  const handleDisburse = async (certId) => {
    if (!confirm(`Confirm full commission payout disbursement for Payment Certificate #${certId}?`)) return;
    try {
      await disburseCertificate(certId);
      alert("Commissions marked as disbursed! (Article 22)");
      onRefresh();
    } catch (err) {
      alert("Disbursement error: " + err.message);
    }
  };

  return (
    <div className="role-dashboard-wrapper">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CreditCard size={24} color="#16a34a" />
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Finance & Commission Settlement Center</h2>
          <span className="role-badge-pill role-badge-finance">Article 22 Compliance Engine</span>
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
            <span>Gross Commissions</span>
            <DollarSign size={16} color="#2563eb" />
          </div>
          <div className="kpi-card-value">ETB {(kpis.total_gross_commissions || 0).toLocaleString()}</div>
          <div className="kpi-card-subtext">Accrued across all verified deals</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>2% Withholding Tax</span>
            <Shield size={16} color="#d97706" />
          </div>
          <div className="kpi-card-value" style={{ color: '#d97706' }}>
            ETB {(kpis.total_tax_withheld_2pct || 0).toLocaleString()}
          </div>
          <div className="kpi-card-subtext">Statutory deduction for MoR transfer</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Total Net Disbursed</span>
            <CheckCircle size={16} color="#16a34a" />
          </div>
          <div className="kpi-card-value" style={{ color: '#16a34a' }}>
            ETB {(kpis.total_net_disbursed || 0).toLocaleString()}
          </div>
          <div className="kpi-card-subtext">Paid into sales agents&apos; bank accounts</div>
        </div>

        <div className="kpi-stat-card">
          <div className="kpi-card-header">
            <span>Pending Payout Queue</span>
            <Clock size={16} color="#dc2626" />
          </div>
          <div className="kpi-card-value" style={{ color: '#dc2626' }}>
            ETB {(kpis.pending_payout_queue || 0).toLocaleString()}
          </div>
          <div className="kpi-card-subtext">{kpis.unapproved_certificates_count || 0} Certs awaiting CEO sign-off</div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--table-border)', paddingBottom: '8px' }}>
        <button 
          className={`dash-btn-outline ${activeTab === 'disbursements' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('disbursements')}
        >
          Commission Disbursements (Article 22 Tiers)
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'certificates' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          Payment Certificates ({certificates.length})
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'payroll' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('payroll')}
        >
          Administrative Payroll Ledger (Art. 22.1 & 22.2)
        </button>
        <button 
          className={`dash-btn-outline ${activeTab === 'tax' ? 'dash-btn-primary' : ''}`}
          onClick={() => setActiveTab('tax')}
        >
          Tax Withholding Ledger (2%)
        </button>
      </div>

      {/* Tab 1: Commission Disbursements Breakdown */}
      {activeTab === 'disbursements' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <DollarSign size={16} color="#16a34a" />
              <span>Article 22 Tiered Commission Ledger (Direct 1.5%, TL 0.25%, BM 0.15%, GH 0.10%)</span>
            </div>
            <span className="panel-badge">{disbursements.length} Beneficiary Payouts</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Beneficiary Name</th>
                  <th>Tier & Role</th>
                  <th>Rate (%)</th>
                  <th>Net Payable</th>
                  <th>2% Tax Withheld</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {disbursements.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <strong>{d.beneficiary?.name || 'Beneficiary'}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{d.beneficiary?.official_id}</div>
                    </td>
                    <td>
                      <span className="role-badge-pill role-badge-member">
                        {d.beneficiary_role}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', color: '#2563eb' }}>{d.split_percentage}%</td>
                    <td style={{ fontWeight: '800', color: '#16a34a' }}>
                      ETB {parseFloat(d.net_amount).toLocaleString()}
                    </td>
                    <td style={{ color: '#d97706' }}>
                      ETB {parseFloat(d.tax_amount).toLocaleString()}
                    </td>
                    <td>
                      {d.is_paid ? (
                        <span style={{ color: '#16a34a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={12} /> Disbursed
                        </span>
                      ) : (
                        <span style={{ color: '#dc2626', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> Pending CEO Sign
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Payment Certificates */}
      {activeTab === 'certificates' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <FileCheck size={16} color="#2563eb" />
              <span>Payment Certificates Prepared by Finance (Article 14.2)</span>
            </div>
            <span className="panel-badge">{certificates.length} Total</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Cert #</th>
                  <th>Deal Code</th>
                  <th>Gross Commission</th>
                  <th>2% Tax</th>
                  <th>Net Disbursed</th>
                  <th>CEO Sign Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((c) => (
                  <tr key={c.id}>
                    <td><code>{c.certificate_no}</code></td>
                    <td><strong>{c.deal?.deal_code || 'N/A'}</strong></td>
                    <td>ETB {parseFloat(c.gross_amount).toLocaleString()}</td>
                    <td>ETB {parseFloat(c.tax_withheld).toLocaleString()}</td>
                    <td style={{ fontWeight: '700', color: '#16a34a' }}>
                      ETB {parseFloat(c.net_disbursed).toLocaleString()}
                    </td>
                    <td>
                      {c.ceo_approved ? (
                        <span style={{ color: '#16a34a', fontWeight: '700' }}>Approved by CEO</span>
                      ) : (
                        <span style={{ color: '#dc2626', fontWeight: '700' }}>Pending Approval</span>
                      )}
                    </td>
                    <td>
                      {c.ceo_approved && c.payment_status !== 'disbursed' && (
                        <button 
                          className="dash-btn-success" 
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => handleDisburse(c.id)}
                        >
                          Mark Disbursed
                        </button>
                      )}
                      {c.payment_status === 'disbursed' && (
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700' }}>Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Admin Payroll Ledger */}
      {activeTab === 'payroll' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Users size={16} color="#9333ea" />
              <span>Administrative Structure Monthly Payroll (Article 22.1 vs 22.2)</span>
            </div>
            <span className="panel-badge">Article 22 Strict Rule</span>
          </div>

          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '10px 14px', borderRadius: '6px', fontSize: '12.5px', color: '#991b1b', marginBottom: '10px' }}>
            <strong>Article 22.1:</strong> Administrative structure employees work on regular salary. <br />
            <strong>Article 22.2:</strong> Sales department employees work exclusively on commission and shall have <em>no salary whatsoever</em>.
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>ID</th>
                  <th>Department / Structure</th>
                  <th>Monthly Salary</th>
                  <th>Entitlement</th>
                </tr>
              </thead>
              <tbody>
                {admin_payroll.map((emp) => (
                  <tr key={emp.id}>
                    <td><strong>{emp.name}</strong></td>
                    <td><code>{emp.official_id}</code></td>
                    <td>{emp.department}</td>
                    <td style={{ fontWeight: '700' }}>ETB {emp.base_salary_etb.toLocaleString()}</td>
                    <td>
                      <span className="role-badge-pill role-badge-finance">Regular Salary (Art. 22.1)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: 2% Tax Withholding Ledger */}
      {activeTab === 'tax' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Shield size={16} color="#d97706" />
              <span>Statutory 2% Withholding Tax Schedule (Ethiopian Tax Proclamation)</span>
            </div>
            <span className="panel-badge">Ministry of Revenue (MoR) Transfer Schedule</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Beneficiary</th>
                  <th>Tier</th>
                  <th>Gross Commission</th>
                  <th>2% Withheld</th>
                  <th>Net Paid Out</th>
                  <th>Deal Ref</th>
                </tr>
              </thead>
              <tbody>
                {tax_deduction_ledger.map((t) => (
                  <tr key={t.id}>
                    <td><strong>{t.beneficiary_name}</strong></td>
                    <td>{t.role_tier}</td>
                    <td>ETB {t.gross_amount.toLocaleString()}</td>
                    <td style={{ fontWeight: '800', color: '#d97706' }}>ETB {t.tax_2pct.toLocaleString()}</td>
                    <td style={{ fontWeight: '700', color: '#16a34a' }}>ETB {t.net_payable.toLocaleString()}</td>
                    <td><code>{t.deal_ref}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
