import React, { useState } from 'react';
import { INITIAL_NOTICES } from '../../data/mockData';
import { Pin, Send, Filter, Clock, FileText, Calendar, Building, Users } from 'lucide-react';

export const NotificationsView = ({ t }) => {
  const [activeSubTab, setActiveSubTab] = useState('direct'); // 'notice', 'direct', 'property', 'partners'
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [refNoSearch, setRefNoSearch] = useState('');
  
  // Direct Message State
  const [messages, setMessages] = useState([
    { id: 1, sender: "Selamawit Bekele (Branch Manager)", time: "10:15 AM", text: "Please prepare the site tour documentation for CMC villas this Saturday." },
    { id: 2, sender: "You (Abebe Kebede)", time: "10:20 AM", text: "Understood Selamawit. 4 buyers are confirmed, 2 of them are Diaspora clients." },
    { id: 3, sender: "Selamawit Bekele (Branch Manager)", time: "10:22 AM", text: "Great! Ensure foreign currency escrow details from Commercial Bank of Ethiopia are included." }
  ]);
  const [newMsgText, setNewMsgText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "You (Abebe Kebede)",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: newMsgText.trim()
      }
    ]);
    setNewMsgText('');
  };

  const filteredNotices = notices.filter((n) => {
    if (selectedTypeFilter !== 'All' && n.type !== selectedTypeFilter) return false;
    if (refNoSearch.trim() && !n.id.toLowerCase().includes(refNoSearch.toLowerCase()) && !n.title.toLowerCase().includes(refNoSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Sub-Bar */}
      <div className="subnav-ribbon">
        <button 
          className={`subnav-tab ${activeSubTab === 'notice' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('notice')}
        >
          <span>Notice Board</span>
          <span className="dropdown-indicator">&#9660;</span>
        </button>

        <button 
          className={`subnav-tab ${activeSubTab === 'direct' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('direct')}
        >
          <span>Direct Message</span>
          <span className="dropdown-indicator">&#9660;</span>
        </button>

        <button 
          className={`subnav-tab ${activeSubTab === 'property' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('property')}
        >
          <span>Property</span>
          <span className="dropdown-indicator">&#9660;</span>
        </button>

        <button 
          className={`subnav-tab ${activeSubTab === 'partners' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('partners')}
        >
          <span>Partners</span>
          <span className="dropdown-indicator">&#9660;</span>
        </button>

        <div className="subnav-right-search">
          <span>Ref. No.: </span>
          <input 
            type="text" 
            placeholder="Search ref..." 
            value={refNoSearch}
            onChange={(e) => setRefNoSearch(e.target.value)}
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              border: 'none', 
              color: 'white', 
              padding: '2px 6px', 
              borderRadius: '3px',
              fontSize: '12px',
              width: '90px',
              outline: 'none',
              marginLeft: '6px'
            }} 
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="notifications-layout">
        {/* Left Filter Sidebar */}
        <div className="notif-sidebar">
          <div className="notif-side-title">Recents</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontWeight: '700', fontSize: '12px', color: '#64748b' }}>Sort by:</div>
            <div 
              className={`notif-side-item ${selectedTypeFilter === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedTypeFilter('All')}
            >
              &bull; All Updates
            </div>
            <div className="notif-side-item">
              <Clock size={12} style={{ marginRight: '6px' }} />
              Time
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
            <div style={{ fontWeight: '700', fontSize: '12px', color: '#64748b' }}>Type:</div>
            <div 
              className={`notif-side-item ${selectedTypeFilter === 'Administrative' ? 'active' : ''}`}
              onClick={() => setSelectedTypeFilter('Administrative')}
            >
              &bull; Administrative
            </div>
            <div 
              className={`notif-side-item ${selectedTypeFilter === 'Schedules' ? 'active' : ''}`}
              onClick={() => setSelectedTypeFilter('Schedules')}
            >
              &bull; Schedules
            </div>
            <div 
              className={`notif-side-item ${selectedTypeFilter === 'MoM' ? 'active' : ''}`}
              onClick={() => setSelectedTypeFilter('MoM')}
            >
              &bull; MoM (Minutes)
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="notice-board-canvas">
          <div className="board-header">
            <span className="pin-icon">📌</span>
            <span>
              {activeSubTab === 'direct' ? 'Direct Team Message' : (activeSubTab === 'property' ? 'Property Announcements' : (activeSubTab === 'partners' ? 'Partner & Bank Bulletins' : 'Notice Board'))}
            </span>
          </div>

          {activeSubTab === 'direct' ? (
            /* Direct Messaging Thread */
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
              <div style={{ 
                flex: 1, 
                background: '#f8fafc', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0', 
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxHeight: '340px',
                overflowY: 'auto'
              }}>
                {messages.map((msg) => {
                  const isMe = msg.sender.startsWith("You");
                  return (
                    <div 
                      key={msg.id}
                      style={{ 
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '75%',
                        background: isMe ? '#2563eb' : '#ffffff',
                        color: isMe ? 'white' : '#1e293b',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: isMe ? 'none' : '1px solid #e2e8f0'
                      }}
                    >
                      <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '2px', fontWeight: '600' }}>
                        {msg.sender} &bull; {msg.time}
                      </div>
                      <div style={{ fontSize: '13.5px' }}>{msg.text}</div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Type your message to Branch 01 team..."
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button 
                  type="submit"
                  className="action-btn"
                  style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '6px' }}
                >
                  <Send size={15} style={{ marginRight: '6px' }} />
                  Send
                </button>
              </form>
            </div>
          ) : (
            /* Notice Cards List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredNotices.map((notice) => (
                <div key={notice.id} className="notice-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        background: '#e0f2fe', 
                        color: '#0369a1', 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        padding: '2px 8px', 
                        borderRadius: '4px' 
                      }}>
                        {notice.type}
                      </span>
                      <strong style={{ fontSize: '14px' }}>{notice.title}</strong>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                      Ref: {notice.id} &bull; {notice.date}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'inherit' }}>
                    {notice.content}
                  </p>

                  <div style={{ marginTop: '8px', fontSize: '11.5px', color: '#64748b', textAlign: 'right' }}>
                    Issued by: <strong>{notice.author}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
