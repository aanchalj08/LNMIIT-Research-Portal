const mongoose = require("mongoose");

const ItinerarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itineraryData: {
    type: Object,
    required: true,
  },
  weatherData: {
    type: Object,
    required: true,
  },
  restaurantData: {
    type: Array,
    required: true,
  },
  accommodationData: {
    type: Array,
    required: true,
  },
  accommodationType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Itinerary", ItinerarySchema);
