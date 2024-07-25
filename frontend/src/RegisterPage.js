import { React, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterPage = (props) => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`${backend}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username: username, password: password }),
    });
    const data = await response.json();
    if (response.status === 400) {
      setError(data.message);
    } else {
      setError("");
      login(data.user);
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <h1> Register </h1>
      <form name="authenticate" onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
      <button onClick={() => navigate("/login")}> Login </button>
    </div>
  );
};

export default RegisterPage;
