import React, { useState, useEffect } from 'react';
import { EDUCATIONAL_HOUSE_TYPES, POSTED_PROPERTIES_INVENTORY } from '../../data/mockData';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Home, 
  ShieldCheck, 
  Filter, 
  DollarSign, 
  RotateCcw, 
  Info,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { fetchProperties } from '../../services/api';

export const HousesView = ({ t }) => {
  const [postedProperties, setPostedProperties] = useState(POSTED_PROPERTIES_INVENTORY);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSite, setSelectedSite] = useState('All');
  const [selectedDeveloper, setSelectedDeveloper] = useState('All');
  const [selectedBedrooms, setSelectedBedrooms] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [searchPropertyId, setSearchPropertyId] = useState('');
  const [activePropertyModal, setActivePropertyModal] = useState(null);

  useEffect(() => {
    fetchProperties()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const liveProps = data.map((p) => ({
            id: p.property_code || `BH-PROP-${p.id}`,
            property_code: p.property_code,
            title: p.title,
            type: p.property_type ? (p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1)) : 'Villa',
            site: p.specific_area || p.subcity || 'Addis Ababa',
            subcity: p.subcity || 'Bole',
            bedrooms: `${p.bedrooms || 3} Bed`,
            bathrooms: p.bathrooms || 2,
            area: `${p.area_sqm || 150} sqm`,
            priceNum: Number(p.price) || 15000000,
            price: `ETB ${Number(p.price).toLocaleString()}`,
            advance: p.advance_payment ? `ETB ${Number(p.advance_payment).toLocaleString()} (20%)` : '20% Down Payment',
            developer: p.developer_contract?.developer_name || 'Flintstone Homes PLC',
            status: p.status === 'published' ? 'Ready to Move' : p.status,
            description: p.description || 'Verified real estate development published in accordance with Beha guidelines (Article 13.2).',
            cbeLoan: 'Eligible for CBE bank loan financing & diaspora settlements',
            features: (Array.isArray(p.features) && p.features.length > 0) ? p.features : [
              'Direct intake by Generation Head (Article 16.6)',
              'Verified & published by Information Dept (Article 13.2)',
              'Eligible for CBE bank loan financing & diaspora settlements'
            ],
            image: (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
          }));
          // Merge unique properties
          const existingIds = new Set(liveProps.map(lp => lp.id));
          const combined = [...liveProps, ...POSTED_PROPERTIES_INVENTORY.filter(p => !existingIds.has(p.id))];
          setPostedProperties(combined);
        }
      })
      .catch(() => {
        // Fallback to initial inventory
      });
  }, []);

  // Determine if any filter is actively selected by user
  const isFilterActive = (
    selectedType !== 'All' ||
    selectedSite !== 'All' ||
    selectedDeveloper !== 'All' ||
    selectedBedrooms !== 'All' ||
    selectedArea !== 'All' ||
    selectedStatus !== 'All' ||
    selectedPrice !== 'All' ||
    searchPropertyId.trim().length > 0
  );

  // Filter posted properties list
  const filteredProperties = postedProperties.filter((prop) => {
    if (selectedType !== 'All' && prop.type !== selectedType) return false;
    if (selectedSite !== 'All' && !prop.site.toLowerCase().includes(selectedSite.toLowerCase()) && !prop.subcity?.toLowerCase().includes(selectedSite.toLowerCase())) return false;
    if (selectedDeveloper !== 'All' && !prop.developer?.toLowerCase().includes(selectedDeveloper.toLowerCase())) return false;
    
    if (selectedBedrooms !== 'All') {
      const bedCount = selectedBedrooms.replace(' Bed', '').replace('+', '');
      if (!prop.bedrooms.includes(bedCount)) return false;
    }

    if (selectedArea !== 'All') {
      const sqm = parseInt(prop.area) || 0;
      if (selectedArea === '< 100 sqm' && sqm >= 100) return false;
      if (selectedArea === '100 - 200 sqm' && (sqm < 100 || sqm > 200)) return false;
      if (selectedArea === '200 - 350 sqm' && (sqm < 200 || sqm > 350)) return false;
      if (selectedArea === '> 350 sqm' && sqm <= 350) return false;
    }

    if (selectedStatus !== 'All' && prop.status !== selectedStatus) return false;

    if (selectedPrice !== 'All') {
      const price = prop.priceNum || 0;
      if (selectedPrice === '< 10M ETB' && price >= 10000000) return false;
      if (selectedPrice === '10M - 25M ETB' && (price < 10000000 || price > 25000000)) return false;
      if (selectedPrice === '25M - 50M ETB' && (price < 25000000 || price > 50000000)) return false;
      if (selectedPrice === '> 50M ETB' && price <= 50000000) return false;
    }

    if (searchPropertyId.trim()) {
      const q = searchPropertyId.trim().toLowerCase();
      const matchesId = prop.id.toLowerCase().includes(q);
      const matchesTitle = prop.title.toLowerCase().includes(q);
      const matchesSite = prop.site.toLowerCase().includes(q);
      if (!matchesId && !matchesTitle && !matchesSite) return false;
    }

    return true;
  });

  // Single property ID detection for placeholder
  const isSingleMatch = isFilterActive && filteredProperties.length === 1;
  const singlePropertyId = isSingleMatch ? filteredProperties[0].id : '';

  const handleClearFilters = () => {
    setSelectedType('All');
    setSelectedSite('All');
    setSelectedDeveloper('All');
    setSelectedBedrooms('All');
    setSelectedArea('All');
    setSelectedStatus('All');
    setSelectedPrice('All');
    setSearchPropertyId('');
  };

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
          <select
            value={selectedDeveloper}
            onChange={(e) => setSelectedDeveloper(e.target.value)}
          >
            <option value="All">All Developers</option>
            <option value="Flintstone">Flintstone Homes PLC</option>
            <option value="Noah">Noah Real Estate</option>
            <option value="Gift">Gift Real Estate</option>
            <option value="Addis Ababa Housing">Addis Ababa Housing Dev</option>
            <option value="Private">Private Landlords</option>
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
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="All">All Areas</option>
            <option value="< 100 sqm">&lt; 100 sqm</option>
            <option value="100 - 200 sqm">100 - 200 sqm</option>
            <option value="200 - 350 sqm">200 - 350 sqm</option>
            <option value="> 350 sqm">&gt; 350 sqm</option>
          </select>
        </div>

        {/* Status */}
        <div className="filter-cell">
          <span>Status</span>
          <span className="filter-arrow-red">&#9660;</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Ready to Move">Ready to Move</option>
            <option value="Under Construction">Under Construction</option>
            <option value="Off-plan">Off-plan</option>
          </select>
        </div>

        {/* Price Filter */}
        <div className="filter-cell">
          <span>Price</span>
          <span className="filter-arrow-red">&#9660;</span>
          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
          >
            <option value="All">Any Price</option>
            <option value="< 10M ETB">&lt; 10M ETB</option>
            <option value="10M - 25M ETB">10M - 25M ETB</option>
            <option value="25M - 50M ETB">25M - 50M ETB</option>
            <option value="> 50M ETB">&gt; 50M ETB</option>
          </select>
        </div>

        {/* Property ID Input Badge */}
        <div className="property-id-badge" style={{ display: 'flex', alignItems: 'center' }}>
          <span>Property ID: </span>
          <input 
            type="text" 
            placeholder={isSingleMatch ? singlePropertyId : (searchPropertyId || "Search ID...")} 
            value={searchPropertyId}
            onChange={(e) => setSearchPropertyId(e.target.value)}
            style={{ 
              background: isSingleMatch ? '#fbbf24' : 'rgba(255, 255, 255, 0.25)', 
              border: isSingleMatch ? '1px solid #d97706' : 'none', 
              color: isSingleMatch ? '#0f172a' : 'white', 
              fontWeight: isSingleMatch ? '800' : '600',
              padding: '2px 8px', 
              borderRadius: '4px',
              fontSize: '12px',
              width: '105px',
              outline: 'none',
              marginLeft: '6px',
              transition: 'all 0.2s ease'
            }} 
            title={isSingleMatch ? `Single matching property: ${singlePropertyId}` : "Filter or search by Property ID"}
          />
        </div>
      </div>

      {/* FILTER ACTIVE: DISPLAY POSTED PROPERTIES REAL ESTATE LIST */}
      {isFilterActive ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Results Summary Bar */}
          <div className="filter-results-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} />
              <span>
                Showing <strong>{filteredProperties.length}</strong> posted {filteredProperties.length === 1 ? 'property' : 'properties'} from verified developer list
                {isSingleMatch && (
                  <span style={{ marginLeft: '8px', background: '#2563eb', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                    Single Property Match: {singlePropertyId}
                  </span>
                )}
              </span>
            </div>
            <button className="clear-filter-btn" onClick={handleClearFilters}>
              <RotateCcw size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Clear Filters &amp; Back to House Types Guide
            </button>
          </div>

          {filteredProperties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--table-border)' }}>
              <Building2 size={48} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '6px' }}>No properties match the selected criteria</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
                Try adjusting your price range, location site, or property type filter.
              </p>
              <button className="clear-filter-btn" onClick={handleClearFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="property-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
              {filteredProperties.map((prop) => (
                <div 
                  key={prop.id} 
                  className="realestate-listing-card"
                  onClick={() => setActivePropertyModal(prop)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="re-card-header">
                    <img src={prop.image} alt={prop.title} className="re-card-img" />
                    <div className="re-tag-overlay">{prop.id} &bull; {prop.type}</div>
                    <div className="re-verified-badge">
                      <ShieldCheck size={13} />
                      Verified Listing
                    </div>
                  </div>

                  <div className="re-card-body">
                    <div className="re-price-row">
                      <div className="re-price-main">{prop.price}</div>
                      <div className="re-advance-sub">Advance: {prop.advance}</div>
                    </div>

                    <div className="re-title">{prop.title}</div>
                    
                    <div className="re-location">
                      <MapPin size={13} color="#dc2626" />
                      <span>{prop.site}, {prop.subcity} (Addis Ababa)</span>
                    </div>

                    <div className="re-specs-row">
                      <div className="re-spec-item">
                        <strong>{prop.bedrooms}</strong>
                        <span>Bedrooms</span>
                      </div>
                      <div className="re-spec-item">
                        <strong>{prop.bathrooms || 2} Bath</strong>
                        <span>Bathrooms</span>
                      </div>
                      <div className="re-spec-item">
                        <strong>{prop.area}</strong>
                        <span>Floor Area</span>
                      </div>
                    </div>

                    <div className="re-loan-tag">
                      🏦 {prop.cbeLoan}
                    </div>

                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      <strong>Developer:</strong> {prop.developer}
                    </div>

                    <div className="re-actions-row">
                      <button className="re-btn-view">
                        View Real Estate Details &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* UNFILTERED / DEFAULT: EDUCATIONAL HOUSE TYPES OVERVIEW (NO PRICE AS REQUESTED) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'var(--bg-card)', 
            padding: '8px 14px', 
            borderRadius: '6px', 
            border: '1px solid var(--table-border)',
            fontSize: '12.5px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={16} color="#2563eb" />
              <span>
                <strong>Educational House Types &amp; Architectural Guide:</strong> Review structural comparisons and core advantages. Use the filter bar above to search active posted properties with prices and details.
              </span>
            </div>
          </div>

          <div className="property-grid">
            {EDUCATIONAL_HOUSE_TYPES.map((houseType) => (
              <div 
                key={houseType.id} 
                className="property-card"
              >
                {/* Visual Column (Image + Category Label + Location Scope - NO PRICE!) */}
                <div className="property-visual">
                  <img src={houseType.image} alt={houseType.title} className="property-img" />
                  <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#1d4ed8', textAlign: 'center' }}>
                    {houseType.categoryLabel || houseType.type}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center' }}>
                    {houseType.locationScope}
                  </div>
                </div>

                {/* Content Column (Title, Description, Comparisons, Core Advantages) */}
                <div className="property-content">
                  <div className="property-title">{houseType.title}</div>
                  
                  <p className="property-description">{houseType.description}</p>

                  {/* Comparisons */}
                  <div className="comparison-box">
                    {houseType.vsVilla && (
                      <div style={{ marginBottom: '4px' }}>
                        <strong>&bull; vs. Villa:</strong> {houseType.vsVilla}
                      </div>
                    )}
                    {houseType.vsCondo && (
                      <div>
                        <strong>&bull; vs. Condominium:</strong> {houseType.vsCondo}
                      </div>
                    )}
                    {houseType.vsApartmentOwnership && (
                      <div style={{ marginBottom: '4px' }}>
                        <strong>&bull; vs. Apartment:</strong> {houseType.vsApartmentOwnership}
                      </div>
                    )}
                    {houseType.vsVillaStandalone && (
                      <div>
                        <strong>&bull; vs. Villa:</strong> {houseType.vsVillaStandalone}
                      </div>
                    )}
                    {houseType.vsOwnedPurchasing && (
                      <div>
                        <strong>&bull; vs. Owned Properties (Purchasing):</strong> {houseType.vsOwnedPurchasing}
                      </div>
                    )}
                  </div>

                  {/* Core Advantages */}
                  <div className="advantages-box">
                    <div className="advantages-title">Core Advantages &amp; Benefits:</div>
                    <ul className="advantages-list">
                      {(houseType.advantages || []).map((adv, idx) => (
                        <li key={idx}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Property Details Modal */}
      {activePropertyModal && (
        <div className="modal-overlay" onClick={() => setActivePropertyModal(null)}>
          <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', marginRight: '8px' }}>
                  {activePropertyModal.id}
                </span>
                <h3 style={{ color: '#1d4ed8', fontWeight: '800', display: 'inline' }}>
                  {activePropertyModal.title}
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setActivePropertyModal(null)}>
                &times;
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px', marginBottom: '16px' }}>
              <img 
                src={activePropertyModal.image} 
                alt={activePropertyModal.title} 
                style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: '8px' }} 
              />
              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Property ID:</strong> {activePropertyModal.id}</div>
                <div><strong>Site &amp; Subcity:</strong> {activePropertyModal.site}, {activePropertyModal.subcity} (Addis Ababa)</div>
                <div><strong>Developer:</strong> {activePropertyModal.developer}</div>
                <div><strong>Bedrooms &amp; Baths:</strong> {activePropertyModal.bedrooms} / {activePropertyModal.bathrooms || 2} Bath</div>
                <div><strong>Floor Area:</strong> {activePropertyModal.area}</div>
                <div><strong>Delivery Status:</strong> <span style={{ color: '#16a34a', fontWeight: '700' }}>{activePropertyModal.status}</span></div>
                <div><strong>Quoted Price:</strong> <span style={{ color: '#16a34a', fontWeight: '800', fontSize: '16px' }}>{activePropertyModal.price}</span></div>
                <div><strong>Advance Payment:</strong> {activePropertyModal.advance}</div>
              </div>
            </div>

            <div style={{ fontSize: '12.5px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', lineHeight: '1.5', marginBottom: '12px' }}>
              <strong>Description &amp; Specifications:</strong> {activePropertyModal.description}
            </div>

            <div style={{ fontSize: '12px', background: '#f0fdf4', padding: '10px', borderRadius: '6px', border: '1px solid #bbf7d0', color: '#166534' }}>
              <strong>Bank Loan &amp; Financing:</strong> {activePropertyModal.cbeLoan}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="action-btn"
                style={{ background: '#2563eb', color: 'white', padding: '8px 18px', fontWeight: '700' }}
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
