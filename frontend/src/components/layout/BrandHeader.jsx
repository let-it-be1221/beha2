import React from 'react';
import { MapPin, Phone, Mail, Globe, User, Shield } from 'lucide-react';

export const BrandHeader = ({ t, onLogoClick, userSession }) => {
  // If user has specific branch/team, display that, otherwise default to authentic Alpha generation structure
  const genHeadName = "Alemayehu Tadesse";
  const genHeadId = "BH-GEN-001";
  const genHeadPhone = "+251911112233";

  const branchMgrName = "Selamawit Bekele";
  const branchMgrId = "BH-BR-001";
  const branchMgrPhone = "+251911223344";

  const teamLeaderName = "Yonas Haile";
  const teamLeaderId = "BH-TL-001";
  const teamLeaderPhone = "+251911334455";

  return (
    <div className="brand-header-section">
      <div className="brand-main-row">
        {/* Brand Logo & Wordmark */}
        <div className="logo-wrap" onClick={onLogoClick} title="Return to Home">
          <img src="/logo.svg" alt="Beha Marketing" className="logo-img" />
        </div>

        {/* Brand Slogan */}
        <div className="slogan-box">
          &ldquo;{t.slogan}&rdquo;
        </div>
      </div>

      {/* Parchment Org Info Banner */}
      <div className="org-info-banner">
        {/* Company Card */}
        <div className="org-card">
          <div className="org-company-title">Beha Marketing PLC</div>
          <div className="org-line">
            <MapPin size={13} color="#dc2626" style={{ flexShrink: 0 }} />
            <span>
              <strong>Office:</strong> Ayat Square, Addis Ababa &bull;{' '}
              <a 
                href="https://maps.app.goo.gl/78mMDrSUmCrayYAt5" 
                target="_blank" 
                rel="noreferrer"
              >
                Maps Link
              </a>
            </span>
          </div>
          <div className="org-line">
            <Phone size={13} color="#2563eb" style={{ flexShrink: 0 }} />
            <span><strong>Call:</strong> +251912121212</span>
          </div>
          <div className="org-line">
            <Mail size={13} color="#059669" style={{ flexShrink: 0 }} />
            <span><strong>Email:</strong> behamarketing@gmail.com</span>
          </div>
          <div className="org-line">
            <Globe size={13} color="#0284c7" style={{ flexShrink: 0 }} />
            <span><strong>CEO:</strong> Dawit Gebremariam (L5)</span>
          </div>
        </div>

        {/* 01 Generation */}
        <div className="org-card">
          <div className="org-unit-title">Generation 01 (Alpha)</div>
          <div className="org-line">
            <User size={13} color="#475569" />
            <span><strong>Head:</strong> {genHeadName}</span>
          </div>
          <div className="org-line">
            <Shield size={13} color="#d97706" />
            <span><strong>ID No:</strong> {genHeadId}</span>
          </div>
          <div className="org-line">
            <Phone size={13} color="#2563eb" />
            <span><strong>Call:</strong> {genHeadPhone}</span>
          </div>
        </div>

        {/* 01 Branch */}
        <div className="org-card">
          <div className="org-unit-title">Ayat Main Branch (01)</div>
          <div className="org-line">
            <User size={13} color="#475569" />
            <span><strong>Manager:</strong> {branchMgrName}</span>
          </div>
          <div className="org-line">
            <Shield size={13} color="#d97706" />
            <span><strong>ID No:</strong> {branchMgrId}</span>
          </div>
          <div className="org-line">
            <Phone size={13} color="#2563eb" />
            <span><strong>Call:</strong> {branchMgrPhone}</span>
          </div>
        </div>

        {/* 01 Team */}
        <div className="org-card">
          <div className="org-unit-title">Alpha Squad 1 (Team 01)</div>
          <div className="org-line">
            <User size={13} color="#475569" />
            <span><strong>Leader:</strong> {teamLeaderName}</span>
          </div>
          <div className="org-line">
            <Shield size={13} color="#d97706" />
            <span><strong>ID No:</strong> {teamLeaderId}</span>
          </div>
          <div className="org-line">
            <Phone size={13} color="#2563eb" />
            <span><strong>Call:</strong> {teamLeaderPhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
