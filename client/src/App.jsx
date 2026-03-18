import HeroSection from './components/HeroSection';
import CountdownTimer from './components/CountdownTimer';
import ScratchCard from './components/ScratchCard';
import VenueMap from './components/VenueMap';
import WishBoard from './components/WishBoard';
import QueryForm from './components/QueryForm';
import MusicPlayer from './components/MusicPlayer';
import Footer from './components/Footer';
import './App.css';

// ===================================
// CHANGE ALL THIS DATA TO YOUR OWN!
// ===================================
const WEDDING_DATA = {
  couple: {
    bride: 'Priya',
    groom: 'Rahul'
  },
  // ✅ FIXED: May 04, 2026 at 7:00 PM
  date: '2026-05-04T19:00:00',
  venue: 'EVP Rajeswari Marriage Palace, Chennai',
  time: '7:00 PM Onwards',
  venueDetails: {
    ceremonyVenue: 'EVP Rajeswari Marriage Palace',
    ceremonyAddress: 'Evp Rajeswari Marriage Palace Kolapakkam, 3a/145, Theresa Nagar, Kolapakkam, Chennai, Tamil Nadu 600128',
    ceremonyTime: '7:00 PM - 9:00 PM',
    ceremonyPhone: '+91 98765 43210',
    receptionVenue: 'EVP Rajeswari Marriage Palace',
    receptionAddress: 'Evp Rajeswari Marriage Palace Kolapakkam , 3a/145, Theresa Nagar, Kolapakkam, Chennai, Tamil Nadu 600128',
    receptionTime: '9:30 PM Onwards',
    receptionPhone: '+91 98765 43211'
  }
};

function App() {
  return (
    <div className="wedding-app">

      {/* 🎵 Floating Music Player (always visible) */}
      <MusicPlayer />

      {/* Navigation dots */}
      <nav className="side-nav">
        <a href="#home" className="nav-dot" title="Home">●</a>
        <a href="#scratch" className="nav-dot" title="Reveal Date">●</a>
        <a href="#venue" className="nav-dot" title="Venue">●</a>
        <a href="#wishes" className="nav-dot" title="Wishes">●</a>
        <a href="#queries" className="nav-dot" title="Questions">●</a>
      </nav>

      {/* 1. Hero Section */}
      <HeroSection couple={WEDDING_DATA.couple} />

      {/* 2. Countdown Timer */}
      <CountdownTimer targetDate={WEDDING_DATA.date} />

      {/* 3. Scratch Card — Reveal Date */}
      <ScratchCard
        revealData={{
          date: WEDDING_DATA.date,
          venue: WEDDING_DATA.venue,
          time: WEDDING_DATA.time
        }}
      />

      {/* 4. 🗺️ Venue & Google Maps */}
      <VenueMap venueData={WEDDING_DATA.venueDetails} />

      {/* 5. 💌 Wish Board */}
      <WishBoard />

      {/* 6. ❓ Query Form */}
      <QueryForm />

      {/* 7. Footer */}
      <Footer couple={WEDDING_DATA.couple} />

    </div>
  );
}

export default App;