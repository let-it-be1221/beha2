import React, { useState } from 'react';
import { Calendar as CalIcon, Plus, CheckCircle, Clock, MapPin } from 'lucide-react';

export const CalendarView = ({ t }) => {
  const [selectedMonth, setSelectedMonth] = useState('August / ነሐሴ');
  const [selectedYear, setSelectedYear] = useState('2018');
  const [calendarSystem, setCalendarSystem] = useState('E.C.');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'add', 'upcoming', 'active', 'completed'
  const [selectedDay, setSelectedDay] = useState(21);

  // Activities list
  const [activities, setActivities] = useState([
    { id: 1, date: "21 ነሐሴ 2018", title: "Ayat Zone 2 Site Tour with Dawit Tadesse", status: "Active", time: "10:30 AM" },
    { id: 2, date: "21 ነሐሴ 2018", title: "Direct Phone consultation with USA Diaspora client", status: "Upcoming", time: "2:00 PM" },
    { id: 3, date: "22 ነሐሴ 2018", title: "Noah Real Estate Agent briefing & new pricing release", status: "Upcoming", time: "9:00 AM" },
    { id: 4, date: "20 ነሐሴ 2018", title: "Contract signing for CMC 4-bed Villa", status: "Completed", time: "4:00 PM" }
  ]);

  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityTime, setNewActivityTime] = useState('10:00 AM');

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    setActivities([
      ...activities,
      {
        id: activities.length + 1,
        date: `${selectedDay} ነሐሴ 2018`,
        title: newActivityTitle.trim(),
        status: "Active",
        time: newActivityTime
      }
    ]);
    setNewActivityTitle('');
    setActiveTab('active');
    alert(`Activity "${newActivityTitle}" scheduled for day ${selectedDay}!`);
  };

  // 7 weekdays in Amharic and English
  const weekdays = [
    { am: 'ሰኞ', en: 'Mon' },
    { am: 'ማክሰኞ', en: 'Tue' },
    { am: 'ረቡዕ', en: 'Wed' },
    { am: 'ሐሙስ', en: 'Thu' },
    { am: 'አርብ', en: 'Fri' },
    { am: 'ቅዳሜ', en: 'Sat' },
    { am: 'እሁድ', en: 'Sun' }
  ];

  // Calendar dates matrix from screenshot
  const dayRows = [
    [27, 28, '06', 30, '01', '09', 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 21, 29, 30, '01'],
    [25, 26, 27, 28, 29, 30, '01']
  ];

  const filteredActivities = activities.filter((act) => {
    if (activeTab === 'all' || activeTab === 'add') return true;
    if (activeTab === 'upcoming' && act.status === 'Upcoming') return true;
    if (activeTab === 'active' && act.status === 'Active') return true;
    if (activeTab === 'completed' && act.status === 'Completed') return true;
    return true;
  });

  return (
    <div className="calendar-view-wrap">
      {/* Top Filter & Tabs Bar */}
      <div className="calendar-top-bar">
        {/* Dropdowns */}
        <div className="calendar-selects">
          <select 
            className="cal-select" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option>August / ነሐሴ</option>
            <option>September / መስከረም</option>
            <option>July / ሐምሌ</option>
          </select>

          <select 
            className="cal-select" 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option>2018 E.C.</option>
            <option>2017 E.C.</option>
            <option>2026 G.C.</option>
          </select>

          <select 
            className="cal-select" 
            value={calendarSystem} 
            onChange={(e) => setCalendarSystem(e.target.value)}
          >
            <option>E.C. (Ethiopian)</option>
            <option>G.C. (Gregorian)</option>
          </select>
        </div>

        {/* Sub-Tabs */}
        <div className="calendar-tabs">
          <button 
            className={`cal-tab ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Add New Activity
          </button>
          <button 
            className={`cal-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events
          </button>
          <button 
            className={`cal-tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Items
          </button>
          <button 
            className={`cal-tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed Tasks
          </button>
        </div>
      </div>

      {/* Main Layout: Calendar Widget & Activities Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px' }}>
        {/* Stylized Beha Calendar Card */}
        <div className="beha-calendar-card">
          {/* B-E-H-A Hanging Loop Rings */}
          <div className="beha-hangers">
            <div className="hanger-circle">B</div>
            <div className="hanger-circle">e</div>
            <div className="hanger-circle">h</div>
            <div className="hanger-circle">a</div>
          </div>

          {/* Weekday headers */}
          <div className="cal-weekdays">
            {weekdays.map((w, idx) => (
              <div key={idx}>
                <div style={{ fontWeight: '700' }}>{w.am}</div>
                <div>{w.en}</div>
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="cal-days-grid">
            {dayRows.flat().map((d, index) => {
              const isSelected = Number(d) === selectedDay;
              return (
                <div
                  key={index}
                  className={`cal-day-cell ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDay(Number(d))}
                >
                  {d}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '12px', color: '#38bdf8', fontWeight: '700' }}>
            Selected: {selectedDay} ነሐሴ 2018 ዓ.ም (August 2026 G.C)
          </div>
        </div>

        {/* Right Activities Panel */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--table-border)', borderRadius: '8px', padding: '20px' }}>
          {activeTab === 'add' ? (
            /* Add Activity Form */
            <form onSubmit={handleAddActivity} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1d4ed8' }}>
                Schedule New Real Estate Task for Day {selectedDay}
              </h3>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Activity Title / Tour Details:</label>
                <input 
                  type="text" 
                  value={newActivityTitle} 
                  onChange={(e) => setNewActivityTitle(e.target.value)} 
                  placeholder="e.g. Site Visit to Bole Atlas with Buyer" 
                  className="crm-input" 
                  style={{ width: '100%', marginTop: '4px' }} 
                  required 
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Scheduled Time:</label>
                <input 
                  type="text" 
                  value={newActivityTime} 
                  onChange={(e) => setNewActivityTime(e.target.value)} 
                  placeholder="10:30 AM" 
                  className="crm-input" 
                  style={{ width: '100%', marginTop: '4px' }} 
                />
              </div>
              <button 
                type="submit" 
                className="action-btn"
                style={{ background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '6px', alignSelf: 'flex-start' }}
              >
                <Plus size={16} style={{ marginRight: '6px' }} />
                Add to Calendar
              </button>
            </form>
          ) : (
            /* Activities List */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  Scheduled Activities ({filteredActivities.length})
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Day {selectedDay} Highlighted
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredActivities.map((act) => (
                  <div 
                    key={act.id} 
                    style={{ 
                      padding: '12px', 
                      background: 'var(--bg-app)', 
                      borderRadius: '6px', 
                      border: '1px solid var(--table-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px' }}>{act.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '12px', marginTop: '2px' }}>
                        <span><Clock size={12} style={{ marginRight: '4px' }} /> {act.time}</span>
                        <span><CalIcon size={12} style={{ marginRight: '4px' }} /> {act.date}</span>
                      </div>
                    </div>
                    <span style={{ 
                      padding: '3px 10px', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      fontWeight: '700',
                      background: act.status === 'Active' ? '#dbeafe' : (act.status === 'Completed' ? '#dcfce7' : '#fef3c7'),
                      color: act.status === 'Active' ? '#1e40af' : (act.status === 'Completed' ? '#166534' : '#92400e')
                    }}>
                      {act.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
