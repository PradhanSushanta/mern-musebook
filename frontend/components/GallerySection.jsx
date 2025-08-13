import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logOutOutline, homeOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

const galleryImages = [
  'gallery-6.jpg',
  'gallery-7.jpg',
  'gallery-9.jpg',
  'gallery-8.jpg',
  'gallery-10.jpg',
];

const GallerySection = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <section className="gallery" id="gallery">
      <div className="container">
        {/* Navbar */}
        <nav
  style={{
    display: "flex",
    justifyContent: "space-between", // spreads items across left and right
    alignItems: "center",
    marginBottom: "1rem",
    background: "linear-gradient(135deg, #4b6cb7, #182848)",
    padding: "1rem 2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  }}
>
  {/* Home on the left */}
  <div>
    <button
      style={{
        all: "unset",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        backgroundColor: "hsl(34, 100%, 50%)", // light orange
        borderRadius: "8px",
        padding: "0.5rem 1rem",
        color: "#fff",
        fontSize: "1rem",
        cursor: "pointer",
      }}
      onClick={() => navigate("/home")}
    >
      <IonIcon icon={homeOutline} /> Home
    </button>
  </div>

  {/* Logout on the right */}
  <div>
    <button
      style={{
        all: "unset",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        backgroundColor: "#e74c3c", // red
        borderRadius: "8px",
        padding: "0.5rem 1rem",
        color: "#fff",
        fontSize: "1rem",
        cursor: "pointer",
      }}
      onClick={handleLogout}
    >
      <IonIcon icon={logOutOutline} /> Logout
    </button>
  </div>
</nav>


        <p className="section-subtitle">Photo Gallery</p>
        <h2 className="h2 section-title">Photo's From Visitors</h2>
        <p className="section-text">
          Discover the museum through the eyes of our visitors!
          From stunning exhibits to memorable moments, these snapshots capture the joy,
          curiosity, and wonder experienced by our guests.
          <br />
          <br />
          Want to be featured? Tag us in your photos or upload your favorite museum memories!
        </p>

        <ul className="gallery-list">
          {galleryImages.map((image, index) => (
            <li className="gallery-item" key={index}>
              <figure className="gallery-image">
                <img src={`/images/${image}`} alt={`Gallery image ${index + 1}`} loading="lazy" />
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default GallerySection;
