import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "../components/Home";

import Destination from "../components/Destination";
import Login from "../components/Login";
import Signup from "../components/signup";
import ProtectedRoute from "../components/ProtectedRoute";
import PackageSection from "../components/PackageSection";
import GallerySection from "../components/GallerySection";
import Booknow from "../components/Booknow";

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
        <Route path="/booknow" element={<Booknow />} />
        <Route element={<ProtectedRoute />}>
          
          <Route path="/destination" element={<Destination />} />
          <Route path="/package" element={<PackageSection />} />
          <Route path="/gallery-section" element={<GallerySection />} />
        </Route>
      </Routes>
    </Router>
    </>
  );
};

export default App;