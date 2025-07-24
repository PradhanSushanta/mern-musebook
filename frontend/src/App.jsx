import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "../components/Home";
import Gallery from "../components/Gallery";
import Destination from "../components/Destination";
import Login from "../components/Login";
import Signup from "../components/signup";
import ProtectedRoute from "../components/ProtectedRoute";

const App = () => {
  // const isAuthenticated = !!localStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

useEffect(() => {
  const checkAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
  window.addEventListener("storage", checkAuth);

  return () => window.removeEventListener("storage", checkAuth);
}, []);

 
  return (
    <>
    
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        

        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/destination" element={<Destination />} />
        </Route>
      </Routes>
    </Router>
    </>
  );
};

export default App;