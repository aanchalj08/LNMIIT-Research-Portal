import React, { useEffect, useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Navbar from "./Navbar";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaLanguage,
  FaHotel,
} from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";

const Dashboard = () => {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    sourceCity: "",
    destinationCity: "",
    startDate: "",
    endDate: "",
    budget: "",
    language: "",
    accommodationType: "",
    travelStyles: [],
    interests: [],
    activityTypes: [],
    cuisine: [],
  });
  const [minDate, setMinDate] = useState("");
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const fetchName = async () => {
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/dashboard`,
        axiosConfig
      );
      setData({ msg: response.data.msg, luckyNumber: response.data.secret });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSourceCityChange = (address) => {
    setFormData((prevData) => ({ ...prevData, sourceCity: address }));
  };

  const handleDestinationCityChange = (address) => {
    setFormData((prevData) => ({ ...prevData, destinationCity: address }));
  };

  const handleSelect = (address, updateField) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        console.log("Success", latLng);
        updateField(address);
      })
      .catch((error) => console.error("Error", error));
  };

  const handleMultiSelectChange = (e, field) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].includes(value)
        ? prevData[field].filter((item) => item !== value)
        : [...prevData[field], value],
    }));
  };

  const LoadingMessage = () => (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p>Please wait while we plan your perfect trip...</p>
      </div>
    </div>
  );

  const handleClick = () => {
    navigate("/add");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/v1/trip-data`, {
        destinationCity: formData.destinationCity,
        startDate: formData.startDate,
        endDate: formData.endDate,
        cuisine: formData.cuisine,
        accommodationType: formData.accommodationType,
        sourceCity: formData.sourceCity,
        travelStyles: formData.travelStyles,
        interests: formData.interests,
        activityTypes: formData.activityTypes,
        language: formData.language,
        budget: formData.budget,
      });

      setIsLoading(false);

      navigate("/display-itinerary", {
        state: {
          weatherData: response.data.weatherData,
          restaurantData: response.data.restaurantData,
          accommodationData: response.data.accommodationData,
          accommodationType: formData.accommodationType,
          itineraryData: response.data.itinerarydata,
        },
      });
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    fetchName();
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }

    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
  }, [token]);

  return (
    <div className="dashboard-main">
      <Navbar></Navbar>
      <div className="dashboard-content">
        <h1>LNMIIT Research Portal</h1>
        <p>{data.msg}! Ready to dive into your research at LNMIIT?</p>
        <div className="dash-link">
          <button type="button" className="add-btn" onClick={handleClick}>
            {" "}
            Add Publication
          </button>
        </div>
      </div>
      {isLoading && <LoadingMessage />}
    </div>
  );
};

export default Dashboard;
