import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import LoadingIcons from "react-loading-icons";

const ProfilePage = (props) => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { auth, changeUsername } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [originalUsername, setOriginalUsername] = useState(auth.user.username);
  const [username, setUsername] = useState(auth.user.username);
  const [image, setImage] = useState(null);
  const [profilePic, setProfilePic] = useState(auth.user.image_url);

  useEffect(() => {
    if (!auth.user) {
      navigate("/");
      return;
    } else {
      console.log(auth.user);
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
      setOriginalUsername(username);
      changeUsername(username);
    }
    if (image) {
      await uploadImage();
    }
  };

  const updateUsername = async () => {
    // call API
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", image);
    // call API

  };

  if (!auth) {
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
      {!profilePic ? (
        <img
          src={require("./icons/default-pfp.png")}
          alt="user profile"
          id="user-pfp"
        />
      ) : (
        <br />
      )}
      <div className="row-container" style={{ gap: "5px" }}>
        <h3>{originalUsername}</h3>
        <FontAwesomeIcon
          onClick={handleEdit}
          id="edit-icon"
          size="xl"
          icon={faPenToSquare}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
