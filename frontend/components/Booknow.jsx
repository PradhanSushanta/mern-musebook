import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const museums = [
  "National Museum",
  "Salar Jung Museum",
  "Victoria Memorial",
  "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
  "Calico Museum of Textiles",
];

const Booknow = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Set today's date in YYYY-MM-DD format
  const todayStr = new Date().toISOString().split("T")[0];

  // Get selected museum from navigation state (if any)
  const selectedMuseum = location.state?.selectedMuseum || museums[0];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    visit_date: todayStr, // Default to current date
    museum: selectedMuseum, // Use selected museum from state
    adults: 0,
    children: 0,
  });
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  // Fetch ticket availability when museum or date changes
  useEffect(() => {
    if (!form.visit_date) return;
    setLoading(true);
    fetch(`https://mern-musebook.onrender.com/api/availability?visit_date=${form.visit_date}`)
      .then((res) => res.json())
      .then((data) => {
        setAvailability(data);
        setLoading(false);
      })
      .catch(() => {
        setAvailability({});
        setLoading(false);
      });
  }, [form.visit_date]);

  useEffect(() => {
    setTotal(form.adults * 120 + form.children * 60);
  }, [form.adults, form.children]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "adults" || name === "children" ? Number(value) : value,
    }));
  };

  const handleTicketChange = (type, delta) => {
    setForm((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  const validate = () => {
    if (!form.name || !form.email || !form.phone || !form.visit_date || !form.museum)
      return "Please fill in all required fields.";
    if (form.adults + form.children === 0)
      return "Please select at least one ticket.";
    if (!/^[a-zA-Z\s]+$/.test(form.name))
      return "Name must contain only letters and spaces!";
    if (
      !/^[a-z]+(?:\.[a-z]+)*[a-z0-9]*@[a-z0-9]+\.[a-z]{2,}$/.test(form.email) ||
      form.email.length < 16 ||
      form.email.length > 40
    )
      return "Invalid email format or length!";
    if (
      !/^[6-9]\d{9}$/.test(form.phone) ||
      /^(\d)\1{9}$/.test(form.phone) ||
      /(\d)\1{3,}/.test(form.phone)
    )
      return "Invalid phone number!";
    if (new Date(form.visit_date) < new Date(new Date().setHours(0, 0, 0, 0)))
      return "Visit date must be today or a future date!";
    if (
      availability[form.museum] !== undefined &&
      form.adults + form.children > availability[form.museum]
    )
      return `Only ${availability[form.museum]} tickets available for ${form.museum} on ${form.visit_date}.`;
    return "";
  };

  // Razorpay handler
  const handlePayment = async () => {
    try {
      // Prepare payment payload
      const payPayload = {
        billing_name: form.name,
        billing_email: form.email,
        billing_mobile: form.phone,
        shipping_name: form.name,
        shipping_email: form.email,
        shipping_mobile: form.phone,
        paymentOption: 'museum_ticket',
        payAmount: total,
        action: 'payOrder'
      };

      // Get order details from backend
      const payRes = await fetch('https://mern-musebook.onrender.com/api/payOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payPayload)
      });
      const payData = await payRes.json();

      if (payData.res !== 'success') {
        setError(payData.info || 'Payment initialization failed.');
        return;
      }

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise(resolve => {
          script.onload = resolve;
        });
      }

      // Open Razorpay checkout
      const options = {
        key: payData.razorpay_key,
        amount: payData.userData.amount * 100,
        currency: 'INR',
        name: 'Museum Ticket Booking',
        description: payData.userData.description,
        order_id: payData.userData.rpay_order_id,
        handler: async function (response) {
          // Store booking after payment
          const bookingPayload = {
            name: form.name,
            email: form.email,
            phone: form.phone,
            visit_date: form.visit_date,
            museum: form.museum,
            adults: form.adults,
            children: form.children,
            total: total,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          };
          await fetch('https://mern-musebook.onrender.com/api/bookMuseum', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingPayload)
          });
          alert('Payment successful! Booking stored.');
          navigate("/booknow");
          window.location.reload();
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone
        },
        theme: { color: '#4361ee' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }
    setError("");
    handlePayment();
  };

  return (
    
    <div className="container" style={{ maxWidth: 1000, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
      {/* Home Button */}
      
      <button
        className="btn btn-primary"
        style={{ marginBottom: "1rem" }}
        onClick={() => navigate("/home")}
      >
        Home
      </button>
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#3f37c9", marginBottom: "0.5rem", fontWeight: 700 }}>Museum Ticket Booking</h1>
        <p className="subtitle" style={{ color: "#6c757d", fontSize: "1.1rem", marginBottom: "2rem" }}>
          Explore the wonders of history and culture with our easy booking system
        </p>
      </header>
      <form onSubmit={handleSubmit} className="booking-card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div className="form-section" style={{ background: "#f8f9fa", padding: "1.5rem", borderRadius: 12 }}>
          <h2 style={{ fontSize: "1.5rem", color: "#3f37c9", marginBottom: "1.5rem", paddingBottom: "0.5rem", borderBottom: "2px solid #4895ef" }}>
            Visitor Information
          </h2>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your.email@example.com" required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" required />
          </div>
          <div className="form-group">
            <label>Visit Date</label>
            <input type="date" name="visit_date" value={form.visit_date} min={new Date().toISOString().split("T")[0]} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Select Museum</label>
            <select name="museum" value={form.museum} onChange={handleChange} required>
              {museums.map((m) => (
                <option key={m} value={m} disabled={availability[m] === 0}>
                  {m}
                  {availability[m] === 0 ? " (Sold Out)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="availability-box" style={{ marginTop: "1rem", padding: "1rem", border: "2px solid #6c757d", borderRadius: 8, background: "#f8f9fa" }}>
            <h3 style={{ marginBottom: "0.5rem", fontSize: "1.25rem", color: "#495057" }}>Available Tickets</h3>
            <p>
              {loading
                ? "Loading..."
                : form.visit_date && availability[form.museum] !== undefined
                ? `${availability[form.museum]} tickets available for ${form.museum} on ${form.visit_date}.`
                : "Select a museum and date to see availability."}
            </p>
          </div>
          <h2 style={{ marginTop: "2rem" }}>Ticket Selection</h2>
          <div className="ticket-selector" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", padding: "1rem", borderRadius: 8, marginBottom: "1rem" }}>
            <div className="ticket-info">
              <h3>Adult Ticket</h3>
              <p>₹120 per person (Age 12+)</p>
            </div>
            <div className="ticket-controls" style={{ display: "flex", alignItems: "center" }}>
              <button type="button" className="ticket-btn" onClick={() => handleTicketChange("adults", -1)} disabled={form.adults === 0}>-</button>
              <span className="ticket-count" style={{ margin: "0 1rem", fontWeight: 600 }}>{form.adults}</span>
              <button type="button" className="ticket-btn" onClick={() => handleTicketChange("adults", 1)}>+</button>
            </div>
          </div>
          <div className="ticket-selector" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", padding: "1rem", borderRadius: 8, marginBottom: "1rem" }}>
            <div className="ticket-info">
              <h3>Child Ticket</h3>
              <p>₹60 per person (Under 12)</p>
            </div>
            <div className="ticket-controls" style={{ display: "flex", alignItems: "center" }}>
              <button type="button" className="ticket-btn" onClick={() => handleTicketChange("children", -1)} disabled={form.children === 0}>-</button>
              <span className="ticket-count" style={{ margin: "0 1rem", fontWeight: 600 }}>{form.children}</span>
              <button type="button" className="ticket-btn" onClick={() => handleTicketChange("children", 1)}>+</button>
            </div>
          </div>
        </div>
        <div className="summary-section" style={{ background: "linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)", padding: "1.5rem", borderRadius: 12, color: "#fff" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", paddingBottom: "0.5rem", borderBottom: "2px solid rgba(255,255,255,0.2)" }}>Booking Summary</h2>
          <div className="museum-card" style={{ background: "rgba(255,255,255,0.1)", padding: "1rem", borderRadius: 8, marginBottom: "1.5rem", display: "flex", alignItems: "center" }}>
            <div className="museum-icon" style={{ fontSize: "2rem", marginRight: "1rem", color: "#fff" }}>
              <span role="img" aria-label="museum">🏛️</span>
            </div>
            <div className="museum-info">
              <h3>{form.museum || "Select a Museum"}</h3>
              <p>{form.visit_date || "Select a date"}</p>
            </div>
          </div>
          <div className="ticket-summary">
            {form.adults > 0 && (
              <div className="ticket-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <span>Adult Tickets (x{form.adults}):</span>
                <span>₹{form.adults * 120}</span>
              </div>
            )}
            {form.children > 0 && (
              <div className="ticket-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <span>Child Tickets (x{form.children}):</span>
                <span>₹{form.children * 60}</span>
              </div>
            )}
          </div>
          <div className="total-amount" style={{ fontSize: "1.5rem", fontWeight: 700, margin: "1.5rem 0", textAlign: "right" }}>
            ₹{total}
          </div>
          <button className="btn" style={{ display: "inline-block", padding: "12px 24px", background: "#f72585", color: "#fff", border: "none", borderRadius: 8, fontSize: "1rem", fontWeight: 600, cursor: "pointer", width: "100%", textAlign: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            Proceed to Secure Payment
          </button>
          <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.8rem", opacity: 0.8 }}>
            <span role="img" aria-label="secure">🛡️</span> Your information is secure with us
          </div>
          {error && <div style={{ color: "#ef233c", marginTop: "1rem" }}>{error}</div>}
        </div>
      </form>
    </div>
  );
};

export default Booknow;