import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './CountdownTimer.css';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Guard: if no valid date, do nothing
    if (!targetDate) {
      console.warn('CountdownTimer: No targetDate prop provided!');
      return;
    }

    const target = new Date(targetDate);

    // Guard: check for invalid date
    if (isNaN(target.getTime())) {
      console.error('CountdownTimer: Invalid targetDate:', targetDate);
      return;
    }

    const calculateTime = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="countdown-section">
      <h2 className="countdown-title">⏳ Counting Down To Forever</h2>

      <div className="countdown-boxes">
        {Object.entries(timeLeft).map(([label, value], index) => (
          <motion.div
            key={label}
            className="countdown-box"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            viewport={{ once: true }}
          >
            <span className="countdown-number">
              {String(value).padStart(2, '0')}
            </span>
            <span className="countdown-label">{label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CountdownTimer;