import React from "react";


const Footer = () => {
  const socialLinks = [
    { name: "Facebook", icon: "logo-facebook", url: "#" },
    { name: "Instagram", icon: "logo-instagram", url: "#" },
    { name: "LinkedIn", icon: "logo-linkedin", url: "#" },
    { name: "Twitter", icon: "logo-twitter", url: "#" },
  ];

  const footerLinks = [
    { name: "Privacy Policy", url: "#" },
    { name: "Terms & Conditions", url: "#" },
    { name: "FAQ", url: "#" },
  ];

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-brand">
            <div className="id">
              <div className="svg2">
                <h2 style={{ color: "rgb(184, 191, 210)" }}>
                  <b>KESHAV</b>
                </h2>
              </div>
              <div className="svg">
                <i className="bi bi-airplane-fill"></i>
              </div>
            </div>
            <p className="footer-text">
              Elevate your experience with premium travel solutions, offering seamless and memorable journeys.
            </p>
          </div>
          <div className="footer-contact">
            <h4 className="contact-title">Contact Us</h4>
            <p className="contact-text">Feel free to reach out to us!</p>
            <ul>
              <li className="contact-item">
                <ion-icon name="call-outline"></ion-icon>
                <a href="tel:+919692058554" className="contact-link">+91 9692058554</a>
              </li>
              <li className="contact-item">
                <ion-icon name="mail-outline"></ion-icon>
                <a href="mailto:info@keshav.com" className="contact-link">info@keshav.com</a>
              </li>
              <li className="contact-item">
                <ion-icon name="location-outline"></ion-icon>
                <address>Patia, Bhubaneswar, India</address>
              </li>
            </ul>
          </div>
          <div className="footer-form">
            <p className="form-text">Subscribe to our newsletter for updates and news!</p>
            <form className="form-wrapper">
              <input
                type="email"
                name="email"
                className="input-field"
                placeholder="Enter Your Email"
                required
              />
              <button type="submit" className="btn btn-secondary">Subscribe</button>
            </form>
          </div>
          <div className="footer-social">
            <ul className="social-list">
              {socialLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${link.name}`}
                  >
                    <ion-icon name={link.icon}></ion-icon>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">
            &copy; {new Date().getFullYear()} <a href="#">codewithtechnotribe</a>. All rights reserved.
          </p>
          <ul className="footer-bottom-list">
            {footerLinks.map((link, index) => (
              <li key={index}>
                <a href={link.url} className="footer-bottom-link">{link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
