import { motion } from "framer-motion";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero-section">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Meal Nutrition Tracker
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Track your meals. Get AI nutrition insights. Stay healthy, easily!
      </motion.p>
      <motion.button
        whileHover={{ scale: 1.08 }}
        className="cta-btn"
      >
        Get Started
      </motion.button>
    </section>
  );
}