import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";

import About from "./About";
import Footer from "./Footer";
import "../src/index.css"
const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Protect the Home component on direct access or back button
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
    <Navbar />
    <section className="hero" id="home">
      <div className="container">
        <h2 className="h1 hero-title">Journey to explore India</h2>
        <p className="hero-text">
          {/* Add descriptive text here */}
        </p>
        <div className="btn-group">
          <button className="btn btn-primary">Learn more</button>
          <Link to="/booknow" className="btn btn-secondary">
            Book Now
          </Link>
        </div>
      </div>
    </section>

    {/* Include About Us section with id */}
    <section id="about">
      <About />
    </section>

    {/* Include Contact Us section with id */}
    <section id="footer">
      <Footer />
    </section>
  </>
  );
};

export default Home;
