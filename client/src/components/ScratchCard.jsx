import { useRef, useEffect, useState, useCallback } from 'react';
import Confetti from 'react-confetti';
import './ScratchCard.css';

const ScratchCard = ({ revealData }) => {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isScratching, setIsScratching] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const REVEAL_THRESHOLD = 50;

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#D4AF37');
      gradient.addColorStop(0.3, '#F5E6A3');
      gradient.addColorStop(0.6, '#D4AF37');
      gradient.addColorStop(1, '#B8941F');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(139, 105, 20, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      ctx.font = 'bold 22px Playfair Display, Georgia, serif';
      ctx.fillStyle = '#8B6914';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ Scratch to Reveal ✨', canvas.width / 2, canvas.height / 2 - 15);

      /* ctx.font = '14px Poppins, sans-serif';
      ctx.fillStyle = '#9B7920';
      ctx.fillText('Use mouse or finger 👆', canvas.width / 2, canvas.height / 2 + 20); */
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#D4AF37');
    gradient.addColorStop(0.3, '#F5E6A3');
    gradient.addColorStop(0.6, '#D4AF37');
    gradient.addColorStop(1, '#B8941F');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(139, 105, 20, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    ctx.font = window.innerWidth <= 480
      ? 'bold 18px Playfair Display, Georgia, serif'
      : 'bold 22px Playfair Display, Georgia, serif';
    ctx.fillStyle = '#8B6914';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Scratch to Reveal ✨', canvas.width / 2, canvas.height / 2 - 15);

    ctx.font = window.innerWidth <= 480
      ? '12px Poppins, sans-serif'
      : '14px Poppins, sans-serif';
    ctx.fillStyle = '#9B7920';
   // ctx.fillText('Use mouse or finger 👆', canvas.width / 2, canvas.height / 2 + 20);
  }, []);

  const calculateScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    return (transparentPixels / totalPixels) * 100;
  }, []);

  const scratch = useCallback((x, y) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const scratchX = x - rect.left;
    const scratchY = y - rect.top;

    ctx.globalCompositeOperation = 'destination-out';

    ctx.beginPath();
    ctx.arc(scratchX, scratchY, 28, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(
        scratchX + (Math.random() - 0.5) * 20,
        scratchY + (Math.random() - 0.5) * 20,
        15,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    const percentage = calculateScratchPercentage();
    setScratchPercentage(percentage);

    if (percentage > REVEAL_THRESHOLD && !isRevealed) {
      setIsRevealed(true);
      setScratchPercentage(100);

      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 180);
    }
  }, [isRevealed, calculateScratchPercentage]);

  const handleMouseDown = () => setIsScratching(true);
  const handleMouseUp = () => setIsScratching(false);
  const handleMouseMove = (e) => {
    if (isScratching) scratch(e.clientX, e.clientY);
  };

  const handleTouchStart = () => setIsScratching(true);
  const handleTouchEnd = () => setIsScratching(false);
  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  return (
    <section className="scratch-card-section" id="scratch">
      <h2 className="section-title">🎊 Reveal Our Special Date 🎊</h2>
      <p className="section-subtitle">
        Scratch the golden card below to unveil when we say "I Do"
      </p>

      <div className="scratch-card-wrapper">
        <div className="scratch-card-container">
          <div className="scratch-reveal-content">
            <div className="reveal-inner">
              <div className="reveal-hearts">💕</div>
              <p className="reveal-label">Save the Date</p>
              <h2 className="reveal-date">May 04, 2026</h2>
              <div className="reveal-divider">— ✦ —</div>
              <p className="reveal-venue">📍 {revealData.venue}</p>
              <p className="reveal-time">🕐 {revealData.time}</p>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            className="scratch-canvas"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          />
        </div>
      </div>

      <div className="scratch-progress">
        <div
          className="scratch-progress-fill"
          style={{ width: `${Math.min(scratchPercentage, 100)}%` }}
        />
      </div>

      <p className="scratch-hint">
        {isRevealed
          ? '🎉 Date Revealed! See you there!'
          : `${Math.round(scratchPercentage)}% scratched — keep going!`}
      </p>

      {isRevealed && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={400}
          recycle={false}
          gravity={0.15}
          colors={['#D4AF37', '#FF6B6B', '#FF69B4', '#FFD700', '#FFF', '#C0392B']}
        />
      )}
    </section>
  );
};

export default ScratchCard;