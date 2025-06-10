import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import AuthPanel from './components/AuthPanel';

// Dummy nutrition data (can replace with your own or load from JSON)
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
  const [user, setUser] = useState(null);
  const [selectedFood, setSelectedFood] = useState("");
  const [image, setImage] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  // Listen for Firebase auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Fetch meal history from Firestore for current user
  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }
    fetchMeals();
    // eslint-disable-next-line
  }, [user]);

  // --- Firestore Logic ---

  async function saveMealToFirestore(food, nutrition, from = "dropdown") {
    if (!user) return;
    try {
      await addDoc(collection(db, "meals"), {
        uid: user.uid,
        food,
        nutrition,
        date: new Date().toISOString(),
        from,
      });
    } catch (e) {
      setError("Error saving meal: " + e.message);
    }
  }

  async function fetchMeals() {
    if (!user) return;
    setLoadingHistory(true);
    setError("");
    try {
      const q = query(
        collection(db, "meals"),
        where("uid", "==", user.uid),
        orderBy("date", "desc")
      );
      const querySnapshot = await getDocs(q);
      const meals = querySnapshot.docs.map(doc => doc.data());
      setHistory(meals);
    } catch (e) {
      setError("Error fetching meals: " + e.message);
    }
    setLoadingHistory(false);
  }

  async function clearHistoryFromFirestore() {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete ALL your meals? This cannot be undone.")) return;
    setLoadingHistory(true);
    setError("");
    try {
      const q = query(collection(db, "meals"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const deletions = querySnapshot.docs.map((d) => deleteDoc(doc(db, "meals", d.id)));
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

  // --- Render ---

  // If user not logged in, show AuthPanel component
  if (!user) return (
    <div className="container">
      <h1>Nutrify AI </h1>
      <h5>hf</h5>
      <div className="card">
        <AuthPanel setUser={setUser} />
      </div>
    </div>
  );

  // Logout handler
  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

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
      </footer>
    </div>
  );
}