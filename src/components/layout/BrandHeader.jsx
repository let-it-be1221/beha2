import React from 'react';
import { MapPin, Phone, Mail, Globe, User, Shield } from 'lucide-react';

export const BrandHeader = ({ t, onLogoClick }) => {
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
              <strong>Office:</strong> Ayat Square, Addis Ababa, Ethiopia &bull;{' '}
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
            <span><strong>Website:</strong> www.behamarketing.com</span>
          </div>
        </div>

        {/* 01 Generation */}
        <div className="org-card">
          <div className="org-unit-title">{t.generation}</div>
          <div className="org-line">
            <User size={13} color="#475569" />
            <span><strong>Head:</strong> Mr. X</span>
          </div>
          <div className="org-line">
            <Shield size={13} color="#d97706" />
            <span><strong>ID No:</strong> #8841</span>
          </div>
          <div className="org-line">
            <Phone size={13} color="#2563eb" />
            <span><strong>Call:</strong> +251911000001</span>
          </div>
        </div>

        {/* 01 Branch */}
        <div className="org-card">
          <div className="org-unit-title">{t.branch}</div>
          <div className="org-line">
            <User size={13} color="#475569" />
            <span><strong>Head:</strong> Mr. X</span>
          </div>
          <div className="org-line">
            <Shield size={13} color="#d97706" />
            <span><strong>ID No:</strong> #8842</span>
          </div>
          <div className="org-line">
            <Phone size={13} color="#2563eb" />
            <span><strong>Call:</strong> +251911000002</span>
          </div>
        </div>

        {/* 01 Team */}
        <div className="org-card">
          <div className="org-unit-title">{t.team}</div>
          <div className="org-line">
            <User size={13} color="#475569" />
            <span><strong>Head:</strong> Mr. X</span>
          </div>
          <div className="org-line">
            <Shield size={13} color="#d97706" />
            <span><strong>ID No:</strong> #8843</span>
          </div>
          <div className="org-line">
            <Phone size={13} color="#2563eb" />
            <span><strong>Call:</strong> +251911000003</span>
          </div>
        </div>
      </div>
    </div>
  );
};
