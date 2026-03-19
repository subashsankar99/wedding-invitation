import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import './QueryForm.css';

// Use live backend URL from .env
const API_URL = import.meta.env.VITE_API_URL || 'https://wedding-invitation-90op.onrender.com/api';

const QUERY_TYPES = ['Venue', 'Accommodation', 'Dress Code', 'Food', 'Travel', 'Other'];

const QueryForm = () => {
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    queryType: 'Venue',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Send form data to live backend
      await axios.post(`${API_URL}/queries`, formData);
      setShowSuccess(true);
      setFormData({
        guestName: '',
        email: '',
        phone: '',
        queryType: 'Venue',
        message: ''
      });
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="query-section" id="queries">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="query-title">❓ Have a Question?</h2>
        <p className="query-subtitle">
          Whether it's about the venue, accommodation, or anything else — we're here to help!
        </p>

        <form className="query-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                name="guestName"
                placeholder="Enter your name"
                value={formData.guestName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Query Type *</label>
              <select
                name="queryType"
                value={formData.queryType}
                onChange={handleChange}
                required
              >
                {QUERY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Your Message *</label>
            <textarea
              name="message"
              placeholder="Type your question or message here..."
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              maxLength={1000}
            />
            <span className="char-count">{formData.message.length}/1000</span>
          </div>

          {error && <p className="form-error">❌ {error}</p>}

          <button
            type="submit"
            className="query-submit-btn"
            disabled={submitting}
          >
            {submitting ? '📤 Sending...' : <>
              <FaPaperPlane /> Send Query
            </>}
          </button>
        </form>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="query-success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              ✅ Your query has been submitted! We'll get back to you soon. 📩
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default QueryForm;
