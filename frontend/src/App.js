import { React, useEffect, useState } from "react";
import { useNavigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth, AuthProvider } from "./AuthContext";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Dashboard from "./Dashboard";
import DraftPage from "./DraftPage";
import PostDraftPage from "./PostDraftPage";
import NotFoundPage from "./NotFoundPage";
import ProfilePage from "./ProfilePage";
import "./styles/app.css";
import "./styles/barchart.css";
import "./styles/card.css";
import "./styles/home.css";
import "./styles/user.css";
import "./styles/player.css";

const App = (props) => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

function AppContent() {
  const { login } = useAuth();
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const response = await fetch(`${backend}/@me`, {
        credentials: "include",
      });
      if (response.status === 200) {
        const data = await response.json();
        login(data.user);
        navigate("/dashboard");
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/login" element={<LoginPage />} />
      <Route exact path="/register" element={<RegisterPage />} />
      <Route exact path="/dashboard" element={<Dashboard />} />
      <Route exact path="/draft" element={<DraftPage />} />
      <Route exact path="/post_draft" element={<PostDraftPage />} />
      <Route exact path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
