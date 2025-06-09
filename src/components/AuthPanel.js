import React, { useState } from "react";
import "./AuthPanel.css";
import { auth, googleProvider, githubProvider, facebookProvider, linkedinProvider } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function AuthPanel({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  // Animated panel switch
  const togglePanel = () => {
    setIsLogin((prev) => !prev);
    setError("");
    setEmail("");
    setPassword("");
    setUsername("");
  };

  // Email/Password login/register
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Optionally save username to Firestore here
      setUser(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  // Social login
  const handleSocialLogin = async (provider) => {
    setError("");
    try {
      const userCredential = await signInWithPopup(auth, provider);
      setUser(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="auth-bg"
      style={{
        background: "url('/food-bg.jpg') center/cover no-repeat",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div className={`panel-container ${isLogin ? "" : "switch"}`}>
        {/* Register Side */}
        <div className="panel left-panel">
          <div className="content">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button className="panel-btn" onClick={togglePanel}>
              Register
            </button>
          </div>
        </div>
        {/* Login Side */}
        <div className="panel right-panel">
          <div className="content">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="panel-btn" onClick={togglePanel}>
              Login
            </button>
          </div>
        </div>
        {/* Login Form */}
        <form className={`form login-form ${isLogin ? "active" : ""}`} onSubmit={handleLogin}>
          <h2>Login</h2>
          <div className="input-field">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <span className="icon">&#128100;</span>
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span className="icon">&#128274;</span>
          </div>
          <a href="#" className="forgot-password">Forgot Password?</a>
          <button type="submit" className="form-btn">Login</button>
          <p className="or-social">or login with social platforms</p>
          <div className="social-icons">
            <button type="button" onClick={() => handleSocialLogin(googleProvider)}><span className="icon">G</span></button>
            <button type="button" onClick={() => handleSocialLogin(facebookProvider)}><span className="icon">f</span></button>
            <button type="button" onClick={() => handleSocialLogin(githubProvider)}><span className="icon">&#xf09b;</span></button>
            <button type="button" onClick={() => handleSocialLogin(linkedinProvider)}><span className="icon">in</span></button>
          </div>
          {error && isLogin && <div className="error">{error}</div>}
        </form>
        {/* Register Form */}
        <form className={`form register-form ${!isLogin ? "active" : ""}`} onSubmit={handleRegister}>
          <h2>Registration</h2>
          <div className="input-field">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <span className="icon">&#128100;</span>
          </div>
          <div className="input-field">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <span className="icon">&#9993;</span>
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span className="icon">&#128274;</span>
          </div>
          <button type="submit" className="form-btn">Register</button>
          <p className="or-social">or login with social platforms</p>
          <div className="social-icons">
            <button type="button" onClick={() => handleSocialLogin(googleProvider)}><span className="icon">G</span></button>
            <button type="button" onClick={() => handleSocialLogin(facebookProvider)}><span className="icon">f</span></button>
            <button type="button" onClick={() => handleSocialLogin(githubProvider)}><span className="icon">&#xf09b;</span></button>
            <button type="button" onClick={() => handleSocialLogin(linkedinProvider)}><span className="icon">in</span></button>
          </div>
          {error && !isLogin && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}