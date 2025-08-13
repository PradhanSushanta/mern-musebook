import React from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { menuOutline, closeOutline, search, logoFacebook, logoTwitter, logoYoutube } from 'ionicons/icons';


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="overlay"></div>
      
      <div className="header-top">
        <div className="container">
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="Tourly logo" />
          </Link>
          
          <div className="header-btn-group" style={{ marginLeft: 'auto' }}>
            <button className="search-btn" aria-label="Search">
              <IonIcon icon={search} />
            </button>

            <button className="btn btn-secondary logout-btn" aria-label="Logout" onClick={handleLogout}>Logout</button>
            

            <button className="nav-open-btn" aria-label="Open Menu">
              <IonIcon icon={menuOutline} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="header-bottom">
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <ul className="social-list">
            <li><a href="#" className="social-link"><IonIcon icon={logoFacebook} /></a></li>
            <li><a href="#" className="social-link"><IonIcon icon={logoTwitter} /></a></li>
            <li><a href="#" className="social-link"><IonIcon icon={logoYoutube} /></a></li>
          </ul>
          
          <nav className="navbar">
            
            <ul className="navbar-list">
              <li><Link to="/" className="navbar-link">Home</Link></li>
              <li><a href="#about" className="navbar-link">About Us</a></li>
              <li><a href="#footer" className="navbar-link">Contact Us</a></li>
              
              
              
              <li><Link to="/destination" className="navbar-link">Destinations</Link></li>
              <li><Link to="/package" className="navbar-link">Packages</Link></li>
              <li><Link to="/gallery-section" className="navbar-link">Gallery</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
