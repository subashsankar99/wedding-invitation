import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaCar,
  FaDirections,
  FaHotel,
  FaUtensils,
  FaCopy,
  FaCheck
} from 'react-icons/fa';
import './VenueMap.css';

const VenueMap = ({ venueData }) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeTab, setActiveTab] = useState('ceremony');

  // ========================================
  // IMPORTANT: Change these to your venue!
  // ========================================
  const venues = {
    ceremony: {
      title: '💒 Wedding Ceremony',
      name: venueData?.ceremonyVenue || 'EVP Rajeswari Marriage Palace',
      address: venueData?.ceremonyAddress || 'EVP Rajeswari Marriage Palace, Chennai, Tamil Nadu',
      time: venueData?.ceremonyTime || '7:00 PM - 9:00 PM',
      phone: venueData?.ceremonyPhone || '+91 98765 43210',
      parking: 'Valet parking available',
      dressCode: 'Traditional / Ethnic wear',

   
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63089.21208580961!2d80.08105624863278!3d13.010378699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5260eccfa397d3%3A0x51ec4e188186646a!2sEVP%20Rajeswari%20Marriage%20Palace!5e1!3m2!1sen!2sin!4v1773595201724!5m2!1sen!2sin',

      // ✅ Direction URL — change destination to your venue name
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=EVP+Rajeswari+Marriage+Palace+Chennai'
    },
    reception: {
      title: '🎉 Reception Party',
      name: venueData?.receptionVenue || 'EVP Rajeswari Marriage Palace',
      address: venueData?.receptionAddress || 'EVP Rajeswari Marriage Palace, Chennai, Tamil Nadu',
      time: venueData?.receptionTime || '9:30 PM Onwards',
      phone: venueData?.receptionPhone || '+91 98765 43211',
      parking: 'Free parking for 200+ cars',
      dressCode: 'Semi-formal / Party wear',

      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63089.21208580961!2d80.08105624863278!3d13.010378699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5260eccfa397d3%3A0x51ec4e188186646a!2sEVP%20Rajeswari%20Marriage%20Palace!5e1!3m2!1sen!2sin!4v1773595201724!5m2!1sen!2sin',

      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=EVP+Rajeswari+Marriage+Palace+Chennai'
    }
  };

  const currentVenue = venues[activeTab];

  // Copy address to clipboard
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(currentVenue.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = currentVenue.address;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  // Open directions in new tab
  const openDirections = () => {
    window.open(currentVenue.directionsUrl, '_blank');
  };

  // Share location via WhatsApp
  const shareOnWhatsApp = () => {
    const text = `📍 ${currentVenue.name}\n📫 ${currentVenue.address}\n🕐 ${currentVenue.time}\n\n🗺️ Directions: ${currentVenue.directionsUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="venue-section" id="venue">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="venue-title">📍 Venue & Directions</h2>
        <p className="venue-subtitle">Find your way to our celebration</p>

        {/* Tabs - Ceremony / Reception */}
        <div className="venue-tabs">
          <button
            className={`venue-tab ${activeTab === 'ceremony' ? 'active' : ''}`}
            onClick={() => setActiveTab('ceremony')}
          >
            💒 Ceremony
          </button>
          <button
            className={`venue-tab ${activeTab === 'reception' ? 'active' : ''}`}
            onClick={() => setActiveTab('reception')}
          >
            🎉 Reception
          </button>
        </div>

        {/* Main content grid */}
        <div className="venue-grid">

          {/* Left - Venue Details */}
          <motion.div
            className="venue-details-card"
            key={activeTab}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="venue-card-title">{currentVenue.title}</h3>
            <h4 className="venue-name">{currentVenue.name}</h4>

            <div className="venue-info-list">
              {/* Address */}
              <div className="venue-info-item">
                <FaMapMarkerAlt className="venue-icon" />
                <div>
                  <span className="info-label">Address</span>
                  <p className="info-value">{currentVenue.address}</p>
                  <button className="copy-btn" onClick={copyAddress}>
                    {copiedAddress ? (
                      <>
                        <FaCheck /> Copied!
                      </>
                    ) : (
                      <>
                        <FaCopy /> Copy Address
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Time */}
              <div className="venue-info-item">
                <FaClock className="venue-icon" />
                <div>
                  <span className="info-label">Timing</span>
                  <p className="info-value">{currentVenue.time}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="venue-info-item">
                <FaPhone className="venue-icon" />
                <div>
                  <span className="info-label">Contact</span>
                  <p className="info-value">
                    <a href={`tel:${currentVenue.phone}`}>{currentVenue.phone}</a>
                  </p>
                </div>
              </div>

              {/* Parking */}
              <div className="venue-info-item">
                <FaCar className="venue-icon" />
                <div>
                  <span className="info-label">Parking</span>
                  <p className="info-value">{currentVenue.parking}</p>
                </div>
              </div>

              {/* Dress Code */}
              <div className="venue-info-item">
                <FaHotel className="venue-icon" />
                <div>
                  <span className="info-label">Dress Code</span>
                  <p className="info-value">{currentVenue.dressCode}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="venue-actions">
              <button className="direction-btn" onClick={openDirections}>
                <FaDirections /> Get Directions
              </button>
              <button className="share-btn" onClick={shareOnWhatsApp}>
                📱 Share on WhatsApp
              </button>
            </div>
          </motion.div>

          {/* Right - Google Map */}
          <motion.div
            className="venue-map-card"
            key={`map-${activeTab}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="map-container">
              <iframe
                src={currentVenue.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map - ${currentVenue.name}`}
              />
            </div>

            {/* Quick info below map */}
            <div className="map-quick-info">
              <div className="quick-info-item">
                <FaUtensils />
                <span>Dinner will be served</span>
              </div>
              <div className="quick-info-item">
                <FaCar />
                <span>{currentVenue.parking}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Nearby Hotels suggestion */}
   {/*      <div className="nearby-section">
          <h4 className="nearby-title">🏨 Nearby Hotels for Outstation Guests</h4>
          <div className="nearby-hotels">
            {[
              { name: 'Hotel Taj Palace', distance: '2 km', price: '₹5,000/night' },
              { name: 'ITC Grand Central', distance: '3 km', price: '₹4,500/night' },
              { name: 'Hotel Comfort Inn', distance: '1.5 km', price: '₹2,500/night' }
            ].map((hotel, i) => (
              <div key={i} className="hotel-card">
                <FaHotel className="hotel-icon" />
                <h5>{hotel.name}</h5>
                <p>{hotel.distance} away</p>
                <p className="hotel-price">{hotel.price}</p>
              </div>
            ))}
          </div>
        </div> */}
      </motion.div>
    </section>
  );
};

export default VenueMap;