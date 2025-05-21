import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, requiredRole }) => {
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth.php`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        setUsername(data.username);
        setRole(data.role);
      } catch (error) {
        console.error("Error validating user:", error);
        setUsername(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!username) {
    console.warn("User not logged in, redirecting...");
    return <Navigate to="/" replace />;
  }

  if (role === "admin") {
    return element;
  }

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(role) ? element : <Navigate to="/" replace />;
  }

  return role === requiredRole ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;
