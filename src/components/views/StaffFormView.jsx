import React, { useState } from 'react';
import './staff.css';
import { 
  Upload, 
  CheckCircle2, 
  User, 
  FileText, 
  Image as ImageIcon, 
  Save, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  CreditCard, 
  Car, 
  ShieldCheck, 
  PhoneCall, 
  MapPin, 
  X,
  Building
} from 'lucide-react';

export const StaffFormView = ({ t }) => {
  const [cvFile, setCvFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [activeSectionTab, setActiveSectionTab] = useState('all'); // 'all' or specific Roman numeral

  const [staffData, setStaffData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'Male',
    maritalStatus: 'Single',
    nationality: 'Ethiopian',
    nationalIdFan: '1092-8374-6510-9921',
    subCity: 'Bole',
    woreda: '03',
    landmark: 'Around Edna Mall / Medhanialem',
    contactAddress: '+251 911 887766',
    educationLevel: "Bachelor's Degree in Marketing Management",
    institutionYear: 'Addis Ababa University (2023)',
    certifications: 'National Real Estate Sales & Valuation License',
    languages: 'Amharic, English, Afaan Oromoo',
    experience: '3 years experience in luxury residential marketing in Addis Ababa',
    emergencyContact: 'Rahel Tadesse (+251 912 334455 - Sister)',
    invitedBy: 'Head: Mr. X (Branch 01 Leader)',
    cbeAccount: '1000456789123',
    tinNo: '0048291045',
    salesTrackRecord: 'Successfully closed 8 apartment units in Ayat and 2 CMC villas in 2025',
    drivingLicense: 'Auto / Grade 2 (Private Vehicle)'
  });

  const addisSubCities = [
    'Bole', 'Kirkos', 'Yeka', 'Arada', 'Gullele', 
    'Lideta', 'Nifas Silk Lafto', 'Kolfe Keranio', 
    'Akaki Kality', 'Lemi Kura', 'Addis Ketema'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleAutofillDemoStaff = () => {
    setStaffData({
      firstName: 'Alazar',
      middleName: 'Girma',
      lastName: 'Mekonnen',
      gender: 'Male',
      maritalStatus: 'Single',
      nationality: 'Ethiopian',
      nationalIdFan: '8821-4490-1209-7734',
      subCity: 'Yeka',
      woreda: '08',
      landmark: 'Near Megenagna Square',
      contactAddress: '+251 922 556677 &bull; alazar.g@gmail.com',
      educationLevel: "B.A. in Business Administration & Marketing",
      institutionYear: 'St. Mary\'s University (2022)',
      certifications: 'Ethiopian Real Estate Board Certified Agent',
      languages: 'Amharic (Native), English (Fluent), Tigrinya',
      experience: '4 years coordinating property site tours & closing off-plan units',
      emergencyContact: 'Tigist Mekonnen (+251 911 009988 - Mother)',
      invitedBy: 'Head: Mr. X (Branch 01 Leader)',
      cbeAccount: '1000987654321',
      tinNo: '0091827364',
      salesTrackRecord: 'Top seller Q1 2026: 12 luxury condominiums in Ayat Zone 2',
      drivingLicense: 'Auto / Grade 2 (Private Vehicle)'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!staffData.firstName || !staffData.lastName) {
      alert("Please provide the candidate's First and Last Name.");
      return;
    }

    alert(`🎉 Application Submitted! Consultant "${staffData.firstName} ${staffData.middleName} ${staffData.lastName}" is officially enrolled in Beha Marketing PLC (Branch 01).`);
  };

  return (
    <div className="premium-staff-container">
      {/* 1. Hero Onboarding Banner */}
      <div className="staff-hero-banner">
        <div>
          <div className="staff-hero-title">
            <Briefcase size={28} color="#60a5fa" />
            <span>Staff Members &amp; Sales Agent Onboarding</span>
          </div>
          <div className="staff-hero-sub">
            Complete the official registration to join <strong>Beha Marketing PLC</strong> real estate sales forces, access CRM commissions, and receive CBE payroll clearance.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            type="button" 
            className="action-btn"
            onClick={handleAutofillDemoStaff}
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              color: 'white', 
              border: '1px solid rgba(255, 255, 255, 0.4)', 
              padding: '8px 16px',
              borderRadius: '8px' 
            }}
          >
            <Sparkles size={14} style={{ marginRight: '6px' }} />
            Autofill Sample Candidate
          </button>

          <div className="staff-branch-badge">
            <div className="unit-main">Branch 01 &bull; Team 01</div>
            <div className="unit-sub">Head: Mr. X &bull; Ayat Office</div>
          </div>
        </div>
      </div>

      {/* 2. Structured Sections Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        {/* Section I: Personal Information */}
        <div className="form-section-card">
          <div className="section-card-header">
            <div className="section-card-title">
              <span className="section-badge-num">I</span>
              <span>Personal Identification &amp; Demographics</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '12px', fontWeight: '700' }}>
              <ShieldCheck size={16} />
              <span>National ID (Fayda FAN) Verified</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div className="modern-input-group">
              <label className="modern-input-label">(1) First Name *</label>
              <input type="text" name="firstName" value={staffData.firstName} onChange={handleChange} className="modern-input-field" required placeholder="e.g. Alazar" />
            </div>
            <div className="modern-input-group">
              <label className="modern-input-label">(2) Middle Name (Father)</label>
              <input type="text" name="middleName" value={staffData.middleName} onChange={handleChange} className="modern-input-field" placeholder="Father's Name" />
            </div>
            <div className="modern-input-group">
              <label className="modern-input-label">(3) Last Name (Grandfather) *</label>
              <input type="text" name="lastName" value={staffData.lastName} onChange={handleChange} className="modern-input-field" required placeholder="Grandfather's Name" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div className="modern-input-group">
              <label className="modern-input-label">(4) Gender</label>
              <select name="gender" value={staffData.gender} onChange={handleChange} className="modern-input-field">
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className="modern-input-group">
              <label className="modern-input-label">(5) Marital Status</label>
              <select name="maritalStatus" value={staffData.maritalStatus} onChange={handleChange} className="modern-input-field">
                <option>Single</option>
                <option>Married</option>
                <option>Divorced</option>
              </select>
            </div>
            <div className="modern-input-group">
              <label className="modern-input-label">(6) Nationality</label>
              <input type="text" name="nationality" value={staffData.nationality} onChange={handleChange} className="modern-input-field" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.5fr', gap: '14px' }}>
            <div className="modern-input-group">
              <label className="modern-input-label">(7) Fayda National ID (FAN)</label>
              <input type="text" name="nationalIdFan" value={staffData.nationalIdFan} onChange={handleChange} className="modern-input-field" placeholder="16-Digit FAN" />
            </div>
            <div className="modern-input-group">
              <label className="modern-input-label">
                <MapPin size={13} color="#dc2626" />
                (8) Addis Ababa Resident Address
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select name="subCity" value={staffData.subCity} onChange={handleChange} className="modern-input-field" style={{ width: '130px' }}>
                  {addisSubCities.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                </select>
                <input type="text" name="woreda" value={staffData.woreda} onChange={handleChange} className="modern-input-field" style={{ width: '80px' }} placeholder="Woreda" />
                <input type="text" name="landmark" value={staffData.landmark} onChange={handleChange} className="modern-input-field" placeholder="Landmark / Street" />
              </div>
            </div>
            <div className="modern-input-group">
              <label className="modern-input-label">(9) Contact Phone / Address</label>
              <input type="text" name="contactAddress" value={staffData.contactAddress} onChange={handleChange} className="modern-input-field" />
            </div>
          </div>
        </div>

        {/* Section II: Academic Background & Training */}
        <div className="form-section-card">
          <div className="section-card-header">
            <div className="section-card-title">
              <span className="section-badge-num">II</span>
              <span>Academic Background &amp; Language Competencies</span>
            </div>
            <GraduationCap size={18} color="#2563eb" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '14px' }}>
            <div className="modern-input-group">
              <label className="modern-input-label">(10) Higher Education Level</label>
              <input type="text" name="educationLevel" value={staffData.educationLevel} onChange={handleChange} className="modern-input-field" />
            </div>
            <div className="modern-input-group">
              <label className="modern-input-label">(11) Institution &amp; Graduation Year</label>
              <input type="text" name="institutionYear" value={staffData.institutionYear} onChange={handleChange} className="modern-input-field" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '14px' }}>
            <div className="modern-input-group">
              <label className="modern-input-label">(12) Certifications &amp; Short Courses</label>
              <input type="text" name="certifications" value={staffData.certifications} onChange={handleChange} className="modern-input-field" />
            </div>
            <div className="modern-input-group">
              <label className="modern-input-label">(13) Spoken Languages</label>
              <input type="text" name="languages" value={staffData.languages} onChange={handleChange} className="modern-input-field" placeholder="Amharic, English, Oromo, Tigrinya..." />
            </div>
          </div>
        </div>

        {/* Section III & IV: Professional Experience & Emergency Contact */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
          {/* Experience */}
          <div className="form-section-card">
            <div className="section-card-header">
              <div className="section-card-title">
                <span className="section-badge-num">III</span>
                <span>(14) Professional / Work Experience</span>
              </div>
            </div>
            <div className="modern-input-group">
              <textarea 
                name="experience" 
                rows="3"
                value={staffData.experience} 
                onChange={handleChange} 
                className="modern-input-field"
                placeholder="Highlight previous sales, marketing, brokerage, or client negotiation roles..."
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="form-section-card">
            <div className="section-card-header">
              <div className="section-card-title">
                <span className="section-badge-num">IV</span>
                <span>(15 &amp; 16) Emergency &amp; Referrer</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="modern-input-group">
                <label className="modern-input-label">(15) Emergency Contact</label>
                <input type="text" name="emergencyContact" value={staffData.emergencyContact} onChange={handleChange} className="modern-input-field" />
              </div>
              <div className="modern-input-group">
                <label className="modern-input-label">(16) Invited By (Referrer)</label>
                <input type="text" name="invitedBy" value={staffData.invitedBy} onChange={handleChange} className="modern-input-field" />
              </div>
            </div>
          </div>
        </div>

        {/* Section V: Commercial Bank of Ethiopia (CBE) & Tax Information */}
        <div className="form-section-card">
          <div className="section-card-header">
            <div className="section-card-title">
              <span className="section-badge-num">V</span>
              <span>Bank &amp; Legal Tax Information</span>
            </div>
            <span style={{ fontSize: '12px', color: '#701a75', fontWeight: '800' }}>Commercial Bank of Ethiopia (CBE)</span>
          </div>

          {/* CBE Virtual Card Preview */}
          <div className="cbe-bank-card-box">
            <div className="cbe-bank-header">
              <span>COMMERCIAL BANK OF ETHIOPIA (CBE)</span>
              <span>SALARY &amp; COMMISSION ACCOUNT</span>
            </div>
            <div className="cbe-acc-digits">
              {staffData.cbeAccount || '1000 •••• •••• ••••'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', textTransform: 'uppercase', color: '#f5d0fe' }}>
              <span>Cardholder: {staffData.firstName || 'AGENT'} {staffData.lastName || 'SURNAME'}</span>
              <span>BRANCH: AYAT ADDIS ABABA</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="modern-input-group">
              <label className="modern-input-label">
                <CreditCard size={14} color="#701a75" />
                (17) CBE Account No. (13-digit)
              </label>
              <input type="text" name="cbeAccount" value={staffData.cbeAccount} onChange={handleChange} className="modern-input-field" placeholder="1000..." />
            </div>

            <div className="modern-input-group">
              <label className="modern-input-label">
                <FileText size={14} color="#2563eb" />
                (18) Ethiopian Tax Identification Number (TIN)
              </label>
              <input type="text" name="tinNo" value={staffData.tinNo} onChange={handleChange} className="modern-input-field" placeholder="10-digit TIN" />
            </div>
          </div>
        </div>

        {/* Section VI: Sales Staff Track Record & Driving License */}
        <div className="form-section-card">
          <div className="section-card-header">
            <div className="section-card-title">
              <span className="section-badge-num">VI</span>
              <span>Specific Details for Sales Staff</span>
            </div>
            <Car size={18} color="#059669" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px' }}>
            <div className="modern-input-group">
              <label className="modern-input-label">(19) Past Real Estate Sales Track Record</label>
              <input type="text" name="salesTrackRecord" value={staffData.salesTrackRecord} onChange={handleChange} className="modern-input-field" placeholder="e.g. Closed 6 apartments in Bole & CMC in 2025" />
            </div>

            <div className="modern-input-group">
              <label className="modern-input-label">(20) Driving License Grade</label>
              <select name="drivingLicense" value={staffData.drivingLicense} onChange={handleChange} className="modern-input-field">
                <option>None</option>
                <option>Auto / Grade 2 (Private Vehicle)</option>
                <option>Commercial / Grade 3</option>
                <option>Public 1 (Passenger)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Drag-and-Drop File Upload Dropzones */}
        <div className="upload-dropzones-grid">
          {/* CV Upload Dropzone */}
          <label className="dropzone-card">
            <input type="file" onChange={handleCvUpload} style={{ display: 'none' }} accept=".pdf,.doc,.docx" />
            <div className="dropzone-icon-circle">
              <FileText size={28} color="#2563eb" />
            </div>
            <div className="dropzone-text-main">
              {cvFile ? cvFile.name : t.uploadCv}
            </div>
            <div className="dropzone-text-sub">
              {cvFile ? `${(cvFile.size / 1024).toFixed(1)} KB &bull; Click to replace` : "PDF, DOCX up to 10MB"}
            </div>
            {cvFile && (
              <div className="file-preview-pill">
                <CheckCircle2 size={14} />
                <span>Document Ready for Review</span>
              </div>
            )}
          </label>

          {/* Photo Upload Dropzone */}
          <label className="dropzone-card">
            <input type="file" onChange={handlePhotoUpload} style={{ display: 'none' }} accept="image/*" />
            {photoPreview ? (
              <img 
                src={photoPreview} 
                alt="Profile Preview" 
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2563eb' }} 
              />
            ) : (
              <div className="dropzone-icon-circle">
                <ImageIcon size={28} color="#dc2626" />
              </div>
            )}
            <div className="dropzone-text-main">
              {photoFile ? photoFile.name : t.uploadPhoto}
            </div>
            <div className="dropzone-text-sub">
              {photoFile ? "Passport Portrait Loaded" : "Passport photo for Official Agent Badge"}
            </div>
            {photoFile && (
              <div className="file-preview-pill">
                <CheckCircle2 size={14} />
                <span>Photo Attached</span>
              </div>
            )}
          </label>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button 
            type="submit" 
            className="action-btn"
            style={{ 
              background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', 
              color: 'white', 
              padding: '14px 36px', 
              fontSize: '15px', 
              borderRadius: '8px',
              boxShadow: '0 4px 14px rgba(30, 58, 138, 0.35)'
            }}
          >
            <Save size={18} style={{ marginRight: '8px' }} />
            Submit Official Staff Onboarding Application
          </button>
        </div>
      </form>
    </div>
  );
};
