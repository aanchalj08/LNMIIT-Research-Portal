import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import Navbar from "./Navbar";
import "../styles/Search.css";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();

  const domainOptions = [
    { value: "AI/ML", label: "AI/ML" },
    { value: "Cyber Security", label: "Cyber Security" },
    { value: "Cloud Computing", label: "Cloud Computing" },
    { value: "Deep Learning", label: "Deep Learning" },
    { value: "Data Science & Big Data", label: "Data Science & Big Data" },
    {
      value: "Computer Networks & Distributed Systems",
      label: "Computer Networks & Distributed Systems",
    },
    { value: "Software Engineering", label: "Software Engineering" },
    {
      value: "Natural Language Processing",
      label: "Natural Language Processing",
    },
    { value: "Research", label: "Research" },
    { value: "Internet of Things", label: "Internet of Things" },
    { value: "Wireless Communication", label: "Wireless Communication" },
    { value: "Robotics", label: "Robotics" },
    { value: "Development", label: "Development" },
    { value: "Blockchain Technology", label: "Blockchain Technology" },
    { value: "Bioinformatics", label: "Bioinformatics" },
    {
      value: "Environmental Engineering",
      label: "Environmental Engineering",
    },
    {
      value: "Human-Computer Interaction (HCI)",
      label: "Human-Computer Interaction (HCI)",
    },
    {
      value: "Networking & Telecommunications",
      label: "Networking & Telecommunications",
    },
    { value: "Embedded Systems", label: "Embedded Systems" },
  ];

  useEffect(() => {
    if (location.state && location.state.searchResults) {
      setSearchResults(location.state.searchResults);
    }
  }, [location.state]);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchTerm("");
  };

  const handleSearch = async () => {
    if (!searchTerm || (Array.isArray(searchTerm) && searchTerm.length === 0)) {
      setError(
        `${
          searchType.charAt(0).toUpperCase() + searchType.slice(1)
        } field is required`
      );
      return;
    }
    setError("");
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      let url = `${baseUrl}/api/v1/search-users?`;

      if (searchType === "domain") {
        const selectedDomains = searchTerm.map((option) => option.value);
        url += `domain=${selectedDomains.join(",")}`;
      } else {
        url += `${searchType}=${searchTerm}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(response.data.users);
      setSearchTerm("");
    } catch (error) {
      console.error("Error searching users:", error);
      setError("An error occurred while searching. Please try again.");
    }
    setLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && searchType !== "domain") {
      handleSearch();
    }
  };

  const handleUserSelect = (userId) => {
    navigate(`/user/${userId}`, {
      state: { searchResults },
    });
  };

  return (
    <>
      <Navbar />
      <div className="search-main">
        <div className="search-container">
          <h1>Search for Users and Their Journals</h1>
          <div className="search-form">
            <select onChange={handleSearchTypeChange} value={searchType}>
              <option value="name">Name</option>
              <option value="department">Department</option>
              <option value="domain">Domain</option>
            </select>
            {searchType === "department" ? (
              <select
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="CCE">CCE</option>
                <option value="ECE">ECE</option>
                <option value="MME">MME</option>
              </select>
            ) : searchType === "domain" ? (
              <Select
                isMulti
                value={searchTerm}
                onChange={(selected) => setSearchTerm(selected)}
                options={domainOptions}
                placeholder="Select Domains"
                className="domain-select"
              />
            ) : (
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Enter ${searchType}`}
              />
            )}
            <button onClick={handleSearch}>Search</button>
          </div>
          {error && <p className="error-message">{error}</p>}
          {loading && <p>Loading...</p>}
          {searchResults.length > 0 && (
            <div className="search-results">
              <h2>Search Results:</h2>
              <ul>
                {searchResults.map((user) => (
                  <li key={user._id} onClick={() => handleUserSelect(user._id)}>
                    <strong>Name:</strong> {user.name} <br />
                    <strong>Department:</strong> {user.department} <br />
                    <strong>Email:</strong> {user.email} <br />
                    <strong>Domains:</strong> {user.domains.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
