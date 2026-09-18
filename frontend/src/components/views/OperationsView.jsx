import React, { useState, useEffect } from 'react';
import { 
  fetchPaymentCertificates, 
  approvePaymentCertificate, 
  fetchDiaries, 
  submitDiary, 
  fetchTendencyReports,
  calculateCommission,
  createSalesDeal,
  fetchProperties,
  fetchCustomers
} from '../../services/api';
import { 
  ShieldCheck, 
  CheckCircle, 
  FileText, 
  DollarSign, 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  Building, 
  Send, 
  Award, 
  Check, 
  Clock, 
  AlertCircle,
  Calculator,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const OperationsView = ({ t, userSession }) => {
  const [activeTab, setActiveTab] = useState('payments'); // 'payments' | 'calculator' | 'diaries' | 'tendency'
  
  // Payment Certificates state
  const [certificates, setCertificates] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  // Article 22 Commission Calculator State
  const [calcPrice, setCalcPrice] = useState(25000000);
  const [calcAgentId, setCalcAgentId] = useState('6'); // Default to Selamawit (Branch Mgr) for Art 22 example
  const [calcResult, setCalcResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Deal Creation Form State
  const [properties, setProperties] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isCreatingDeal, setIsCreatingDeal] = useState(false);

  // Daily Diaries state
  const [diaries, setDiaries] = useState([]);
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [diaryForm, setDiaryForm] = useState({
    report_date: new Date().toISOString().split('T')[0],
    calls_made: 15,
    customers_registered: 2,
    field_visits_conducted: 1,
    activity_summary: 'Conducted morning phone follow-ups with 15 Ayat property leads. Escorted client to Ayat 3-bedroom unit on 4th floor.',
    challenges_encountered: 'Client requesting 4-stage installment structure.'
  });

  // Tendency Reports state
  const [tendencyReports, setTendencyReports] = useState([]);

  useEffect(() => {
    loadPaymentCertificates();
    loadDiaries();
    loadTendencyReports();
    loadDropdownData();
    triggerCalculation(25000000, 6);
  }, []);

  const loadDropdownData = () => {
    fetchProperties().then((data) => {
      if (Array.isArray(data)) {
        setProperties(data);
        if (data.length > 0) setSelectedPropertyId(data[0].id);
      }
    }).catch(console.error);

    fetchCustomers().then((data) => {
      if (Array.isArray(data)) {
        setCustomers(data);
        if (data.length > 0) setSelectedCustomerId(data[0].id);
      }
    }).catch(console.error);
  };

  const loadPaymentCertificates = () => {
    setLoadingCertificates(true);
    fetchPaymentCertificates()
      .then((data) => {
        if (Array.isArray(data)) setCertificates(data);
      })
      .catch((err) => console.log('Payment certs fallback', err))
      .finally(() => setLoadingCertificates(false));
  };

  const loadDiaries = () => {
    fetchDiaries()
      .then((data) => {
        if (Array.isArray(data)) setDiaries(data);
      })
      .catch((err) => console.log('Diaries fallback', err));
  };

  const loadTendencyReports = () => {
    fetchTendencyReports()
      .then((data) => {
        if (Array.isArray(data)) setTendencyReports(data);
      })
      .catch((err) => console.log('Tendency fallback', err));
  };

  const triggerCalculation = async (price, agentId) => {
    setIsCalculating(true);
    try {
      const res = await calculateCommission(price, agentId);
      setCalcResult(res);
    } catch (err) {
      console.log('Calculation error', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handlePriceChange = (newPrice) => {
    const p = parseFloat(newPrice) || 0;
    setCalcPrice(p);
    triggerCalculation(p, calcAgentId);
  };

  const handleAgentChange = (newAgentId) => {
    setCalcAgentId(newAgentId);
    triggerCalculation(calcPrice, newAgentId);
  };

  const handleApproveCertificate = async (certId) => {
    setApprovingId(certId);
    try {
      await approvePaymentCertificate(certId);
      alert(`✅ Digital Authorization Successful! Payment Certificate #${certId} authorized for CBE bank disbursement by CEO Dawit Gebremariam per Article 12.3.`);
      loadPaymentCertificates();
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setApprovingId(null);
    }
  };

  const handleCreateDeal = async () => {
    if (!selectedPropertyId || !selectedCustomerId) {
      alert('Please select a property and a customer lead.');
      return;
    }

    setIsCreatingDeal(true);
    try {
      await createSalesDeal({
        property_id: selectedPropertyId,
        customer_id: selectedCustomerId,
        agent_id: calcAgentId,
        sale_price: calcPrice,
        bank_reference: `CBE-DEP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      });
      alert(`🎉 Deal Closed! Article 22 Payment Certificate generated and routed to Finance & CEO for disbursement.`);
      loadPaymentCertificates();
      setActiveTab('payments');
    } catch (err) {
      alert(`Deal creation: ${err.message}`);
    } finally {
      setIsCreatingDeal(false);
    }
  };

  const handleDiarySubmit = async (e) => {
    e.preventDefault();
    try {
      await submitDiary(diaryForm);
      alert('🎉 Daily Activity Diary submitted for Team Leader review (Article 8.4).');
      setShowDiaryModal(false);
      loadDiaries();
    } catch (err) {
      alert(`Diary submission: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Header Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 70%, #1e40af 100%)',
        color: 'white',
        padding: '24px',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={28} color="#60a5fa" />
            <span>Operations Guidelines &amp; Approvals (Articles 8–22)</span>
          </div>
          <div style={{ color: '#93c5fd', fontSize: '13px', marginTop: '4px', maxWidth: '650px' }}>
            Salary &amp; Commission Distribution (Article 22), Executive bank authorization (Article 12.3), Finance disbursement (Article 14.2), and Daily Activity Diaries (Article 8.4).
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.12)', 
            padding: '10px 16px', 
            borderRadius: '8px', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Authorized Signatory</div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#fbbf24' }}>
              Dawit Gebremariam (CEO)
            </div>
            <div style={{ fontSize: '10.5px', color: '#93c5fd' }}>Article 12.2 Sole Bank Signatory</div>
          </div>
        </div>
      </div>

      {/* 2. Top Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        background: 'var(--bg-card)', 
        padding: '8px', 
        borderRadius: '10px', 
        border: '1px solid var(--table-border)' 
      }}>
        <button 
          className={`action-btn ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
          style={{ 
            background: activeTab === 'payments' ? '#2563eb' : 'transparent', 
            color: activeTab === 'payments' ? 'white' : 'var(--text-secondary)',
            fontWeight: '700',
            padding: '10px 18px',
            borderRadius: '6px'
          }}
        >
          <DollarSign size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Commission Payment Certificates ({certificates.length})
        </button>

        <button 
          className={`action-btn ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
          style={{ 
            background: activeTab === 'calculator' ? '#2563eb' : 'transparent', 
            color: activeTab === 'calculator' ? 'white' : 'var(--text-secondary)',
            fontWeight: '700',
            padding: '10px 18px',
            borderRadius: '6px'
          }}
        >
          <Calculator size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Article 22 Commission Calculator &amp; Deal Simulator
        </button>

        <button 
          className={`action-btn ${activeTab === 'diaries' ? 'active' : ''}`}
          onClick={() => setActiveTab('diaries')}
          style={{ 
            background: activeTab === 'diaries' ? '#2563eb' : 'transparent', 
            color: activeTab === 'diaries' ? 'white' : 'var(--text-secondary)',
            fontWeight: '700',
            padding: '10px 18px',
            borderRadius: '6px'
          }}
        >
          <Calendar size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Daily Activity Diaries (Art. 8.4)
        </button>

        <button 
          className={`action-btn ${activeTab === 'tendency' ? 'active' : ''}`}
          onClick={() => setActiveTab('tendency')}
          style={{ 
            background: activeTab === 'tendency' ? '#2563eb' : 'transparent', 
            color: activeTab === 'tendency' ? 'white' : 'var(--text-secondary)',
            fontWeight: '700',
            padding: '10px 18px',
            borderRadius: '6px'
          }}
        >
          <TrendingUp size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Branch Tendency Reports (Art. 9.5)
        </button>
      </div>

      {/* 3. TAB 1: Payment Certificates with Article 22 Tier Table */}
      {activeTab === 'payments' && (
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--table-border)', 
          borderRadius: '12px', 
          padding: '24px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                Commercial Bank of Ethiopia (CBE) Commission Certificates
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Calculated per <strong>Article 22: Salary &amp; Commission Distribution</strong> (Direct Seller 1.5%, TL 0.25%, BM 0.15%, GH 0.10%). Authorized by CEO per Article 12.3.
              </p>
            </div>
            <button 
              className="action-btn"
              onClick={() => setActiveTab('calculator')}
              style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700' }}
            >
              <Calculator size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Simulate New Deal Split
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {certificates.map((cert) => {
              const isApproved = cert.ceo_approved || cert.payment_status === 'approved_by_ceo';
              const grossAmt = Number(cert.gross_amount || 0);
              const taxAmt = Number(cert.tax_withheld || 0);
              const netAmt = Number(cert.net_disbursed || 0);
              const salePrice = Number(cert.deal?.sale_price || 0);

              return (
                <div key={cert.id} style={{ 
                  border: '1px solid var(--table-border)', 
                  borderRadius: '10px', 
                  padding: '20px',
                  background: isApproved ? 'rgba(34, 197, 94, 0.03)' : 'var(--bg-app)',
                  borderLeft: `6px solid ${isApproved ? '#22c55e' : '#f59e0b'}`
                }}>
                  {/* Top Summary Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ 
                          fontFamily: 'monospace', 
                          fontWeight: '800', 
                          fontSize: '13px', 
                          background: '#e2e8f0', 
                          padding: '3px 8px', 
                          borderRadius: '4px' 
                        }}>
                          {cert.certificate_no}
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {cert.deal?.property?.title || 'Luxury Property'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        <strong>Property Sale Price:</strong> ETB {salePrice.toLocaleString()} &bull; 
                        <strong> Buyer:</strong> {cert.deal?.customer?.full_name || 'Client'} &bull; 
                        <strong> Closing Seller:</strong> {cert.deal?.agent?.name || 'Agent'} ({cert.deal?.agent?.official_id})
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {isApproved ? (
                        <div style={{ 
                          background: '#dcfce7', 
                          color: '#166534', 
                          padding: '6px 14px', 
                          borderRadius: '6px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          fontWeight: '800',
                          fontSize: '12.5px'
                        }}>
                          <CheckCircle size={16} />
                          Authorized by CEO (Article 12.3)
                        </div>
                      ) : (
                        <button 
                          className="action-btn"
                          disabled={approvingId === cert.id}
                          onClick={() => handleApproveCertificate(cert.id)}
                          style={{ 
                            background: '#2563eb', 
                            color: 'white', 
                            padding: '8px 16px', 
                            borderRadius: '6px', 
                            fontWeight: '800',
                            fontSize: '12.5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <ShieldCheck size={16} />
                          {approvingId === cert.id ? 'Authorizing Payout...' : 'Authorize Bank Payout (CEO Sign-Off)'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Article 22 Tier Breakdown Table */}
                  <div style={{ marginTop: '12px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--table-border)', overflow: 'hidden' }}>
                    <div style={{ padding: '8px 14px', background: 'rgba(37, 99, 235, 0.06)', borderBottom: '1px solid var(--table-border)', fontSize: '12px', fontWeight: '800', color: '#1e40af', display: 'flex', justifyContent: 'space-between' }}>
                      <span>ARTICLE 22 COMMISSION DISBURSEMENT TIERS (TOTAL 2.00%)</span>
                      <span>Bank: Commercial Bank of Ethiopia (CBE)</span>
                    </div>

                    <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--table-border)' }}>
                          <th style={{ padding: '8px 14px' }}>Beneficiary</th>
                          <th style={{ padding: '8px 14px' }}>Tier Role</th>
                          <th style={{ padding: '8px 14px' }}>Article 22 Rate</th>
                          <th style={{ padding: '8px 14px' }}>Gross Amount</th>
                          <th style={{ padding: '8px 14px' }}>Withholding Tax (2%)</th>
                          <th style={{ padding: '8px 14px' }}>Net CBE Payout</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(cert.disbursements || []).map((disb) => {
                          const isCumulative = Number(disb.split_percentage) > 1.5;
                          return (
                            <tr key={disb.id} style={{ borderBottom: '1px solid var(--table-border)' }}>
                              <td style={{ padding: '8px 14px', fontWeight: '700' }}>
                                {disb.beneficiary?.name || 'Beneficiary'}
                                <span style={{ fontSize: '10.5px', color: '#64748b', marginLeft: '6px' }}>
                                  ({disb.beneficiary?.official_id})
                                </span>
                              </td>
                              <td style={{ padding: '8px 14px' }}>
                                <span style={{ 
                                  background: isCumulative ? '#fef3c7' : '#eff6ff', 
                                  color: isCumulative ? '#92400e' : '#1e40af', 
                                  padding: '2px 6px', 
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: '700'
                                }}>
                                  {disb.beneficiary_role}
                                </span>
                              </td>
                              <td style={{ padding: '8px 14px', fontWeight: '800', color: '#1d4ed8' }}>
                                {Number(disb.split_percentage).toFixed(2)}%
                                {isCumulative && (
                                  <span style={{ fontSize: '10px', color: '#b45309', marginLeft: '4px' }}>
                                    (Art. 22.4 Cumulative)
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: '8px 14px' }}>ETB {Number(disb.net_amount + disb.tax_amount).toLocaleString()}</td>
                              <td style={{ padding: '8px 14px', color: '#dc2626' }}>- ETB {Number(disb.tax_amount).toLocaleString()}</td>
                              <td style={{ padding: '8px 14px', fontWeight: '800', color: '#16a34a' }}>
                                ETB {Number(disb.net_amount).toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: 'var(--bg-app)', fontWeight: '800' }}>
                          <td colSpan={3} style={{ padding: '10px 14px', textAlign: 'right' }}>Total Article 22 Settlement:</td>
                          <td style={{ padding: '10px 14px', color: '#1e3a8a' }}>ETB {grossAmt.toLocaleString()}</td>
                          <td style={{ padding: '10px 14px', color: '#dc2626' }}>ETB {taxAmt.toLocaleString()}</td>
                          <td style={{ padding: '10px 14px', color: '#16a34a', fontSize: '13.5px' }}>ETB {netAmt.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB 2: Article 22 Commission Calculator & Deal Simulator */}
      {activeTab === 'calculator' && (
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--table-border)', 
          borderRadius: '12px', 
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Top Explanation Banner */}
          <div style={{ 
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}>
            <Layers size={26} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: '#064e3b', lineHeight: '1.5' }}>
              <div style={{ fontWeight: '800', fontSize: '15px', marginBottom: '4px', color: '#065f46' }}>
                Article 22: Salary and Commission Distribution Guideline
              </div>
              <div>
                <strong>1. Administrative Structure:</strong> Employees receive a regular salary.<br />
                <strong>2. Sales Department:</strong> Works exclusively on a commission basis (no salary).<br />
                <strong>3. Four Tier Distribution (2.00% Pool):</strong>
                &bull; 1st / Direct Sales Employee (Level 1 &amp; 2) = <strong>1.50%</strong> &bull; 
                2nd / Team Leader (Level 3) = <strong>0.25%</strong> &bull; 
                3rd / Branch Manager (Level 4) = <strong>0.15%</strong> &bull; 
                4th / Generation Head (Level 5) = <strong>0.10%</strong><br />
                <strong>4. Leadership Cumulative Rule:</strong> Leaders who directly execute a sale have their 1.5% salesperson percentage added to their leadership percentage (e.g. Branch Manager = 1.5% + 0.25% + 0.15% = <strong>1.90%</strong>!).
              </div>
            </div>
          </div>

          {/* Interactive Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="modern-input-group">
              <label className="modern-input-label">Property Sale Price (ETB)</label>
              <input 
                type="number" 
                value={calcPrice} 
                onChange={(e) => handlePriceChange(e.target.value)}
                className="modern-input-field" 
                style={{ fontSize: '16px', fontWeight: '800' }}
              />
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                {[10000000, 15000000, 25000000, 50000000].map((preset) => (
                  <button 
                    key={preset}
                    type="button" 
                    onClick={() => handlePriceChange(preset)}
                    style={{ 
                      background: calcPrice === preset ? '#2563eb' : 'var(--bg-app)', 
                      color: calcPrice === preset ? 'white' : 'var(--text-secondary)',
                      border: '1px solid var(--table-border)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {preset / 1000000}M ETB
                  </button>
                ))}
              </div>
            </div>

            <div className="modern-input-group">
              <label className="modern-input-label">Direct Selling Personnel (Tiers 1 to 5)</label>
              <select 
                value={calcAgentId} 
                onChange={(e) => handleAgentChange(e.target.value)}
                className="modern-input-field"
                style={{ fontSize: '14px', fontWeight: '700' }}
              >
                <option value="8">Tewodros Kassahun &bull; Direct Agent (Level 2) &rarr; Direct 1.50%</option>
                <option value="7">Yonas Haile &bull; Team Leader (Level 3) &rarr; Cumulative 1.75% (1.5% + 0.25%)</option>
                <option value="6">Selamawit Bekele &bull; Branch Manager (Level 4) &rarr; Cumulative 1.90% (Art. 22.4 Example)</option>
                <option value="5">Alemayehu Tadesse &bull; Generation Head (Level 5) &rarr; Full 2.00%</option>
              </select>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Demonstrates automatic leadership cumulative stacking under Article 22.4.
              </div>
            </div>
          </div>

          {/* Live Calculation Output Table */}
          {calcResult && (
            <div style={{ border: '1px solid var(--table-border)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ padding: '12px 18px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '800' }}>
                  Commission Calculation for ETB {calcPrice.toLocaleString()} (Total Pool: {calcResult.total_commission_percentage}%)
                </span>
                <span style={{ fontSize: '12px', background: 'rgba(255, 255, 255, 0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                  Seller: {calcResult.selling_agent?.name}
                </span>
              </div>

              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--table-border)' }}>
                    <th style={{ padding: '10px 16px' }}>Beneficiary Tier</th>
                    <th style={{ padding: '10px 16px' }}>Article 22 Rule Breakdown</th>
                    <th style={{ padding: '10px 16px' }}>Effective %</th>
                    <th style={{ padding: '10px 16px' }}>Gross ETB</th>
                    <th style={{ padding: '10px 16px' }}>2% Tax (Art. 14.5)</th>
                    <th style={{ padding: '10px 16px' }}>Net Payout (ETB)</th>
                  </tr>
                </thead>
                <tbody>
                  {calcResult.disbursements.map((d, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--table-border)' }}>
                      <td style={{ padding: '10px 16px', fontWeight: '700' }}>
                        {d.beneficiary_name}
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{d.beneficiary_role}</div>
                      </td>
                      <td style={{ padding: '10px 16px', color: '#2563eb', fontWeight: '700' }}>
                        {d.rate_breakdown}
                      </td>
                      <td style={{ padding: '10px 16px', fontWeight: '800', fontSize: '14px' }}>
                        {d.percentage.toFixed(2)}%
                      </td>
                      <td style={{ padding: '10px 16px' }}>ETB {d.gross_amount.toLocaleString()}</td>
                      <td style={{ padding: '10px 16px', color: '#dc2626' }}>- ETB {d.tax_amount.toLocaleString()}</td>
                      <td style={{ padding: '10px 16px', fontWeight: '800', color: '#16a34a', fontSize: '14px' }}>
                        ETB {d.net_amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--bg-app)', fontWeight: '800' }}>
                    <td colSpan={3} style={{ padding: '12px 16px', textAlign: 'right' }}>Total Settlement:</td>
                    <td style={{ padding: '12px 16px', color: '#1e3a8a' }}>ETB {calcResult.total_gross_commission.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', color: '#dc2626' }}>ETB {calcResult.total_tax_withheld.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', color: '#16a34a', fontSize: '15px' }}>
                      ETB {calcResult.total_net_disbursed.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Deal Execution Simulator Form */}
          <div style={{ 
            background: 'var(--bg-app)', 
            border: '1px solid var(--table-border)', 
            borderRadius: '10px', 
            padding: '20px' 
          }}>
            <div style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-primary)' }}>
              Simulate Closing a Real Deal with this Article 22 Calculation:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div className="modern-input-group">
                <label className="modern-input-label">Select Sold Property</label>
                <select 
                  value={selectedPropertyId} 
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="modern-input-field"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.property_code} &bull; {p.title} (ETB {Number(p.price).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modern-input-group">
                <label className="modern-input-label">Select Buyer Client</label>
                <select 
                  value={selectedCustomerId} 
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="modern-input-field"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      CUST-{c.id} &bull; {c.full_name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="action-btn"
                disabled={isCreatingDeal}
                onClick={handleCreateDeal}
                style={{ 
                  background: '#16a34a', 
                  color: 'white', 
                  padding: '10px 24px', 
                  borderRadius: '8px', 
                  fontWeight: '800', 
                  fontSize: '13.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles size={16} />
                {isCreatingDeal ? 'Executing Deal...' : 'Execute Deal & Generate CBE Payment Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: Daily Activity Diaries */}
      {activeTab === 'diaries' && (
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--table-border)', 
          borderRadius: '12px', 
          padding: '24px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                Team Member Daily Activity Reports &amp; Leader Review (Article 8.4 &amp; 19.2)
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Every ground-level consultant records calls, client leads, and site visits daily. Team leaders conduct daily review meetings.
              </p>
            </div>

            <button 
              className="action-btn"
              onClick={() => setShowDiaryModal(true)}
              style={{ background: '#2563eb', color: 'white', padding: '9px 18px', borderRadius: '8px', fontWeight: '700' }}
            >
              + Log Today's Activity Diary
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {diaries.map((diary) => (
              <div key={diary.id} style={{ 
                border: '1px solid var(--table-border)', 
                borderRadius: '8px', 
                padding: '16px', 
                background: 'var(--bg-app)' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '800', color: '#1e40af' }}>{diary.member?.name || 'Tewodros Kassahun'}</span>
                    <span style={{ fontSize: '11px', background: '#e0e7ff', color: '#3730a3', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                      {diary.team?.name || 'Alpha Squad 1'}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Date: {diary.report_date}</span>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {diary.activity_summary}
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b' }}>
                  <span>Calls Made: <strong>{diary.calls_made || 0}</strong></span>
                  <span>Leads Registered: <strong>{diary.customers_registered || 0}</strong></span>
                  <span>Field Visits: <strong>{diary.field_visits_conducted || 0}</strong></span>
                </div>

                {diary.leader_notes && (
                  <div style={{ 
                    marginTop: '10px', 
                    background: '#f8fafc', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    borderLeft: '3px solid #10b981', 
                    fontSize: '12px' 
                  }}>
                    <strong>Team Leader Review (Art. 8.4):</strong> {diary.leader_notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Diary Submission Modal */}
          {showDiaryModal && (
            <div className="modal-overlay" onClick={() => setShowDiaryModal(false)}>
              <div className="modal-content" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Log Team Daily Activity Diary (Article 8.4)</h3>
                  <button className="modal-close-btn" onClick={() => setShowDiaryModal(false)}>&times;</button>
                </div>

                <form onSubmit={handleDiarySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <div className="modern-input-group">
                      <label className="modern-input-label">Calls Made</label>
                      <input 
                        type="number" 
                        value={diaryForm.calls_made} 
                        onChange={(e) => setDiaryForm({ ...diaryForm, calls_made: parseInt(e.target.value, 10) || 0 })} 
                        className="modern-input-field" 
                      />
                    </div>
                    <div className="modern-input-group">
                      <label className="modern-input-label">Leads Registered</label>
                      <input 
                        type="number" 
                        value={diaryForm.customers_registered} 
                        onChange={(e) => setDiaryForm({ ...diaryForm, customers_registered: parseInt(e.target.value, 10) || 0 })} 
                        className="modern-input-field" 
                      />
                    </div>
                    <div className="modern-input-group">
                      <label className="modern-input-label">Field Visits</label>
                      <input 
                        type="number" 
                        value={diaryForm.field_visits_conducted} 
                        onChange={(e) => setDiaryForm({ ...diaryForm, field_visits_conducted: parseInt(e.target.value, 10) || 0 })} 
                        className="modern-input-field" 
                      />
                    </div>
                  </div>

                  <div className="modern-input-group">
                    <label className="modern-input-label">Daily Activity Summary *</label>
                    <textarea 
                      rows={3} 
                      value={diaryForm.activity_summary} 
                      onChange={(e) => setDiaryForm({ ...diaryForm, activity_summary: e.target.value })} 
                      className="modern-input-field" 
                      required 
                    />
                  </div>

                  <div className="modern-input-group">
                    <label className="modern-input-label">Challenges / Assistance Needed</label>
                    <input 
                      type="text" 
                      value={diaryForm.challenges_encountered} 
                      onChange={(e) => setDiaryForm({ ...diaryForm, challenges_encountered: e.target.value })} 
                      className="modern-input-field" 
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button 
                      type="button" 
                      className="action-btn" 
                      onClick={() => setShowDiaryModal(false)}
                      style={{ background: '#64748b', color: 'white', padding: '8px 16px' }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="action-btn" 
                      style={{ background: '#2563eb', color: 'white', padding: '8px 20px', fontWeight: '700' }}
                    >
                      Submit for Leader Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB 4: Branch Market Tendency Reports */}
      {activeTab === 'tendency' && (
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--table-border)', 
          borderRadius: '12px', 
          padding: '24px' 
        }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
              Branch Customer Market Tendency Reports (Article 9.5 &amp; 17.6)
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Branch Managers analyze customer inclination, objections, and demanded price brackets to guide Generation strategy and developer contracting.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {tendencyReports.map((report) => (
              <div key={report.id} style={{ 
                border: '1px solid var(--table-border)', 
                borderRadius: '8px', 
                padding: '18px', 
                background: 'var(--bg-app)' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building size={16} color="#0284c7" />
                    <span style={{ fontWeight: '800', fontSize: '14px' }}>{report.branch?.name || 'Ayat Main Branch'}</span>
                    <span style={{ fontSize: '11px', background: '#fef08a', color: '#854d0e', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                      Branch Mgr: {report.branch_manager?.name || 'Selamawit Bekele'}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Period: {report.period_start} to {report.period_end}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '10px', lineHeight: '1.5' }}>
                  <strong>Market Tendency Analysis:</strong> {report.market_tendency_summary}
                </div>

                {report.customer_objections_analysis && (
                  <div style={{ fontSize: '12.5px', color: '#b45309', background: '#fffbeb', padding: '8px 12px', borderRadius: '6px', marginBottom: '10px' }}>
                    <strong>Customer Objections Analysis:</strong> {report.customer_objections_analysis}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#475569' }}>
                  <span>Average Budget Inquired: <strong>ETB {Number(report.average_budget || 28500000).toLocaleString()}</strong></span>
                  <span>Submitted to Gen Head: <strong style={{ color: '#16a34a' }}>Article 17.6 Compliant</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default OperationsView;
