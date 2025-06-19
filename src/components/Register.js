import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import foodBg from "../assets/food-bg.jpg";
import "./Register.css";

export default function Register({ setUser }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Registration logic here (call Firebase or your API)
    // On success: setUser(user) and navigate("/nutrify.ai");
  };

  return (
    <div
      className="register-bg"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: `url(${foodBg}) no-repeat center center/cover`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', Arial, sans-serif"
      }}
    >
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
          <h1>Registration</h1>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <span className="input-icon">
              <i className="fas fa-user"></i>
            </span>
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <span className="input-icon">
              <i className="fas fa-envelope"></i>
            </span>
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span className="input-icon">
              <i className="fas fa-lock"></i>
            </span>
          </div>
          <button className="register-btn" type="submit">Register</button>
          <div className="social-text">or login with social platforms</div>
          <div className="social-icons">
            <button type="button" className="icon-btn"><i className="fab fa-google"></i></button>
            <button type="button" className="icon-btn"><i className="fab fa-facebook-f"></i></button>
            <button type="button" className="icon-btn"><i className="fab fa-github"></i></button>
            <button type="button" className="icon-btn"><i className="fab fa-linkedin-in"></i></button>
          </div>
        </form>
        <div className="register-side">
          <h2>Welcome Back!</h2>
          <p>Already have an account?</p>
          <Link to="/login" className="login-btn">Login</Link>
        </div>
      </div>
    </div>
  );
}