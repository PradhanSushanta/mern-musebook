import { useNavigate ,Link} from "react-router-dom";

const Gallery = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center text-3xl text-amber-300 gap-2 bg-emerald-700">
      <h1>Gallery Page</h1>
      <Link to="/home">home</Link> |
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Gallery;
