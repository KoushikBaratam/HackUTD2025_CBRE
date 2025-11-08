import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Login.css";

function SignUp({ toggle }) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName: first_name,
        lastName: last_name,
        email,
      });

      localStorage.setItem("userInfo", JSON.stringify({
        firstName: first_name,
        lastName: last_name,
        email,
      }));

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="header">
      </div>
      <form className="login-container" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        <div className="input-group">
          <input
            type="text"
            className="form-input"
            placeholder="First Name"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            className="form-input"
            placeholder="Last Name"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            className="form-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            className="form-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="sign-in-button" type="submit">Sign Up</button>
        {error && <div className="error-message">{error}</div>}

        <p className="toggle-signup" onClick={toggle}>Already have an account? Login</p>
      </form>
    </div>
  );
}

function Login({ toggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userInfo = docSnap.data();
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="header">
      </div>
      <form className="login-container" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="input-group">
          <input
            type="email"
            className="form-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            className="form-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="sign-in-button" type="submit">Login</button>
        {error && <div className="error-message">{error}</div>}

        <p className="toggle-signup" onClick={toggle}>Don't have an account? Sign Up</p>
      </form>
    </div>
  );
}

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return isSignUp ? (
    <SignUp toggle={() => setIsSignUp(false)} />
  ) : (
    <Login toggle={() => setIsSignUp(true)} />
  );
}

export default AuthPage;