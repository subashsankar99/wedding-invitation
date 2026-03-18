import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './HeroSection.css';

const HeroSection = ({ couple }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <header className="hero" id="home">
      <div className="hero-bg-overlay" />

      {/* Floating petals animation */}
      <div className="petals-container">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="petal"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          >
            🌸
          </div>
        ))}
      </div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 40 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <p className="hero-invite-text">Together with their families</p>

        <div className="hero-names">
          <motion.h1
            className="bride-name"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {couple.bride}
          </motion.h1>

          <motion.span
            className="amp"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5, type: 'spring' }}
          >
            &
          </motion.span>

          <motion.h1
            className="groom-name"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {couple.groom}
          </motion.h1>
        </div>

        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Request the pleasure of your company at their wedding celebration
        </motion.p>

        <motion.a
          href="#scratch"
          className="hero-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✨ Reveal the Date ✨
        </motion.a>
      </motion.div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-arrow">↓</div>
      </div>
    </header>
  );
};

export default HeroSection;