import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import LoadingIcons from "react-loading-icons";

const ProfilePage = (props) => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { auth, changeUsername, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [originalUsername, setOriginalUsername] = useState(null);
  const [username, setUsername] = useState(null);
  const [image, setImage] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.user) {
      navigate("/");
      return;
    } else {
      console.log(auth.user);
      setUsername(auth.user.username);
      setOriginalUsername(auth.user.username);
      setProfilePic(auth.user.profile_pic);
    }
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username !== originalUsername) {
      await updateUsername();
    }
    if (image) {
      await uploadImage();
    }
    setEditMode(false);
  };

  const updateUsername = async () => {
    const response = await fetch(`${backend}/update_username`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username: username }),
    });
    if (response.status === 200) {
      setOriginalUsername(username);
      changeUsername(username);
    } else {
      const data = await response.json();
      setError("Error: " + data.message);
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", image);
    const response = await fetch(`${backend}/upload_profile_photo`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await response.json();
    if (response.status === 200) {
      setProfilePic(data.image_url);
    } else {
      setError("Error: " + data.message);
    }
  };

  const handleLogout = async () => {
    await fetch(`${backend}/logout`, {
      method: "POST",
      credentials: "include",
    });
    logout();
    navigate("/");
  };


  if (!originalUsername) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <LoadingIcons.ThreeDots />
      </div>
    );
  }

  if (editMode) {
    return (
      <div className="column-container">
        <h1>User Profile</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ border: "0px" }}
          />
          <div className="row-container">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button type="submit">Confirm</button>
        </form>
      </div>
    );
  }

  return (
    <div className="column-container">
      <h1>User Profile</h1>
      <img
        src={profilePic || require("./icons/default-pfp.png")}
        alt="default profile"
        id="user-pfp"
      />
      <div className="row-container" style={{ gap: "5px" }}>
        <h3>{originalUsername}</h3>
        <FontAwesomeIcon
          onClick={handleEdit}
          id="edit-icon"
          size="xl"
          icon={faPenToSquare}
        />
      </div>
      {error && <p className="error">{error}</p>}
      {error && <br></br>}
      <div>
        <button onClick={() => navigate("/dashboard")}> Dashboard </button>
        <button onClick={handleLogout}> Logout </button>
      </div>
    </div>
  );
};

export default ProfilePage;
