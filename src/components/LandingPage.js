import { Link } from "react-router-dom";
import Hero from "./hro"; // Change to "./Hero" if you rename hro.js to Hero.js
import foodBg from "../assets/food-bg.jpg";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <main
      className="landing-bg"
      style={{
        minHeight: "100vh",
        background: `url(${foodBg}) no-repeat center center/cover`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div className="landing-card">
        <div className="landing-header">
          <h1>NutrifyAI</h1>
          <p>
            Effortlessly track your meals, receive AI-powered nutrition advice, and reach your health goals with ease.
          </p>
        </div>
        <section className="landing-intro-section">
          <Hero />
          <h2>Welcome to NutrifyAI</h2>
          <p>
            Easily track what you eat, get personalized nutrition tips, and stay on top of your health goals with our smart, simple tool.
          </p>
          <div className="cta-links">
            <Link to="/register" className="landing-btn">Sign Up Free</Link>
            <Link to="/login" className="landing-btn secondary">Log In</Link>
          </div>
        </section>
      </div>
    </main>
  );
}