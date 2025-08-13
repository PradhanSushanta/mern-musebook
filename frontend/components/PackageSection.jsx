import React from 'react';
import { IonIcon } from '@ionic/react';
import { time, people, location, star, logOutOutline, homeOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';

const museums = [
  {
    img: 'pokemon2.jpg',
    alt: 'Victoria Memorial',
    title: 'Victoria Memorial',
    description: 'A grand marble building housing a museum with a collection of British colonial artifacts, paintings, and documents.',
    time: '8AM-10PM',
    nop: '10',
    place: 'Kolkata',
    reviews: 25,
    price: '₹120',
  },
  {
    img: 'pokemon.jpg',
    alt: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya',
    title: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya',
    description: 'A premier museum in Mumbai, known for its collection of ancient Indian art, sculptures, and artifacts.',
    time: '10AM-9PM',
    nop: '10',
    place: 'Mumbai',
    reviews: 20,
    price: '₹120',
  },
  {
    img: 'pokemon1.jpg',
    alt: 'Calico Museum of Textiles',
    title: 'Calico Museum of Textiles',
    description: 'A museum dedicated to the history and art of Indian textiles, particularly focusing on the rich textile traditions of Gujarat.',
    time: '9AM-7PM',
    nop: '10',
    place: 'Ahmedabad',
    reviews: 40,
    price: '₹120',
  },
];

const PackageSection = () => {
  const navigate = useNavigate();

  const redirectToBooking = (museumName) => {
    navigate("/booknow", { state: { selectedMuseum: museumName } });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <section className="package" id="package">
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


        <p className="section-subtitle">Checkout Our</p>
        <h2 className="h2 section-title">Museum Ticket Prices</h2>
        <p className="section-text">
          We offer a variety of ticket options to make your visit accessible and enjoyable. General admission is available for all age groups, with discounted rates for students and senior citizens. Children under the age of 5 can enter free of charge. We also provide special pricing for school visits and group bookings. Ticket prices may vary depending on the museum or exhibition, so please check the details below before planning your visit.
        </p>

        <ul className="package-list">
          {museums.map((museum, index) => (
            <li key={index}>
              <div className="package-card">
                <figure className="card-banner">
                  <img src={`/images/${museum.img}`} alt={museum.alt} loading="lazy" />
                </figure>

                <div className="card-content">
                  <h3 className="h3 card-title">{museum.title}</h3>
                  <p className="card-text">{museum.description}</p>

                  <ul className="card-meta-list">
                    <li className="card-meta-item">
                      <div className="meta-box">
                        <IonIcon icon={time} />
                        <p className="text">{museum.time}</p>
                      </div>
                    </li>
                    <li className="card-meta-item">
                      <div className="meta-box">
                        <IonIcon icon={people} />
                        <p className="text">NOP: {museum.nop}</p>
                      </div>
                    </li>
                    <li className="card-meta-item">
                      <div className="meta-box">
                        <IonIcon icon={location} />
                        <p className="text">{museum.place}</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="card-price">
                  <div className="wrapper">
                    <p className="reviews">({museum.reviews} reviews)</p>
                    <div className="card-rating">
                      {[...Array(5)].map((_, i) => (
                        <IonIcon icon={star} key={i} />
                      ))}
                    </div>
                  </div>

                  <p className="price">
                    {museum.price}
                    <span>/ per person</span>
                  </p>

                  <button
                    className="btn btn-secondary"
                    onClick={() => redirectToBooking(museum.title)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = 'viewalltickets.html')}
        >
          View All Tickets
        </button>
      </div>
    </section>
  );
};

export default PackageSection;
