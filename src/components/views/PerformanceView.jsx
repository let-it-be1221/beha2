import React, { useState } from 'react';
import { KPI_WEEKLY_DATA } from '../../data/mockData';
import { Calendar, Award, TrendingUp, Filter } from 'lucide-react';

export const PerformanceView = ({ t }) => {
  const [activeLevel, setActiveLevel] = useState('Personal'); // 'Personal', 'Team', 'Branch', 'Generation'
  const [activePeriod, setActivePeriod] = useState('Quarter'); // 'Year', 'Quarter', 'Month', 'Week'

  const levels = ['Personal', 'Team', 'Branch', 'Generation'];
  const timePeriods = ['Year', 'Quarter', 'Month', 'Week'];

  // Chart pillars data
  const chartCategories = [
    { label: "POTENTIAL CUSTOMERS (12)", value: 11.43, height: "65%", color: "#3b82f6" },
    { label: "SITE VISIT (15)", value: 8.57, height: "48%", color: "#f97316" },
    { label: "CLOSED SALES (30)", value: 30.00, height: "98%", color: "#0284c7" },
    { label: "RECRUITMENT & PERFORMANCE (12)", value: 12.00, height: "68%", color: "#10b981" },
    { label: "GROUP MEETING (9)", value: 8.75, height: "50%", color: "#8b5cf6" },
    { label: "CONSISTENCY - 3 WEEKS TREND (15)", value: 13.66, height: "76%", color: "#eab308" },
    { label: "(EXECUTIVE DISCRETIONARY)", value: 7.00, height: "40%", color: "#64748b" }
  ];

  // Table summary rows
  const pointRow = [74.58, 47.75, 47.75, 61.36, 91.41, 61.41, 61.41, 61.36, 91.41, 61.41, 61.41, 61.36];
  const avgRow = [74.58, 61.17, 56.69, 57.86, 64.57, 64.04, 63.67, 63.38, 66.50, 65.99, 65.57, 65.22];

  return (
    <div className="perf-container">
      {/* Top Level Bar */}
      <div className="perf-top-bar">
        <Calendar size={22} />
        {levels.map((lvl) => (
          <button
            key={lvl}
            className={`perf-tab-btn ${activeLevel === lvl ? 'active' : ''}`}
            onClick={() => setActiveLevel(lvl)}
          >
            <span>{lvl}</span>
            <span style={{ color: '#f87171', fontSize: '10px' }}>&#9660;</span>
          </button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="perf-body-layout">
        {/* Left Time Sidebar */}
        <div className="perf-time-sidebar">
          {timePeriods.map((period) => (
            <button
              key={period}
              className={`time-filter-btn ${activePeriod === period ? 'active' : ''}`}
              onClick={() => setActivePeriod(period)}
            >
              <span>{period}</span>
              <span style={{ color: '#dc2626', fontSize: '10px' }}>&#9660;</span>
            </button>
          ))}
        </div>

        {/* Right Chart & Table Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Bar Chart Card */}
          <div className="chart-card">
            <div className="chart-title">WEEKLY PERFORMANCE STATUS</div>
            <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', gap: '14px', marginBottom: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '2px' }}></span>
                week 1
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', background: '#f97316', borderRadius: '2px' }}></span>
                week 2
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '2px' }}></span>
                week 3
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', background: '#eab308', borderRadius: '2px' }}></span>
                week 4
              </span>
            </div>

            {/* Custom Interactive CSS Bar Chart */}
            <div className="bar-chart-wrap">
              {chartCategories.map((item, idx) => (
                <div key={idx} className="bar-group">
                  <div 
                    className="bar-pillar" 
                    style={{ 
                      height: item.height, 
                      background: `linear-gradient(180deg, ${item.color}, #1e3a8a)` 
                    }}
                  >
                    <span className="bar-val-label">{item.value}</span>
                  </div>
                  <div className="bar-label">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 12-Week KPI Matrix Table */}
          <div className="kpi-table-wrap">
            <table className="kpi-table">
              <thead>
                <tr>
                  <th style={{ width: '30px' }}>No.</th>
                  <th style={{ width: '220px', textAlign: 'left' }}>KPIs</th>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <th key={i} style={{ width: '50px' }}>week {i + 1}</th>
                  ))}
                  <th rowSpan="10" style={{ width: '30px', writingMode: 'vertical-rl', transform: 'rotate(180deg)', background: '#f8fafc', fontWeight: '800', fontSize: '13px' }}>
                    One Quarter
                  </th>
                </tr>
              </thead>
              <tbody>
                {KPI_WEEKLY_DATA.map((row, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td className="kpi-row-header">{row.category} ({row.weight})</td>
                    {row.weeks.map((val, wIdx) => (
                      <td key={wIdx}>{val !== null ? Number(val).toFixed(2) : '-'}</td>
                    ))}
                  </tr>
                ))}

                {/* Point Row */}
                <tr style={{ background: '#e2e8f0', fontWeight: '700' }}>
                  <td colSpan="2" style={{ textAlign: 'left' }}>Point</td>
                  {pointRow.map((pt, i) => (
                    <td key={i}>{pt.toFixed(2)}</td>
                  ))}
                </tr>

                {/* Average Row */}
                <tr style={{ background: '#dbeafe', fontWeight: '700', color: '#1e40af' }}>
                  <td colSpan="2" style={{ textAlign: 'left' }}>Average</td>
                  {avgRow.map((avg, i) => (
                    <td key={i}>{avg.toFixed(2)}</td>
                  ))}
                </tr>

                {/* Quarter Progress Checkpoints */}
                <tr className="kpi-summary-row">
                  <td colSpan="5" style={{ textAlign: 'center' }}>Month 1: 62.58%</td>
                  <td colSpan="4" style={{ textAlign: 'center' }}>Month 2: 63.92%</td>
                  <td colSpan="4" style={{ textAlign: 'center' }}>Month 3: 65.82%</td>
                  <td style={{ background: '#1d4ed8', color: 'white', fontWeight: '800' }}>64.10%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
