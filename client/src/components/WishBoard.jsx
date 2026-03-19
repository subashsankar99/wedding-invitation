import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './WishBoard.css';

// Use live backend URL from .env
const API_URL = import.meta.env.VITE_API_URL || 'https://wedding-invitation-90op.onrender.com/api';

const EMOJI_OPTIONS = ['💝', '🎉', '💒', '🥂', '💐', '✨', '🎊', '💕'];
const RELATION_OPTIONS = ['Family', 'Friend', 'Colleague', 'Other'];

const MAX_DISPLAY_WISHES = 10;
const TEXT_MEDIUM = 100;
const TEXT_SMALL = 200;
const TEXT_TINY = 350;

const WishBoard = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    guestName: '',
    message: '',
    relation: 'Friend',
    emoji: '💝'
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/wishes`);
      setWishes(data.data);
    } catch (error) {
      console.error('Error fetching wishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await axios.post(`${API_URL}/wishes`, formData);
      setWishes(prev => [data.data, ...prev]);
      setFormData({ guestName: '', message: '', relation: 'Friend', emoji: '💝' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert('Could not submit wish. Please try again.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getMessageSizeClass = (message) => {
    const len = message.length;
    if (len > TEXT_TINY) return 'wish-message-tiny';
    if (len > TEXT_SMALL) return 'wish-message-small';
    if (len > TEXT_MEDIUM) return 'wish-message-medium';
    return '';
  };

  const displayedWishes = wishes.slice(0, MAX_DISPLAY_WISHES);

  return (
    <section className="wishboard-section" id="wishes">
      <h2 className="wb-title">💌 Wish the Couple 💌</h2>
      <p className="wb-subtitle">Leave your blessings and warm wishes</p>

      <form className="wish-form" onSubmit={handleSubmit}>
        <div className="wish-name-row">
          <input
            type="text"
            name="guestName"
            placeholder="✍️ Enter your name..."
            value={formData.guestName}
            onChange={handleChange}
            required
            maxLength={50}
            className="wish-name-input"
          />
        </div>

        <div className="relation-picker">
          <span className="relation-label">You are:</span>
          <div className="relation-options">
            {RELATION_OPTIONS.map(r => (
              <button
                key={r}
                type="button"
                className={`relation-btn ${formData.relation === r ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, relation: r }))}
              >
                {r === 'Family' && '👨‍👩‍👧 '}
                {r === 'Friend' && '🤝 '}
                {r === 'Colleague' && '💼 '}
                {r === 'Other' && '🌟 '}
                {r}
              </button>
            ))}
          </div>
        </div>

        <textarea
          name="message"
          placeholder="Write your heartfelt wish here... 💕"
          value={formData.message}
          onChange={handleChange}
          required
          maxLength={500}
          rows={4}
        />

        <div className="emoji-picker">
          <span className="emoji-label">Pick an emoji:</span>
          <div className="emoji-options">
            {EMOJI_OPTIONS.map(em => (
              <button
                key={em}
                type="button"
                className={`emoji-btn ${formData.emoji === em ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, emoji: em }))}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="wish-submit-btn" disabled={submitting}>
          {submitting ? '✨ Sending...' : '💌 Send Wish'}
        </button>
      </form>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="wish-success"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            ✅ Your wish has been sent! Thank you! 💝
          </motion.div>
        )}
      </AnimatePresence>

      <div className="wishes-grid">
        <AnimatePresence>
          {displayedWishes.map((wish, index) => (
            <motion.div
              key={wish._id}
              className="wish-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
            >
              <span className="wish-emoji">{wish.emoji}</span>
              <p className={`wish-message ${getMessageSizeClass(wish.message)}`}>
                &ldquo;{wish.message}&rdquo;
              </p>
              <div className="wish-footer">
                <strong>{wish.guestName}</strong>
                <span className="wish-relation">{wish.relation}</span>
              </div>
              <span className="wish-time">
                {new Date(wish.createdAt).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {wishes.length > MAX_DISPLAY_WISHES && (
        <p className="wishes-more-text">
          💝 +{wishes.length - MAX_DISPLAY_WISHES} more blessings received!
        </p>
      )}

      {loading && <p className="loading-text">Loading wishes... ✨</p>}
      {!loading && wishes.length === 0 && (
        <p className="no-wishes">Be the first to wish the couple! 💕</p>
      )}
    </section>
  );
};

export default WishBoard;
