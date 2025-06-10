import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AuthPanel from './components/AuthPanel';
import "./LandingPage.css";

// ----- Dummy nutrition data -----
const nutritionData = [
  { name: "Paneer Butter Masala", calories: 320, protein: 12, fat: 25, carbs: 12 },
  { name: "Chicken Biryani", calories: 290, protein: 16, fat: 8, carbs: 38 },
  { name: "Dal Tadka", calories: 180, protein: 9, fat: 7, carbs: 22 },
  { name: "Roti", calories: 70, protein: 2.5, fat: 0.4, carbs: 15 },
  { name: "Idli", calories: 39, protein: 1.6, fat: 0.2, carbs: 7.4 },
  { name: "Dosa", calories: 133, protein: 2.7, fat: 2.8, carbs: 25 },
  { name: "Rajma Chawal", calories: 220, protein: 7, fat: 4, carbs: 40 },
  { name: "Aloo Paratha", calories: 210, protein: 4, fat: 9, carbs: 28 },
  { name: "Chole Bhature", calories: 427, protein: 13, fat: 16, carbs: 58 },
];

export default function App() {
  // All hooks at the top
  const [showApp, setShowApp] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedFood, setSelectedFood] = useState("");
  const [image, setImage] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  // Firestore and Auth imports (dynamic for SSR safety)
  const [firebase, setFirebase] = useState({});
  useEffect(() => {
    if (showApp) {
      import("./firebase").then(mod => setFirebase(mod));
    }
  }, [showApp]);

  // Listen for Firebase auth state
  useEffect(() => {
    if (!showApp || !firebase.auth) return;
    const unsub = firebase.auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub && unsub();
  }, [showApp, firebase.auth]);

  // Fetch meal history from Firestore for current user
  useEffect(() => {
    if (!showApp || !firebase.db || !user) {
      setHistory([]);
      return;
    }
    fetchMeals();
    // eslint-disable-next-line
  }, [user, firebase.db, showApp]);

  // --- Firestore Logic ---
  async function saveMealToFirestore(food, nutritionVal, from = "dropdown") {
    if (!user || !firebase.db) return;
    try {
      await firebase.addDoc(firebase.collection(firebase.db, "meals"), {
        uid: user.uid,
        food,
        nutrition: nutritionVal,
        date: new Date().toISOString(),
        from,
      });
    } catch (e) {
      setError("Error saving meal: " + e.message);
    }
  }

  async function fetchMeals() {
    if (!user || !firebase.db) return;
    setLoadingHistory(true);
    setError("");
    try {
      const q = firebase.query(
        firebase.collection(firebase.db, "meals"),
        firebase.where("uid", "==", user.uid),
        firebase.orderBy("date", "desc")
      );
      const querySnapshot = await firebase.getDocs(q);
      const meals = querySnapshot.docs.map(doc => doc.data());
      setHistory(meals);
    } catch (e) {
      setError("Error fetching meals: " + e.message);
    }
    setLoadingHistory(false);
  }

  async function clearHistoryFromFirestore() {
    if (!user || !firebase.db) return;
    if (!window.confirm("Are you sure you want to delete ALL your meals? This cannot be undone.")) return;
    setLoadingHistory(true);
    setError("");
    try {
      const q = firebase.query(firebase.collection(firebase.db, "meals"), firebase.where("uid", "==", user.uid));
      const querySnapshot = await firebase.getDocs(q);
      const deletions = querySnapshot.docs.map((d) =>
        firebase.deleteDoc(firebase.doc(firebase.db, "meals", d.id))
      );
      await Promise.all(deletions);
      setHistory([]);
      alert("All your meals have been deleted!");
    } catch (e) {
      setError("Error deleting meals: " + e.message);
    }
    setLoadingHistory(false);
  }

  function handleDropdown(e) {
    const food = e.target.value;
    setSelectedFood(food);
    setNutrition(nutritionData.find((item) => item.name === food));
    setImage(null);
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
      setSelectedFood("");
      setNutrition(null);
    }
  }

  async function simulateAIRecognition() {
    const food = nutritionData[Math.floor(Math.random() * nutritionData.length)].name;
    const nutri = nutritionData.find((item) => item.name === food);
    setSelectedFood(food);
    setNutrition(nutri);
    await saveMealToFirestore(food, nutri, "AI");
    fetchMeals();
  }

  async function addDropdownMeal() {
    if (!selectedFood) return;
    await saveMealToFirestore(selectedFood, nutrition, "dropdown");
    fetchMeals();
  }

  // Logout handler
  async function handleLogout() {
    if (firebase.auth) {
      await firebase.auth.signOut();
      setUser(null);
    }
  }

  // ---- LANDING PAGE ----
  if (!showApp) {
    return (
      <div>
        {/* HERO */}
        <section className="hero-section">
          <motion.h1
            initial={{ opacity: 0, y: -35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Nutrify AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Track your Indian meals, see instant nutrition, and get AI-powered food insights.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.08 }}
            className="cta-btn"
            onClick={() => setShowApp(true)}
            transition={{ type: "spring", stiffness: 200 }}
          >
            Get Started
          </motion.button>
        </section>
        {/* FEATURES */}
        <section className="features-section">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Why Nutrify AI?
          </motion.h2>
          <div className="features-list">
            <motion.div className="feature-card" whileHover={{ scale: 1.04 }}>
              <span role="img" aria-label="camera" className="feature-icon">📸</span>
              <h3>Photo Recognition</h3>
              <p>Snap a meal photo, let AI detect what you ate, and log it in seconds!</p>
            </motion.div>
            <motion.div className="feature-card" whileHover={{ scale: 1.04 }}>
              <span role="img" aria-label="nutrition" className="feature-icon">🥗</span>
              <h3>Instant Nutrition</h3>
              <p>Get calories, protein, fat, and carbs for popular Indian foods, instantly.</p>
            </motion.div>
            <motion.div className="feature-card" whileHover={{ scale: 1.04 }}>
              <span role="img" aria-label="ai" className="feature-icon">🤖</span>
              <h3>AI Meal Log</h3>
              <p>Let our AI assistant help you build healthy eating habits over time.</p>
            </motion.div>
          </div>
        </section>
        {/* HOW IT WORKS */}
        <section className="how-section">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            How It Works
          </motion.h2>
          <ol>
            <motion.li initial={{x: -20, opacity: 0}} whileInView={{x: 0, opacity:1}} transition={{delay:0.2}}>Sign up or log in securely</motion.li>
            <motion.li initial={{x: -20, opacity: 0}} whileInView={{x: 0, opacity:1}} transition={{delay:0.4}}>Upload a meal photo or pick a dish</motion.li>
            <motion.li initial={{x: -20, opacity: 0}} whileInView={{x: 0, opacity:1}} transition={{delay:0.6}}>Get instant nutrition info and AI feedback</motion.li>
          </ol>
        </section>
        {/* ABOUT */}
        <section className="about-section">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>About</motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Nutrify AI is your companion for tracking Indian meals and making healthier food choices. Built with React, Firebase, and a pinch of AI magic!
          </motion.p>
        </section>
        {/* FOOTER */}
        <footer style={{ padding: "2em 0", textAlign: "center", color: "#888" }}>
          <p>© {new Date().getFullYear()} Nutrify AI &middot; Built by You!</p>
          <p style={{ fontSize: "0.9em" }}>Ready to start? <span className="cta-link" onClick={() => setShowApp(true)}>Sign up or log in</span></p>
        </footer>
      </div>
    );
  }

  // ---- APP PANEL: AUTH ----
  if (!user) return (
    <div className="container">
      <h1>Nutrify AI</h1>
      <div className="card">
        <AuthPanel setUser={setUser} />
      </div>
      <button className="back-btn" onClick={() => setShowApp(false)}>← Back to Landing Page</button>
    </div>
  );

  // ---- MAIN APP ----
  return (
    <div className="container">
      <h1>Indian Meal Nutrition Tracker 🥗</h1>
      <div className="card">
        <p>Welcome, {user.email || user.displayName}</p>
        <button className="logout-btn" onClick={handleLogout} style={{float: "right", marginTop: "-2.5em"}}>Logout</button>
        <h2>1. Upload Meal Photo or Select Food</h2>
        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImage} />
        <button className="upload-btn" onClick={() => fileInputRef.current.click()}>Upload Photo</button>
        {image && (
          <div className="img-preview">
            <img src={image} alt="Preview" style={{ maxHeight: 120, borderRadius: 8 }} />
            <button className="ai-btn" onClick={simulateAIRecognition}>Identify Food with AI</button>
          </div>
        )}
        <div className="or">OR</div>
        <select value={selectedFood} onChange={handleDropdown}>
          <option value="">Select Indian Food</option>
          {nutritionData.map((food) => (
            <option key={food.name}>{food.name}</option>
          ))}
        </select>
        <button className="add-btn" disabled={!selectedFood} onClick={addDropdownMeal}>Add Meal</button>
      </div>

      {nutrition && (
        <div className="card nutrition">
          <h2>Nutrition Details</h2>
          <div className="nutrition-grid">
            <div><b>Food:</b> {selectedFood}</div>
            <div><b>Calories:</b> {nutrition.calories} kcal</div>
            <div><b>Protein:</b> {nutrition.protein} g</div>
            <div><b>Fat:</b> {nutrition.fat} g</div>
            <div><b>Carbs:</b> {nutrition.carbs} g</div>
          </div>
        </div>
      )}

      <div className="card history">
        <h2>Meal History</h2>
        {loadingHistory ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <p>No meals tracked yet.</p>
        ) : (
          <ul>
            {history.map((item, idx) => (
              <li key={idx}>
                <b>{item.food}</b> ({item.nutrition.calories} kcal) <small>{item.date?.replace("T", " ").slice(0, 19)}{item.from === "AI" && " [AI]"}</small>
              </li>
            ))}
          </ul>
        )}
        <button className="clear-btn" onClick={clearHistoryFromFirestore}>Clear History</button>
      </div>

      {error && (
        <div style={{ color: "red", margin: "1em 0" }}>
          {error}
        </div>
      )}

      <footer>
        <p style={{ fontSize: "0.9em", color: "#888" }}>
          Powered by React + Firebase Auth + Firestore.
        </p>
        <button className="back-btn" onClick={() => setShowApp(false)} style={{marginTop:"1em"}}>← Back to Landing Page</button>
      </footer>
    </div>
  );
}