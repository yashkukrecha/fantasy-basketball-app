import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`${backend}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.status === 401) {
      setError("Error: " + data.message);
    } else {
      setError("");
      login(data.user);
      navigate("/dashboard");
    }
  };

  return (
    <div className="column-container">
      <h1> Sign In </h1>
      <form name="authenticate" onSubmit={handleSubmit}>
        <div className="row-container">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="row-container">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button style={{ marginTop: "7%" }} type="submit">
          Login
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <Link to="/register" style={{marginTop: '1%'}}> Don't have an account? Sign up here </Link>
    </div>
  );
};

export default LoginPage;
