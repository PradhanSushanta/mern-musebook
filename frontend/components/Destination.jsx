import { useNavigate } from "react-router-dom";
import React from 'react';
import { IonIcon } from '@ionic/react';
import { star, logOutOutline, homeOutline } from 'ionicons/icons';

const destinations = [
  {
    img: 'popular5.jpg',
    alt: 'Salar jung Museum',
    city: 'Hyderabad',
    title: 'Salar jung Museum',
    description: 'One of the largest one-man collections of antiques in the world.',
  },
  {
    img: 'popular6.jpg',
    alt: 'Odisha State Museum',
    city: 'Bhubaneswar',
    title: 'Odisha State Museum',
    description: 'One of the most prominent museums in the state of Odisha, India.',
  },
  {
    img: 'popular4.jpg',
    alt: 'National Museum',
    city: 'New Delhi',
    title: 'National Museum',
    description: 'One of the largest museums in India.',
  },
];


const Destination = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <section className="popular" id="destination">
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


        <p className="section-subtitle">Uncover place</p>
        <h2 className="h2 section-title">Popular destination</h2>
        <p className="section-text"></p>

        <ul className="popular-list">
          {destinations.map((dest, index) => (
            <li key={index}>
              <div className="popular-card">
                <figure className="card-img">
                  <img src={`/images/${dest.img}`} alt={dest.alt} loading="lazy" />
                </figure>
                <div className="card-content">
                  <div className="card-rating">
                    {[...Array(5)].map((_, i) => (
                      <IonIcon icon={star} key={i} />
                    ))}
                  </div>
                  <p className="card-subtitle">
                    <a href="#">{dest.city}</a>
                  </p>
                  <h3 className="h3 card-title">
                    <a href="#">{dest.title}</a>
                  </h3>
                  <p className="card-text">{dest.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button className="btn btn-primary" onClick={() => window.location.href = 'destination.html'}>
          More destination
        </button>
      </div>
    </section>
  );
};

export default Destination;
