import React, { useState } from 'react';
import { StandingAgentIllustration, StudyingAgentIllustration } from '../common/Illustrations';
import { CheckCircle2, PhoneCall, MapPin, BookOpen, ExternalLink, Calendar } from 'lucide-react';

export const DashboardView = ({ t, onNavigate }) => {
  const [showTechniquesModal, setShowTechniquesModal] = useState(false);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState(null);

  const schedules = [
    { 
      id: 1, 
      title: t.siteVisit, 
      time: "10:30 AM", 
      location: "Ayat Zone 2 (Noah Apartments)", 
      client: "Dawit Tadesse (+251911223344)",
      note: "Viewing 3-bedroom ready unit on the 4th floor."
    },
    { 
      id: 2, 
      title: t.directCall, 
      time: "2:00 PM", 
      location: "Phone / Telegram", 
      client: "Selamawit Haile (Diaspora - USA)",
      note: "Discuss foreign currency payment options for CMC Villa."
    },
    { 
      id: 3, 
      title: t.leadFollowup, 
      time: "4:15 PM", 
      location: "Bole Atlas Office", 
      client: "Dr. Yonas Girma",
      note: "Follow-up on loan pre-approval letter from Commercial Bank of Ethiopia."
    }
  ];

  return (
    <div className="dashboard-grid">
      {/* Column 1: Today's Schedule */}
      <div className="dash-column">
        <div className="dash-col-header">{t.todaysSchedule}</div>
        
        <ul className="schedule-list">
          {schedules.map((item) => (
            <li 
              key={item.id} 
              className="schedule-item"
              onClick={() => setSelectedScheduleItem(item)}
              style={{ cursor: 'pointer' }}
              title="Click to view details"
            >
              <span className="schedule-bullet"></span>
              <span style={{ textDecoration: 'underline' }}>{item.title}</span>
              <span style={{ fontSize: '11px', color: '#64748b', marginLeft: 'auto' }}>
                {item.time}
              </span>
            </li>
          ))}
        </ul>

        <div className="agent-illustration-wrap">
          <img 
            src="/images/salesman_suit_tie.jpg" 
            alt="Professional Real Estate Salesman with Suit & Tie" 
            className="agent-photo" 
          />
        </div>
      </div>

      {/* Column 2: Core Marketing Techniques */}
      <div className="dash-column" style={{ borderLeft: '1px solid var(--table-border)', borderRight: '1px solid var(--table-border)', padding: '0 16px' }}>
        <div className="techniques-title">{t.marketingTechniques}</div>

        <div className="technique-item">
          <strong>{t.technique1Title}</strong> {t.technique1Desc}
        </div>

        <div className="technique-item">
          <strong>{t.technique2Title}</strong> {t.technique2Desc}
          <span 
            className="see-more-link" 
            onClick={() => setShowTechniquesModal(true)}
          >
            {t.seeMore}
          </span>
        </div>

        {/* Quick KPI preview banner */}
        <div style={{ marginTop: 'auto', background: 'var(--bg-app)', padding: '12px', borderRadius: '8px', border: '1px solid var(--table-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: '700' }}>Quarter Performance Target</span>
            <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '800' }}>64.10%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '64.1%', height: '100%', background: '#2563eb', borderRadius: '4px' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button 
              className="action-btn" 
              onClick={() => onNavigate('performance')}
              style={{ fontSize: '11.5px', padding: '0' }}
            >
              View Full 12-Week KPI Matrix &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Column 3: Today's Studying */}
      <div className="dash-column">
        <div className="studying-header">{t.todaysStudying}</div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          <div style={{ background: 'rgba(37, 99, 235, 0.08)', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', borderLeft: '3px solid #2563eb' }}>
            <strong>{t.studyTopic1}</strong>
          </div>
          <div style={{ background: 'rgba(37, 99, 235, 0.08)', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', borderLeft: '3px solid #059669' }}>
            <strong>{t.studyTopic2}</strong>
          </div>
          <div style={{ background: 'rgba(37, 99, 235, 0.08)', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', borderLeft: '3px solid #d97706' }}>
            <strong>{t.studyTopic3}</strong>
          </div>
        </div>

        <div className="agent-illustration-wrap">
          <img 
            src="/images/office_man_desk.jpg" 
            alt="Real Estate Office Manager at Desk" 
            className="agent-photo" 
          />
        </div>
      </div>

      {/* Modal: Full Marketing Techniques */}
      {showTechniquesModal && (
        <div className="modal-overlay" onClick={() => setShowTechniquesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#dc2626', fontWeight: '800' }}>
                Core Real Estate Marketing Techniques
              </h3>
              <button className="modal-close-btn" onClick={() => setShowTechniquesModal(false)}>
                &times;
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px', lineHeight: '1.6' }}>
              <div>
                <strong>1. Relationship Marketing:</strong> Focuses on building long-term trust and loyalty with clients rather than just making a quick one-time sale. Satisfied customers become repeat buyers and brand advocates.
              </div>
              <div>
                <strong>2. Social Proof & Word-of-Mouth:</strong> People trust recommendations from peers. Sharing success stories, testimonials, and positive reviews helps build instant credibility with potential buyers.
              </div>
              <div>
                <strong>3. Consultative Selling (Needs Discovery):</strong> Rather than hard-selling, understand the buyer&apos;s lifestyle, budget, and family goals to match the exact property (Apartment vs. Villa vs. Condominium).
              </div>
              <div>
                <strong>4. Urgency & Scarcity (Ethical Anchoring):</strong> Inform clients of price escalation stages (off-plan discount windows) and limited prime view units.
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="action-btn"
                style={{ background: '#2563eb', color: 'white', padding: '6px 16px' }}
                onClick={() => setShowTechniquesModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Schedule Item Details */}
      {selectedScheduleItem && (
        <div className="modal-overlay" onClick={() => setSelectedScheduleItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#2563eb', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} />
                <span>{selectedScheduleItem.title}</span>
              </h3>
              <button className="modal-close-btn" onClick={() => setSelectedScheduleItem(null)}>
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <div><strong>Time:</strong> {selectedScheduleItem.time}</div>
              <div><strong>Client:</strong> {selectedScheduleItem.client}</div>
              <div><strong>Location / Channel:</strong> {selectedScheduleItem.location}</div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>Brief Note:</strong> {selectedScheduleItem.note}
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="action-btn"
                style={{ background: '#16a34a', color: 'white', padding: '6px 14px' }}
                onClick={() => {
                  alert("Marked as Completed!");
                  setSelectedScheduleItem(null);
                }}
              >
                <CheckCircle2 size={14} style={{ marginRight: '4px' }} />
                Mark Completed
              </button>
              <button 
                className="action-btn"
                style={{ background: '#64748b', color: 'white', padding: '6px 14px' }}
                onClick={() => setSelectedScheduleItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
