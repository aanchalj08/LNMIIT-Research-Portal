const Itinerary = require("../models/Itinerary");

const saveItinerary = async (req, res) => {
  try {
    const {
      itineraryData,
      weatherData,
      restaurantData,
      accommodationData,
      accommodationType,
    } = req.body;
    const userId = req.user.id;

    const newItinerary = new Itinerary({
      user: userId,
      itineraryData,
      weatherData,
      restaurantData,
      accommodationData,
      accommodationType,
    });

    const savedItinerary = await newItinerary.save();

    res.status(201).json({
      success: true,
      itineraryId: savedItinerary._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving itinerary",
      error: error.message,
    });
  }
};

const getUserItineraries = async (req, res) => {
  try {
    const userId = req.user.id;
    const itineraries = await Itinerary.find({ user: userId }).select("-__v");

    res.status(200).json({
      success: true,
      itineraries: itineraries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user itineraries",
      error: error.message,
    });
  }
};

const getItineraryById = async (req, res) => {
  try {
    const itineraryId = req.params.id;
    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    res.status(200).json({
      success: true,
      itinerary: itinerary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching itinerary",
      error: error.message,
    });
  }
};

module.exports = {
  saveItinerary,
  getUserItineraries,
  getItineraryById,
};
