// import React, { useState } from "react";
// import "./AuthPanel.css";
// import { auth, googleProvider, githubProvider, facebookProvider, linkedinProvider } from "../firebase";
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";

// // ForgotPassword component (inline for simplicity)
// function ForgotPassword({ onBack }) {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleReset = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");
//     if (!email) {
//       setError("Please enter your email address.");
//       return;
//     }
//     try {
//       await sendPasswordResetEmail(auth, email);
//       setMessage("Password reset email sent! Check your inbox.");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="forgot-password-container">
//       <h2>Forgot Password</h2>
//       <form onSubmit={handleReset}>
//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           required
//         />
//         <button type="submit" className="form-btn">Send Reset Email</button>
//       </form>
//       {message && <div className="success">{message}</div>}
//       {error && <div className="error">{error}</div>}
//       <button className="panel-btn" style={{ marginTop: "1rem" }} onClick={onBack}>
//         Back to Login
//       </button>
//     </div>
//   );
// }

// export default function AuthPanel({ setUser }) {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [error, setError] = useState("");

//   // Animated panel switch
//   const togglePanel = () => {
//     setIsLogin((prev) => !prev);
//     setError("");
//     setEmail("");
//     setPassword("");
//     setUsername("");
//   };

//   // Email/Password login
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!email || !password) {
//       setError("Email and password are required.");
//       return;
//     }
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       setUser(userCredential.user);
//     } catch (err) {
//       console.log("Login error:", err.code, err.message);
//       setError(mapFirebaseError(err));
//     }
//   };

//   // Email/Password register
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!email || !password || !username) {
//       setError("Username, email, and password are required.");
//       return;
//     }
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       // Optionally save username to Firestore here
//       setUser(userCredential.user);
//     } catch (err) {
//       console.log("Register error:", err.code, err.message);
//       setError(mapFirebaseError(err));
//     }
//   };

//   // Social login
//   const handleSocialLogin = async (provider) => {
//     setError("");
//     try {
//       const userCredential = await signInWithPopup(auth, provider);
//       setUser(userCredential.user);
//     } catch (err) {
//       console.log("Social login error:", err.code, err.message);
//       setError(mapFirebaseError(err));
//     }
//   };

//   // Map Firebase errors to user-friendly messages
//   function mapFirebaseError(err) {
//     switch (err.code) {
//       case "auth/user-not-found":
//         return "No user found with this email. Please register first.";
//       case "auth/wrong-password":
//         return "Incorrect password.";
//       case "auth/email-already-in-use":
//         return "This email is already registered. Please log in.";
//       case "auth/invalid-email":
//         return "Invalid email address.";
//       case "auth/too-many-requests":
//         return "Too many requests. Please try again later.";
//       default:
//         return err.message;
//     }
//   }

//   return (
//     <div
//       className="auth-bg"
//       style={{
//         background: "url('/food-bg.jpg') center/cover no-repeat",
//         minHeight: "100vh",
//         width: "100vw",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center"
//       }}
//     >
//       {showForgotPassword ? (
//         <ForgotPassword onBack={() => setShowForgotPassword(false)} />
//       ) : (
//         <div className={`panel-container ${isLogin ? "" : "switch"}`}>
//           {/* Register Side */}
//           <div className="panel left-panel">
//             <div className="content">
//               <h1>Hello, Welcome!</h1>
//               <p>Don't have an account?</p>
//               <button className="panel-btn" onClick={togglePanel}>
//                 Register
//               </button>
//             </div>
//           </div>
//           {/* Login Side */}
//           <div className="panel right-panel">
//             <div className="content">
//               <h1>Welcome Back!</h1>
//               <p>Already have an account?</p>
//               <button className="panel-btn" onClick={togglePanel}>
//                 Login
//               </button>
//             </div>
//           </div>
//           {/* Login Form */}
//           <form className={`form login-form ${isLogin ? "active" : ""}`} onSubmit={handleLogin}>
//             <h2>Login</h2>
//             <div className="input-field">
//               <input
//                 type="text"
//                 placeholder="Email"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 required
//               />
//               <span className="icon">&#128100;</span>
//             </div>
//             <div className="input-field">
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 required
//               />
//               <span className="icon">&#128274;</span>
//             </div>
//             <a
//               href="#"
//               className="forgot-password"
//               onClick={e => {
//                 e.preventDefault();
//                 setShowForgotPassword(true);
//                 setError("");
//               }}
//             >
//               Forgot Password?
//             </a>
//             <button type="submit" className="form-btn">Login</button>
//             <p className="or-social">or login with social platforms</p>
//             <div className="social-icons">
//               <button type="button" onClick={() => handleSocialLogin(googleProvider)}><span className="icon">G</span></button>
//               <button type="button" onClick={() => handleSocialLogin(facebookProvider)}><span className="icon">f</span></button>
//               <button type="button" onClick={() => handleSocialLogin(githubProvider)}><span className="icon">&#xf09b;</span></button>
//               <button type="button" onClick={() => handleSocialLogin(linkedinProvider)}><span className="icon">in</span></button>
//             </div>
//             {error && isLogin && <div className="error">{error}</div>}
//           </form>
//           {/* Register Form */}
//           <form className={`form register-form ${!isLogin ? "active" : ""}`} onSubmit={handleRegister}>
//             <h2>Registration</h2>
//             <div className="input-field">
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={username}
//                 onChange={e => setUsername(e.target.value)}
//                 required
//               />
//               <span className="icon">&#128100;</span>
//             </div>
//             <div className="input-field">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 required
//               />
//               <span className="icon">&#9993;</span>
//             </div>
//             <div className="input-field">
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 required
//               />
//               <span className="icon">&#128274;</span>
//             </div>
//             <button type="submit" className="form-btn">Register</button>
//             <p className="or-social">or login with social platforms</p>
//             <div className="social-icons">
//               <button type="button" onClick={() => handleSocialLogin(googleProvider)}><span className="icon">G</span></button>
//               <button type="button" onClick={() => handleSocialLogin(facebookProvider)}><span className="icon">f</span></button>
//               <button type="button" onClick={() => handleSocialLogin(githubProvider)}><span className="icon">&#xf09b;</span></button>
//               <button type="button" onClick={() => handleSocialLogin(linkedinProvider)}><span className="icon">in</span></button>
//             </div>
//             {error && !isLogin && <div className="error">{error}</div>}
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function AuthPanel({ mode = "login", setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        const res = await signInWithEmailAndPassword(auth, email, password);
        setUser(res.user);
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        setUser(res.user);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoComplete="username"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        required
      />
      <button type="submit" className="cta-btn">{mode === "login" ? "Login" : "Register"}</button>
      {error && <div style={{ color: "red", marginTop: "1em" }}>{error}</div>}
    </form>
  );
}