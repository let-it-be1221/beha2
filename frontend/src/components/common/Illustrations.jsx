import React from 'react';

// Standing Agent Illustration (matching Dashboard left column)
export const StandingAgentIllustration = ({ className = "agent-illustration" }) => (
  <svg viewBox="0 0 240 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Body outline */}
    <g stroke="#334155" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* Head & Hair */}
      <path d="M120 45 C120 30 145 20 160 30 C175 40 170 60 160 70 C150 78 130 75 120 65 Z" fill="#e2e8f0" />
      <path d="M140 25 C155 20 170 30 175 45 C165 42 155 45 150 48" />
      {/* Face profile */}
      <path d="M162 48 L170 52 L162 58 L165 65 L155 70" />
      <circle cx="155" cy="50" r="1.5" fill="#334155" />
      {/* Neck & Collar */}
      <path d="M140 72 L138 88 L152 88 L150 72" />
      <path d="M136 88 L145 98 L154 88" fill="#ffffff" />
      {/* Tie */}
      <path d="M145 98 L142 110 L146 160 L144 175 L147 160 L150 110 Z" fill="#2563eb" stroke="#1d4ed8" />
      <line x1="143" y1="120" x2="147" y2="120" stroke="#ffffff" strokeWidth="1.5" />
      <line x1="144" y1="135" x2="148" y2="135" stroke="#ffffff" strokeWidth="1.5" />
      <line x1="144" y1="150" x2="148" y2="150" stroke="#ffffff" strokeWidth="1.5" />
      {/* Shirt & Shoulders */}
      <path d="M136 88 L105 110 L95 160 L108 165 L118 125 L125 195 L165 195 L172 125 L185 150 L195 145 L180 105 L154 88 Z" fill="#f8fafc" />
      {/* Right Arm Pointing Up & Left */}
      <path d="M105 110 L75 140 L60 115" />
      {/* Pointing Hand */}
      <path d="M60 115 L50 95 L56 92 L64 110 L70 112" />
      <path d="M50 95 L42 80 L48 78 L56 92" stroke="#2563eb" strokeWidth="3" /> {/* Pointing Finger */}
      {/* Belt & Trousers */}
      <rect x="123" y="195" width="44" height="8" rx="2" fill="#1e293b" />
      <rect x="140" y="194" width="10" height="10" rx="1" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
      <path d="M125 203 L115 310 L138 310 L144 230 L150 310 L173 310 L163 203 Z" fill="#334155" />
      {/* Pocket details */}
      <path d="M128 215 L135 235" />
      <path d="M160 215 L153 235" />
    </g>
  </svg>
);

// Studying Agent Illustration (matching Dashboard right column)
export const StudyingAgentIllustration = ({ className = "agent-illustration" }) => (
  <svg viewBox="0 0 240 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g stroke="#334155" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* Head bowed writing */}
      <path d="M90 60 C85 45 105 35 125 40 C145 45 150 65 140 80 C130 90 110 90 95 80 Z" fill="#e2e8f0" />
      {/* Hair */}
      <path d="M95 50 C105 40 125 35 135 48 C140 55 135 60 130 65" fill="#334155" />
      {/* Face in profile looking down */}
      <path d="M100 70 L92 78 L98 83 L105 85" />
      <circle cx="102" cy="73" r="1.5" fill="#334155" />
      {/* Neck & T-shirt collar */}
      <path d="M115 88 L120 105 L138 102 L132 85" />
      {/* Torso & Arms leaning forward */}
      <path d="M110 105 L80 135 L60 180 L75 190 L95 150 L115 210 L160 205 L170 140 L185 175 L200 168 L175 120 L140 102 Z" fill="#f8fafc" />
      {/* Arm holding pen */}
      <path d="M60 180 L75 220 L95 215" />
      {/* Pen */}
      <line x1="88" y1="210" x2="105" y2="230" stroke="#2563eb" strokeWidth="3" />
      {/* Notebook / Paper */}
      <polygon points="90,225 150,210 170,250 110,265" fill="#ffffff" stroke="#334155" strokeWidth="2" />
      <line x1="105" y1="228" x2="145" y2="218" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="108" y1="236" x2="150" y2="226" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="112" y1="244" x2="155" y2="234" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Desk surface */}
      <line x1="40" y1="260" x2="220" y2="250" stroke="#64748b" strokeWidth="3" />
    </g>
  </svg>
);
