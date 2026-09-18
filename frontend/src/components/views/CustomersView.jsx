import React, { useState, useEffect } from 'react';
import './customers.css';
import { INITIAL_CUSTOMERS } from '../../data/mockData';
import { fetchCustomers, createCustomer } from '../../services/api';
import { 
  UserPlus, 
  List, 
  Search, 
  Save, 
  Sparkles, 
  User, 
  Phone, 
  Mail, 
  Send, 
  MessageSquare, 
  DollarSign, 
  Building, 
  Home, 
  Key, 
  CheckCircle2, 
  RotateCcw,
  Globe,
  Sliders,
  Database
} from 'lucide-react';

export const CustomersView = ({ t }) => {
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'list'
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerSearchId, setCustomerSearchId] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchCustomers()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const liveCusts = data.map((c) => ({
            id: `CUST-${c.id}`,
            firstName: c.full_name.split(' ')[0] || c.full_name,
            lastName: c.full_name.split(' ').slice(1).join(' ') || '',
            phone: c.phone,
            email: c.email || 'N/A',
            telegram: '@' + (c.full_name.toLowerCase().replace(/\s+/g, '_')),
            whatsapp: c.phone,
            budgetMin: c.budget_min ? Number(c.budget_min).toLocaleString() : '10,000,000',
            budgetMax: c.budget_max ? Number(c.budget_max).toLocaleString() : '25,000,000',
            budgetAvg: c.budget_max && c.budget_min ? Number((Number(c.budget_min) + Number(c.budget_max)) / 2).toLocaleString() : '17,500,000',
            choice1: c.preferred_property_type ? (c.preferred_property_type.charAt(0).toUpperCase() + c.preferred_property_type.slice(1)) : 'Apartment',
            choice2: 'Condominium',
            choice3: 'Villa',
            purpose: c.client_inclination || 'Personal & Investment',
            deliveryUrgency: 'Ready to Move',
            paymentMethod: 'Cash / Installment',
            customerStatus: 'Local Purchaser',
            assignedAgent: c.registered_by?.name ? `${c.registered_by.name} (${c.branch?.name || 'Branch 01'})` : 'Alemayehu Tadesse (Gen 01)',
            createdDate: c.created_at ? c.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            isLiveDb: true,
          }));
          setCustomers([...liveCusts, ...INITIAL_CUSTOMERS]);
          setIsLiveDb(true);
        }
      })
      .catch(() => {
        // Fallback to initial mock data
      });
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    telegram: '',
    whatsapp: '',
    budgetMin: '15,000,000',
    budgetMax: '30,000,000',
    budgetAvg: '22,500,000',
    choice1: 'Apartment',
    choice2: 'Condominium',
    choice3: 'Villa',
    personalUse: true,
    investment: false,
    readyToMove: true,
    offPlan: false,
    highFloor: true,
    balconyView: true,
    parking: true,
    playground: false,
    petApproval: false,
    specialAccommodations: false,
    paymentCash: true,
    paymentInstallment: true,
    paymentBankLoan: false,
    paymentForeignCurrency: false,
    localPurchaser: true,
    diasporaBuyer: false
  });

  const propertyOptions = ['Apartment', 'Villa', 'Condominium', 'Rental Houses'];

  // Calculate completion percentage
  const calculateProgress = () => {
    let score = 0;
    if (formData.firstName) score += 20;
    if (formData.lastName) score += 10;
    if (formData.phone) score += 20;
    if (formData.email) score += 10;
    if (formData.budgetMin && formData.budgetMax) score += 20;
    if (formData.choice1) score += 20;
    return Math.min(score, 100);
  };

  const handleToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAutofillDemo = () => {
    setFormData({
      firstName: 'Kenenisa',
      lastName: 'Bekele',
      phone: '+251 912 345 678',
      email: 'kenenisa.b@realestate-eth.com',
      telegram: '@kenenisa_b',
      whatsapp: '+251 912 345 678',
      budgetMin: '28,000,000',
      budgetMax: '45,000,000',
      budgetAvg: '36,500,000',
      choice1: 'Villa',
      choice2: 'Apartment',
      choice3: 'Condominium',
      personalUse: true,
      investment: true,
      readyToMove: true,
      offPlan: false,
      highFloor: true,
      balconyView: true,
      parking: true,
      playground: true,
      petApproval: true,
      specialAccommodations: false,
      paymentCash: true,
      paymentInstallment: false,
      paymentBankLoan: false,
      paymentForeignCurrency: true,
      localPurchaser: false,
      diasporaBuyer: true
    });
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      telegram: '',
      whatsapp: '',
      budgetMin: '',
      budgetMax: '',
      budgetAvg: '',
      choice1: 'Apartment',
      choice2: 'Condominium',
      choice3: 'Villa',
      personalUse: true,
      investment: false,
      readyToMove: true,
      offPlan: false,
      highFloor: false,
      balconyView: false,
      parking: false,
      playground: false,
      petApproval: false,
      specialAccommodations: false,
      paymentCash: true,
      paymentInstallment: false,
      paymentBankLoan: false,
      paymentForeignCurrency: false,
      localPurchaser: true,
      diasporaBuyer: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phone) {
      alert("Please enter the client's First Name and Contact Phone Number.");
      return;
    }

    setIsSubmitting(true);
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const cleanMin = Number(String(formData.budgetMin).replace(/[^0-9.]/g, '')) || 10000000;
    const cleanMax = Number(String(formData.budgetMax).replace(/[^0-9.]/g, '')) || 25000000;

    const apiPayload = {
      full_name: fullName,
      phone: formData.phone,
      alternate_phone: formData.whatsapp || null,
      email: formData.email || null,
      budget_min: cleanMin,
      budget_max: cleanMax,
      preferred_property_type: (formData.choice1 || 'apartment').toLowerCase(),
      client_inclination: formData.personalUse && formData.investment ? "Personal & Investment" : (formData.investment ? "Investment" : "Personal Use"),
    };

    try {
      const res = await createCustomer(apiPayload);
      const created = res.customer || res;
      const newCustomer = {
        id: `CUST-${created.id || (1000 + customers.length + 1)}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email || "N/A",
        telegram: formData.telegram || "N/A",
        whatsapp: formData.whatsapp || "N/A",
        budgetMin: formData.budgetMin || "10,000,000",
        budgetMax: formData.budgetMax || "25,000,000",
        budgetAvg: formData.budgetAvg || "17,500,000",
        choice1: formData.choice1,
        choice2: formData.choice2,
        choice3: formData.choice3,
        purpose: apiPayload.client_inclination,
        deliveryUrgency: formData.readyToMove ? "Ready to Move" : "Off-plan",
        highFloor: formData.highFloor,
        balconyView: formData.balconyView,
        parking: formData.parking,
        playground: formData.playground,
        petApproval: formData.petApproval,
        specialAccommodations: formData.specialAccommodations,
        paymentMethod: formData.paymentForeignCurrency ? "Foreign Currency" : (formData.paymentBankLoan ? "Bank Loan" : "Cash / Installment"),
        customerStatus: formData.diasporaBuyer ? "Diaspora Buyer" : "Local Purchaser",
        assignedAgent: "Alemayehu Tadesse (Gen 01)",
        createdDate: new Date().toISOString().split('T')[0],
        isLiveDb: true,
      };

      setCustomers([newCustomer, ...customers]);
      setIsLiveDb(true);
      alert(`🎉 Success! Customer "${newCustomer.firstName} ${newCustomer.lastName}" has been enrolled and saved to Beha MySQL Database (Article 8.3).`);
      setActiveTab('list');
    } catch (err) {
      const fallbackCustomer = {
        id: `CUST-${1000 + customers.length + 1}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email || "N/A",
        telegram: formData.telegram || "N/A",
        whatsapp: formData.whatsapp || "N/A",
        budgetMin: formData.budgetMin || "0",
        budgetMax: formData.budgetMax || "0",
        budgetAvg: formData.budgetAvg || "0",
        choice1: formData.choice1,
        choice2: formData.choice2,
        choice3: formData.choice3,
        purpose: "Personal Use",
        deliveryUrgency: "Ready to Move",
        paymentMethod: "Cash / Installment",
        customerStatus: formData.diasporaBuyer ? "Diaspora Buyer" : "Local Purchaser",
        assignedAgent: "Abebe Kebede (Branch 01)",
        createdDate: new Date().toISOString().split('T')[0]
      };
      setCustomers([fallbackCustomer, ...customers]);
      alert(`Customer registered locally (${err.message})`);
      setActiveTab('list');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (statusFilter !== 'All' && c.customerStatus !== statusFilter) return false;
    if (!customerSearchId.trim()) return true;
    const query = customerSearchId.toLowerCase();
    return (
      c.id.toLowerCase().includes(query) ||
      c.firstName.toLowerCase().includes(query) ||
      c.lastName.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query)
    );
  });

  const progress = calculateProgress();

  return (
    <div className="premium-crm-container">
      {/* 1. Header Banner with Live Completion Progress & Database Sync */}
      <div className="crm-header-card">
        <div className="crm-title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2>Beha Customer Intake &amp; Lead Management</h2>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '5px', 
              background: isLiveDb ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)', 
              color: isLiveDb ? '#22c55e' : '#60a5fa', 
              fontSize: '11px', 
              fontWeight: '700', 
              padding: '3px 8px', 
              borderRadius: '20px', 
              border: `1px solid ${isLiveDb ? 'rgba(34, 197, 94, 0.4)' : 'rgba(59, 130, 246, 0.4)'}` 
            }}>
              <Database size={12} />
              {isLiveDb ? 'MySQL beha_db Live' : 'CRM Synced'}
            </span>
          </div>
          <p>
            Capture detailed preferences, Ethiopian &amp; Diaspora buyer profiles, budget brackets, and property specifications per Articles 8.3 &amp; 19.1.
          </p>
        </div>

        <div className="crm-progress-badge">
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Form Completeness
          </div>
          <div style={{ fontSize: '18px', fontWeight: '800' }}>{progress}%</div>
          <div className="crm-progress-bar-wrap">
            <div className="crm-progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tabs Bar & Search */}
      <div className="crm-sub-tabs-bar">
        <button 
          className={`crm-nav-pill ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <UserPlus size={16} />
          <span>Add New Customer</span>
        </button>

        <button 
          className={`crm-nav-pill ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <List size={16} />
          <span>Customers Directory ({customers.length})</span>
        </button>

        {activeTab === 'add' && (
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            <button 
              type="button" 
              className="action-btn"
              onClick={handleAutofillDemo}
              style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '6px 12px' }}
            >
              <Sparkles size={14} style={{ marginRight: '4px' }} />
              Autofill Sample Lead
            </button>
            <button 
              type="button" 
              className="action-btn"
              onClick={handleReset}
              style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '6px 12px' }}
            >
              <RotateCcw size={14} style={{ marginRight: '4px' }} />
              Reset
            </button>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="crm-quick-search-box">
            <Search size={14} color="#64748b" />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              value={customerSearchId}
              onChange={(e) => setCustomerSearchId(e.target.value)}
            />
          </div>
        )}
      </div>

      {activeTab === 'add' ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Section 1: Customer Identity */}
          <div className="form-section-card">
            <div className="section-card-header">
              <div className="section-card-title">
                <span className="section-badge-num">1</span>
                <span>(1 &amp; 2) Customer Full Identity</span>
              </div>
              <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: '700' }}>* Required</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="modern-input-group">
                <label className="modern-input-label">
                  <User size={14} color="#2563eb" />
                  (1) First Name
                </label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleInputChange} 
                  className="modern-input-field" 
                  required
                  placeholder="e.g. Dawit"
                />
              </div>

              <div className="modern-input-group">
                <label className="modern-input-label">
                  <User size={14} color="#2563eb" />
                  (2) Last Name
                </label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleInputChange} 
                  className="modern-input-field" 
                  placeholder="e.g. Tadesse"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Channels */}
          <div className="form-section-card">
            <div className="section-card-header">
              <div className="section-card-title">
                <span className="section-badge-num">3</span>
                <span>(3) Contact Information &amp; Social Channels</span>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Primary Communication</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div className="modern-input-group">
                <label className="modern-input-label">
                  <Phone size={14} color="#16a34a" />
                  (3.1) Phone No. *
                </label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  className="modern-input-field" 
                  required
                  placeholder="+251 911 234567"
                />
              </div>

              <div className="modern-input-group">
                <label className="modern-input-label">
                  <Mail size={14} color="#0284c7" />
                  (3.2) Email Address
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="modern-input-field" 
                  placeholder="client@gmail.com"
                />
              </div>

              <div className="modern-input-group">
                <label className="modern-input-label">
                  <Send size={14} color="#06b6d4" />
                  (3.3) Telegram Handle
                </label>
                <input 
                  type="text" 
                  name="telegram" 
                  value={formData.telegram} 
                  onChange={handleInputChange} 
                  className="modern-input-field" 
                  placeholder="@telegram_handle"
                />
              </div>

              <div className="modern-input-group">
                <label className="modern-input-label">
                  <MessageSquare size={14} color="#22c55e" />
                  (3.4) WhatsApp Number
                </label>
                <input 
                  type="text" 
                  name="whatsapp" 
                  value={formData.whatsapp} 
                  onChange={handleInputChange} 
                  className="modern-input-field" 
                  placeholder="+251... / +1..."
                />
              </div>
            </div>
          </div>

          {/* Section 3: Budget Range */}
          <div className="form-section-card">
            <div className="section-card-header">
              <div className="section-card-title">
                <span className="section-badge-num">4</span>
                <span>(4) Target Budget Range (ETB)</span>
              </div>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700' }}>
                Avg Target: {formData.budgetAvg || '0'} ETB
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div className="modern-input-group">
                <label className="modern-input-label">
                  <DollarSign size={14} color="#d97706" />
                  (4.1) Minimum Budget
                </label>
                <input 
                  type="text" 
                  name="budgetMin" 
                  value={formData.budgetMin} 
                  onChange={handleInputChange} 
                  className="modern-input-field" 
                  placeholder="e.g. 15,000,000"
                />
              </div>

              <div className="modern-input-group">
                <label className="modern-input-label">
                  <DollarSign size={14} color="#d97706" />
                  (4.2) Maximum Budget
                </label>
                <input 
                  type="text" 
                  name="budgetMax" 
                  value={formData.budgetMax} 
                  onChange={handleInputChange} 
                  className="modern-input-field" 
                  placeholder="e.g. 30,000,000"
                />
              </div>

              <div className="modern-input-group">
                <label className="modern-input-label">
                  <DollarSign size={14} color="#d97706" />
                  (4.3) Expected Average
                </label>
                <input 
                  type="text" 
                  name="budgetAvg" 
                  value={formData.budgetAvg} 
                  onChange={handleInputChange} 
                  className="modern-input-field" 
                  placeholder="e.g. 22,500,000"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Property Type Preferences */}
          <div className="form-section-card">
            <div className="section-card-header">
              <div className="section-card-title">
                <span className="section-badge-num">5</span>
                <span>(5) Property Type Priority Choices</span>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Select top 3 choices</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="modern-input-group">
                <label className="modern-input-label">
                  <Building size={14} color="#2563eb" />
                  (5.1) 1st Choice (Primary)
                </label>
                <select 
                  name="choice1" 
                  value={formData.choice1} 
                  onChange={handleInputChange} 
                  className="modern-input-field"
                  style={{ fontWeight: '700' }}
                >
                  {propertyOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="modern-input-group">
                <label className="modern-input-label">
                  <Home size={14} color="#0284c7" />
                  (5.2) 2nd Choice (Secondary)
                </label>
                <select 
                  name="choice2" 
                  value={formData.choice2} 
                  onChange={handleInputChange} 
                  className="modern-input-field"
                >
                  {propertyOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="modern-input-group">
                <label className="modern-input-label">
                  <Key size={14} color="#0d9488" />
                  (5.3) 3rd Choice (Alternative)
                </label>
                <select 
                  name="choice3" 
                  value={formData.choice3} 
                  onChange={handleInputChange} 
                  className="modern-input-field"
                >
                  {propertyOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Purpose of Purchase & Delivery Urgency */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* (6) Purpose */}
            <div className="form-section-card">
              <div className="section-card-header">
                <div className="section-card-title">
                  <span className="section-badge-num">6</span>
                  <span>(6) Purpose of Purchase</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="modern-toggle-box">
                  <span style={{ fontSize: '13.5px', fontWeight: '600' }}>(6.1) Personal Residential Use</span>
                  <div className="pill-switch" onClick={() => handleToggle('personalUse')}>
                    <span className={`pill-option ${formData.personalUse ? 'active-yes' : ''}`}>Yes</span>
                    <span className={`pill-option ${!formData.personalUse ? 'active-no' : ''}`}>No</span>
                  </div>
                </div>

                <div className="modern-toggle-box">
                  <span style={{ fontSize: '13.5px', fontWeight: '600' }}>(6.2) Capital Investment / Rental</span>
                  <div className="pill-switch" onClick={() => handleToggle('investment')}>
                    <span className={`pill-option ${formData.investment ? 'active-yes' : ''}`}>Yes</span>
                    <span className={`pill-option ${!formData.investment ? 'active-no' : ''}`}>No</span>
                  </div>
                </div>
              </div>
            </div>

            {/* (7) Delivery Urgency */}
            <div className="form-section-card">
              <div className="section-card-header">
                <div className="section-card-title">
                  <span className="section-badge-num">7</span>
                  <span>(7) Delivery Urgency</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="modern-toggle-box">
                  <span style={{ fontSize: '13.5px', fontWeight: '600' }}>(7.1) Ready to Move In</span>
                  <div className="pill-switch" onClick={() => handleToggle('readyToMove')}>
                    <span className={`pill-option ${formData.readyToMove ? 'active-yes' : ''}`}>Yes</span>
                    <span className={`pill-option ${!formData.readyToMove ? 'active-no' : ''}`}>No</span>
                  </div>
                </div>

                <div className="modern-toggle-box">
                  <span style={{ fontSize: '13.5px', fontWeight: '600' }}>(7.2) Off-plan (Under Construction)</span>
                  <div className="pill-switch" onClick={() => handleToggle('offPlan')}>
                    <span className={`pill-option ${formData.offPlan ? 'active-yes' : ''}`}>Yes</span>
                    <span className={`pill-option ${!formData.offPlan ? 'active-no' : ''}`}>No</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Special Preferences */}
          <div className="form-section-card">
            <div className="section-card-header">
              <div className="section-card-title">
                <span className="section-badge-num">8</span>
                <span>(8) Special Housing Amenities &amp; Preferences</span>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Custom buyer requirements</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div className="modern-toggle-box">
                <span style={{ fontSize: '13px', fontWeight: '600' }}>(8.1) High Floor</span>
                <div className="pill-switch" onClick={() => handleToggle('highFloor')}>
                  <span className={`pill-option ${formData.highFloor ? 'active-yes' : ''}`}>Yes</span>
                  <span className={`pill-option ${!formData.highFloor ? 'active-no' : ''}`}>No</span>
                </div>
              </div>

              <div className="modern-toggle-box">
                <span style={{ fontSize: '13px', fontWeight: '600' }}>(8.2) Balcony View</span>
                <div className="pill-switch" onClick={() => handleToggle('balconyView')}>
                  <span className={`pill-option ${formData.balconyView ? 'active-yes' : ''}`}>Yes</span>
                  <span className={`pill-option ${!formData.balconyView ? 'active-no' : ''}`}>No</span>
                </div>
              </div>

              <div className="modern-toggle-box">
                <span style={{ fontSize: '13px', fontWeight: '600' }}>(8.3) Dedicated Parking</span>
                <div className="pill-switch" onClick={() => handleToggle('parking')}>
                  <span className={`pill-option ${formData.parking ? 'active-yes' : ''}`}>Yes</span>
                  <span className={`pill-option ${!formData.parking ? 'active-no' : ''}`}>No</span>
                </div>
              </div>

              <div className="modern-toggle-box">
                <span style={{ fontSize: '13px', fontWeight: '600' }}>(8.4) Children Playground</span>
                <div className="pill-switch" onClick={() => handleToggle('playground')}>
                  <span className={`pill-option ${formData.playground ? 'active-yes' : ''}`}>Yes</span>
                  <span className={`pill-option ${!formData.playground ? 'active-no' : ''}`}>No</span>
                </div>
              </div>

              <div className="modern-toggle-box">
                <span style={{ fontSize: '13px', fontWeight: '600' }}>(8.5) Pet Approval</span>
                <div className="pill-switch" onClick={() => handleToggle('petApproval')}>
                  <span className={`pill-option ${formData.petApproval ? 'active-yes' : ''}`}>Yes</span>
                  <span className={`pill-option ${!formData.petApproval ? 'active-no' : ''}`}>No</span>
                </div>
              </div>

              <div className="modern-toggle-box">
                <span style={{ fontSize: '13px', fontWeight: '600' }}>(8.6) Special Accommodations</span>
                <div className="pill-switch" onClick={() => handleToggle('specialAccommodations')}>
                  <span className={`pill-option ${formData.specialAccommodations ? 'active-yes' : ''}`}>Yes</span>
                  <span className={`pill-option ${!formData.specialAccommodations ? 'active-no' : ''}`}>No</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Payment Method & Customer Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
            {/* Payment Method */}
            <div className="form-section-card">
              <div className="section-card-header">
                <div className="section-card-title">
                  <span className="section-badge-num">9</span>
                  <span>(9) Preferred Payment Method</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="modern-toggle-box">
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>(9.1) 100% Cash</span>
                  <div className="pill-switch" onClick={() => handleToggle('paymentCash')}>
                    <span className={`pill-option ${formData.paymentCash ? 'active-yes' : ''}`}>Yes</span>
                    <span className={`pill-option ${!formData.paymentCash ? 'active-no' : ''}`}>No</span>
                  </div>
                </div>

                <div className="modern-toggle-box">
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>(9.2) Installment</span>
                  <div className="pill-switch" onClick={() => handleToggle('paymentInstallment')}>
                    <span className={`pill-option ${formData.paymentInstallment ? 'active-yes' : ''}`}>Yes</span>
                    <span className={`pill-option ${!formData.paymentInstallment ? 'active-no' : ''}`}>No</span>
                  </div>
                </div>

                <div className="modern-toggle-box">
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>(9.3) Bank Loan (Mortgage)</span>
                  <div className="pill-switch" onClick={() => handleToggle('paymentBankLoan')}>
                    <span className={`pill-option ${formData.paymentBankLoan ? 'active-yes' : ''}`}>Yes</span>
                    <span className={`pill-option ${!formData.paymentBankLoan ? 'active-no' : ''}`}>No</span>
                  </div>
                </div>

                <div className="modern-toggle-box">
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>(9.4) Foreign Currency (USD/EUR)</span>
                  <div className="pill-switch" onClick={() => handleToggle('paymentForeignCurrency')}>
                    <span className={`pill-option ${formData.paymentForeignCurrency ? 'active-yes' : ''}`}>Yes</span>
                    <span className={`pill-option ${!formData.paymentForeignCurrency ? 'active-no' : ''}`}>No</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Status */}
            <div className="form-section-card">
              <div className="section-card-header">
                <div className="section-card-title">
                  <span className="section-badge-num">10</span>
                  <span>(10) Customer Residency Status</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="modern-toggle-box">
                  <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                    🇪🇹 (10.1) Local Purchaser
                  </span>
                  <div className="pill-switch" onClick={() => handleToggle('localPurchaser')}>
                    <span className={`pill-option ${formData.localPurchaser ? 'active-yes' : ''}`}>Yes</span>
                    <span className={`pill-option ${!formData.localPurchaser ? 'active-no' : ''}`}>No</span>
                  </div>
                </div>

                <div className="modern-toggle-box">
                  <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                    🌍 (10.2) Diaspora Buyer
                  </span>
                  <div className="pill-switch" onClick={() => handleToggle('diasporaBuyer')}>
                    <span className={`pill-option ${formData.diasporaBuyer ? 'active-yes' : ''}`}>Yes</span>
                    <span className={`pill-option ${!formData.diasporaBuyer ? 'active-no' : ''}`}>No</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Form Action Footer */}
          <div className="form-action-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={20} color="#16a34a" />
              <div>
                <div style={{ fontWeight: '700', fontSize: '13.5px' }}>
                  Ready to Enroll Client in Beha CRM
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Will assign lead to current active session: Abebe Kebede (Branch 01)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                className="action-btn"
                onClick={handleReset}
                style={{ padding: '10px 18px', border: '1px solid var(--table-border)', borderRadius: '6px' }}
              >
                Clear
              </button>

              <button 
                type="submit" 
                className="action-btn"
                style={{ 
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
                  color: 'white', 
                  padding: '10px 28px', 
                  fontSize: '14.5px', 
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
                }}
              >
                <Save size={16} style={{ marginRight: '8px' }} />
                Save Customer Lead
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Customers Directory Table View */
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--table-border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '16px 20px', background: 'var(--bg-app)', borderBottom: '1px solid var(--table-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: '800', fontSize: '16px' }}>Enrolled Clients Directory</span>
              <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '12px' }}>
                {filteredCustomers.length} Records
              </span>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['All', 'Local Purchaser', 'Diaspora Buyer'].map(status => (
                <button
                  key={status}
                  className="action-btn"
                  onClick={() => setStatusFilter(status)}
                  style={{
                    fontSize: '12px',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: statusFilter === status ? '#2563eb' : 'var(--bg-card)',
                    color: statusFilter === status ? 'white' : 'var(--text-secondary)',
                    border: '1px solid var(--table-border)'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-app)', textAlign: 'left', borderBottom: '2px solid var(--table-border)' }}>
                  <th style={{ padding: '12px 16px' }}>Customer ID</th>
                  <th style={{ padding: '12px 16px' }}>Full Name</th>
                  <th style={{ padding: '12px 16px' }}>Phone / Contact</th>
                  <th style={{ padding: '12px 16px' }}>Property Choice</th>
                  <th style={{ padding: '12px 16px' }}>Budget Range (ETB)</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Payment Mode</th>
                  <th style={{ padding: '12px 16px' }}>Assigned Agent</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} style={{ borderBottom: '1px solid var(--table-border)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '800', color: '#2563eb' }}>{cust.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '700' }}>{cust.firstName} {cust.lastName}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: '600' }}>{cust.phone}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{cust.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>
                        {cust.choice1}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#059669' }}>
                      {cust.budgetMin} - {cust.budgetMax}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        background: cust.customerStatus === 'Diaspora Buyer' ? '#fef3c7' : '#dcfce7',
                        color: cust.customerStatus === 'Diaspora Buyer' ? '#92400e' : '#166534',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {cust.customerStatus === 'Diaspora Buyer' ? '🌍' : '🇪🇹'} {cust.customerStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{cust.paymentMethod}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{cust.assignedAgent}</td>
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
