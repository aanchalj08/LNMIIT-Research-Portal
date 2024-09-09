import React, { useState, useEffect } from "react";
import { AlertCircle, Save, Edit3, PlusCircle, XCircle } from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar";
import "../styles/EditProfile.css";

const EditProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    department: "",
    authorID: "",
    domains: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const response = await axios.get(`${baseUrl}/api/v1/teacher/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      const data = await response.data;
      setUserData(data);
    } catch (err) {
      setError("Failed to load user data. Please try again.");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDomainChange = (e, index) => {
    const newDomains = [...userData.domains];
    newDomains[index] = e.target.value;
    setUserData((prevData) => ({
      ...prevData,
      domains: newDomains,
    }));
  };

  const addDomain = () => {
    setUserData((prevData) => ({
      ...prevData,
      domains: [...prevData.domains, ""],
    }));
  };

  const removeDomain = (index) => {
    setUserData((prevData) => ({
      ...prevData,
      domains: prevData.domains.filter((_, i) => i !== index),
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage(""); // Clear any previous messages
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      handleEdit();
      return;
    }

    setError("");
    setMessage("");
    console.log(userData);

    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const response = await axios.put(
        `${baseUrl}/api/v1/teacher/profile`,
        JSON.stringify(userData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.data;
      setMessage(data.message || "Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="edit-profile-container">
        <h1>Edit Your Profile</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department:</label>
            {isEditing ? (
              <select
                id="department"
                name="department"
                value={userData.department}
                className="department-box"
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="CCE">CCE</option>
                <option value="ECE">ECE</option>
                <option value="MME">MME</option>
              </select>
            ) : (
              <input
                type="text"
                id="department"
                name="department"
                value={userData.department}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            )}
          </div>
          <div className="form-group">
            <label htmlFor="authorID">Author ID:</label>
            <input
              type="text"
              id="authorID"
              name="authorID"
              value={userData.authorID}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label>Domains:</label>
            {userData.domains.map((domain, index) => (
              <div key={index} className="domain-input">
                {isEditing ? (
                  <select
                    value={domain}
                    onChange={(e) => handleDomainChange(e, index)}
                    className="domain-box"
                    required
                  >
                    <option value="">Select Domain</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Deep Learning">Deep Learning</option>
                    <option value="Data Science & Big Data">
                      Data Science & Big Data
                    </option>
                    <option value="Computer Networks & Distributed Systems">
                      Computer Networks & Distributed Systems
                    </option>
                    <option value="Software Engineering">
                      Software Engineering
                    </option>
                    <option value="Natural Language Processing">
                      Natural Language Processing
                    </option>
                    <option value="Research">Research</option>
                    <option value="Internet of Things">
                      Internet of Things
                    </option>
                    <option value="Wireless Communication">
                      Wireless Communication
                    </option>
                    <option value="Robotics">Robotics</option>
                    <option value="Development">Development</option>
                    <option value="Blockchain Technology">
                      Blockchain Technology
                    </option>
                    <option value="Bioinformatics">Bioinformatics</option>
                    <option value="Environmental Engineering">
                      Environmental Engineering
                    </option>
                    <option value="Human-Computer Interaction (HCI)">
                      Human-Computer Interaction (HCI)
                    </option>
                    <option value="Networking & Telecommunications">
                      Networking & Telecommunications
                    </option>
                    <option value="Embedded Systems">Embedded Systems</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={domain}
                    disabled={!isEditing}
                    required
                  />
                )}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeDomain(index)}
                    className="remove-domain"
                  >
                    <XCircle className="x-circle" size={20} />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <button type="button" onClick={addDomain} className="add-domain">
                <PlusCircle size={20} /> Add Domain
              </button>
            )}
          </div>
          <button
            type="submit"
            className={isEditing ? "save-button" : "edit-button"}
          >
            {isEditing ? (
              <>
                <Save size={20} /> Save Changes
              </>
            ) : (
              <>
                <Edit3 size={20} /> Edit Profile
              </>
            )}
          </button>
        </form>
        {message && (
          <div className="message">
            <AlertCircle size={20} />
            {message}
          </div>
        )}
      </div>
    </>
  );
};

export default EditProfile;
