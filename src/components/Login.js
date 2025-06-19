import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import foodBg from "../assets/food-bg.jpg";
import "./Login.css";

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Replace with your actual authentication logic
    if (form.email === "" || form.password === "") {
      setError("Please enter both email and password.");
      return;
    }
    try {
      // Example: await signInWithEmailAndPassword(auth, form.email, form.password)
      // setUser(user); // set user on success
      // navigate("/nutrify.ai");
      // For demo purposes only:
      setUser({ email: form.email });
      navigate("/nutrify.ai");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="login-bg"
      style={{
        minHeight: "100vh",
        background: `url(${foodBg}) no-repeat center center/cover`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div className="login-card">
        <div className="login-left">
          <h1>Welcome to NutrifyAI!</h1>
          <p>
            Track your meals and unlock personalized nutrition insights. <br />
            New here?
          </p>
          <Link to="/register">
            <button className="register-btn">Register</button>
          </Link>
        </div>
        <div className="login-right">
          <h2>Login to your account</h2>
          <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
            {error && <div className="login-error">{error}</div>}
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
                <i className="fa-solid fa-envelope"></i>
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
                <i className="fa-solid fa-lock"></i>
              </span>
            </div>
            <div className="forgot-row">
              <span className="forgot">Forgot password?</span>
            </div>
            <button className="login-btn" type="submit">
              Login
            </button>
            <div className="login-or">or login with social platforms</div>
            <div className="login-socials">
              <button type="button"><i className="fa-brands fa-google"></i></button>
              <button type="button"><i className="fa-brands fa-facebook-f"></i></button>
              <button type="button"><i className="fa-brands fa-github"></i></button>
              <button type="button"><i className="fa-brands fa-linkedin-in"></i></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}