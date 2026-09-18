import React, { useState, useEffect } from 'react';
import { INITIAL_PROPERTIES } from '../../data/mockData';
import { Filter, Eye, CheckCircle, Home, MapPin, Tag, Database } from 'lucide-react';
import { fetchProperties } from '../../services/api';

export const HousesView = ({ t }) => {
  const [propertiesList, setPropertiesList] = useState(INITIAL_PROPERTIES);
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSite, setSelectedSite] = useState('All');
  const [selectedBedrooms, setSelectedBedrooms] = useState('All');
  const [searchPropertyId, setSearchPropertyId] = useState('');
  const [activePropertyModal, setActivePropertyModal] = useState(null);

  useEffect(() => {
    fetchProperties()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Format backend properties to match UI fields
          const liveProps = data.map((p) => ({
            id: p.property_code,
            title: p.title,
            type: p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1),
            site: p.specific_area || p.subcity,
            subcity: p.subcity,
            bedrooms: `${p.bedrooms || 3} Bed`,
            area: `${p.area_sqm} m²`,
            price: `ETB ${Number(p.price).toLocaleString()}`,
            advance: p.advance_payment ? `ETB ${Number(p.advance_payment).toLocaleString()}` : 'N/A',
            developer: p.developer_contract?.developer_name || 'Flintstone Homes PLC',
            status: p.status === 'published' ? 'Verified by Info Dept' : p.status,
            description: p.description || 'Verified real estate development published in accordance with Beha guidelines (Article 13.2).',
            advantages: (Array.isArray(p.features) && p.features.length > 0) ? p.features : [
              'Direct intake by Generation Head (Article 16.6)',
              'Verified & published by Information Dept (Article 13.2)',
              'Eligible for CBE bank loan financing & diaspora settlements'
            ],
            vsVilla: 'Modern amenities & central security management',
            vsCondo: 'Superior construction finishes & developer warranties',
            image: (p.images && p.images[0]) || '/images/properties/ayat1.jpg',
            isLiveDb: true,
          }));
          // Merge with initial mock data so user has both
          setPropertiesList([...liveProps, ...INITIAL_PROPERTIES]);
          setIsLiveFromDb(true);
        }
      })
      .catch(() => {
        // Graceful fallback to initial mock data
      });
  }, []);

  const filteredProperties = propertiesList.filter((prop) => {
    if (selectedType !== 'All' && prop.type !== selectedType) return false;
    if (selectedSite !== 'All' && !prop.site.toLowerCase().includes(selectedSite.toLowerCase())) return false;
    if (selectedBedrooms !== 'All' && !prop.bedrooms.includes(selectedBedrooms)) return false;
    if (searchPropertyId.trim() && !prop.id.toLowerCase().includes(searchPropertyId.toLowerCase()) && !prop.title.toLowerCase().includes(searchPropertyId.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="houses-container">
      {/* Top Filter Bar */}
      <div className="houses-filter-bar">
        {/* Type Dropdown */}
        <div className="filter-cell">
          <span>Type</span>
          <span className="filter-arrow-red">&#9660;</span>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Condominium">Condominium</option>
            <option value="Rental Houses">Rental Houses</option>
          </select>
        </div>

        {/* Site Dropdown */}
        <div className="filter-cell">
          <span>Site</span>
          <span className="filter-arrow-red">&#9660;</span>
          <select 
            value={selectedSite} 
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            <option value="All">All Sites</option>
            <option value="Ayat">Ayat</option>
            <option value="Bole">Bole Atlas</option>
            <option value="CMC">CMC</option>
            <option value="Kazanchis">Kazanchis</option>
          </select>
        </div>

        {/* Real Estate Developer */}
        <div className="filter-cell">
          <span>Real Estate</span>
          <span className="filter-arrow-red">&#9660;</span>
          <select>
            <option value="All">All Developers</option>
            <option value="Noah">Noah Real Estate</option>
            <option value="Gift">Gift Real Estate</option>
            <option value="Ayat">Ayat Real Estate</option>
            <option value="Govt">Addis Ababa Housing</option>
          </select>
        </div>

        {/* Bed Rooms */}
        <div className="filter-cell">
          <span>Bed Rooms</span>
          <span className="filter-arrow-red">&#9660;</span>
          <select 
            value={selectedBedrooms} 
            onChange={(e) => setSelectedBedrooms(e.target.value)}
          >
            <option value="All">All Beds</option>
            <option value="2 Bed">2 Bedrooms</option>
            <option value="3 Bed">3 Bedrooms</option>
            <option value="4 Bed">4+ Bedrooms</option>
          </select>
        </div>

        {/* Area */}
        <div className="filter-cell">
          <span>Area</span>
          <span className="filter-arrow-red">&#9660;</span>
          <select>
            <option>All Areas</option>
            <option>&lt; 100 sqm</option>
            <option>100 - 200 sqm</option>
            <option>200 - 350 sqm</option>
            <option>&gt; 350 sqm</option>
          </select>
        </div>

        {/* Status */}
        <div className="filter-cell">
          <span>Status</span>
          <span className="filter-arrow-red">&#9660;</span>
          <select>
            <option>All Statuses</option>
            <option>Ready to Move</option>
            <option>Under Construction</option>
            <option>Off-plan</option>
          </select>
        </div>

        {/* Price */}
        <div className="filter-cell">
          <span>Price</span>
          <span className="filter-arrow-red">&#9660;</span>
          <select>
            <option>Any Price</option>
            <option>&lt; 10M ETB</option>
            <option>10M - 25M ETB</option>
            <option>25M - 50M ETB</option>
            <option>&gt; 50M ETB</option>
          </select>
        </div>

        {/* Property ID Input Badge */}
        <div className="property-id-badge">
          <span>Property ID: </span>
          <input 
            type="text" 
            placeholder="Search ID..." 
            value={searchPropertyId}
            onChange={(e) => setSearchPropertyId(e.target.value)}
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

      {/* 2x2 Grid of Properties */}
      <div className="property-grid">
        {filteredProperties.map((prop) => (
          <div 
            key={prop.id} 
            className="property-card"
            onClick={() => setActivePropertyModal(prop)}
            style={{ cursor: 'pointer' }}
          >
            {/* Visual Column */}
            <div className="property-visual">
              <img src={prop.image} alt={prop.title} className="property-img" />
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#1d4ed8' }}>
                {prop.id}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                {prop.site}
              </div>
              <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#16a34a' }}>
                {prop.price}
              </div>
            </div>

            {/* Content Column */}
            <div className="property-content">
              <div className="property-title">{prop.title}</div>
              
              <p className="property-description">{prop.description}</p>

              {/* Comparisons */}
              <div className="comparison-box">
                {prop.vsVilla && (
                  <div style={{ marginBottom: '4px' }}>
                    <strong>&bull; vs. Villa:</strong> {prop.vsVilla}
                  </div>
                )}
                {prop.vsCondo && (
                  <div>
                    <strong>&bull; vs. Condominium:</strong> {prop.vsCondo}
                  </div>
                )}
                {prop.vsApartment && (
                  <div style={{ marginBottom: '4px' }}>
                    <strong>&bull; vs. Apartment:</strong> {prop.vsApartment}
                  </div>
                )}
                {prop.vsApartmentOwnership && (
                  <div style={{ marginBottom: '4px' }}>
                    <strong>&bull; vs. Apartment:</strong> {prop.vsApartmentOwnership}
                  </div>
                )}
                {prop.vsVillaStandalone && (
                  <div>
                    <strong>&bull; vs. Villa:</strong> {prop.vsVillaStandalone}
                  </div>
                )}
                {prop.vsOwnedPurchasing && (
                  <div>
                    <strong>&bull; vs. Owned Properties (Purchasing):</strong> {prop.vsOwnedPurchasing}
                  </div>
                )}
              </div>

              {/* Core Advantages */}
              <div className="advantages-box">
                <div className="advantages-title">Core Advantages &amp; Benefits:</div>
                <ul className="advantages-list">
                  {(prop.advantages || []).map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Property Details Modal */}
      {activePropertyModal && (
        <div className="modal-overlay" onClick={() => setActivePropertyModal(null)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#1d4ed8', fontWeight: '800' }}>
                {activePropertyModal.title} &bull; Specifications
              </h3>
              <button className="modal-close-btn" onClick={() => setActivePropertyModal(null)}>
                &times;
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '16px', marginBottom: '16px' }}>
              <img 
                src={activePropertyModal.image} 
                alt={activePropertyModal.title} 
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} 
              />
              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Property ID:</strong> {activePropertyModal.id}</div>
                <div><strong>Site / Location:</strong> {activePropertyModal.site} (Addis Ababa)</div>
                <div><strong>Developer:</strong> {activePropertyModal.developer}</div>
                <div><strong>Bedrooms &amp; Layout:</strong> {activePropertyModal.bedrooms}</div>
                <div><strong>Floor Area:</strong> {activePropertyModal.area}</div>
                <div><strong>Delivery Status:</strong> <span style={{ color: '#16a34a', fontWeight: '700' }}>{activePropertyModal.status}</span></div>
                <div><strong>Quoted Price:</strong> <span style={{ color: '#1d4ed8', fontWeight: '800', fontSize: '15px' }}>{activePropertyModal.price}</span></div>
              </div>
            </div>

            <div style={{ fontSize: '12.5px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', lineHeight: '1.5' }}>
              <strong>Consultant Advice for Buyers:</strong> {activePropertyModal.description}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="action-btn"
                style={{ background: '#2563eb', color: 'white', padding: '8px 18px' }}
                onClick={() => {
                  alert(`Site visit booked for property ${activePropertyModal.id} with client.`);
                  setActivePropertyModal(null);
                }}
              >
                Schedule Site Visit Tour
              </button>
              <button 
                className="action-btn"
                style={{ background: '#64748b', color: 'white', padding: '8px 14px' }}
                onClick={() => setActivePropertyModal(null)}
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
