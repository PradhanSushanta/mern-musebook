import { useNavigate } from "react-router-dom";

const Destination = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Destination Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Destination;
