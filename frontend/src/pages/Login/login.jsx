// src/pages/Login/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Login = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState("Sign Up"); // "Sign Up" or "Login"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (authMode === "Sign Up" && !formData.agree) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    setLoading(true);
    try {
      let response;

      if (authMode === "Sign Up") {
        response = await axios.post("http://localhost:8000/api/v1/auth/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await axios.post("http://localhost:8000/api/v1/auth/login", {
          email: formData.email,
          password: formData.password,
        });
      }

      // Assuming backend returns JWT token
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      onLogin(user); // Update App.js state
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.detail || "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <h1>{authMode}</h1>

          {authMode === "Sign Up" && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {authMode === "Sign Up" && (
            <div className="checkbox">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
              />
              <p>Agree to the terms and conditions</p>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : authMode}
          </button>

          <div className="switch-state">
            {authMode === "Sign Up" ? (
              <p>
                Already have an account?{" "}
                <span onClick={() => setAuthMode("Login")} className="clickable">
                  Click here
                </span>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <span onClick={() => setAuthMode("Sign Up")} className="clickable">
                  Sign up now
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
