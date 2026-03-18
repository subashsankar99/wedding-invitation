import './Footer.css';

const Footer = ({ couple }) => {
  return (
    <footer className="wedding-footer">
      <div className="footer-content">
        <p className="footer-names">
          {couple.bride} ❤️ {couple.groom}
        </p>
        <p className="footer-tagline">
          We can't wait to celebrate with you!
        </p>
        <div className="footer-divider">— ✦ —</div>
       {/*  <p className="footer-credit">
          Made with 💝 using MERN Stack
        </p> */}
      </div>
    </footer>
  );
};

export default Footer;