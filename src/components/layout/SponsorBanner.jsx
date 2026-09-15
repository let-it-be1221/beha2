import React, { useState } from 'react';
import { CreditCard, X } from 'lucide-react';

export const SponsorBanner = ({ t }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="sponsor-banner-bar">
      <div className="sponsor-brand">
        {/* Bank of Abyssinia 8-point geometric star */}
        <svg viewBox="0 0 100 100" width="28" height="28">
          <polygon points="50,5 64,36 98,36 71,56 82,90 50,70 18,90 29,56 2,36 36,36" fill="#eab308"/>
          <circle cx="50" cy="50" r="12" fill="#000000"/>
        </svg>

        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight: '800', fontSize: '12px', color: '#eab308' }}>አቢሲንያ ባንክ</div>
          <div style={{ fontSize: '10px', color: '#cbd5e1' }}>Bank of Abyssinia</div>
        </div>
      </div>

      <div className="sponsor-text-amharic">
        {t.sponsorText}
      </div>

      <div className="sponsor-card-preview">
        <div className="gold-card-badge">
          <CreditCard size={13} />
          <span>VISA / MASTERCARD</span>
        </div>
        <button 
          className="sponsor-dismiss"
          onClick={() => setVisible(false)}
          title="Dismiss banner"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
