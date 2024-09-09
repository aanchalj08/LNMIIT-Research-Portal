const express = require("express");
const router = express.Router();

const {
  login,
  register,
  dashboard,
  getAllUsers,
  forgotPassword,
  resetPassword,
  refreshPublications,
} = require("../controllers/user");

const {
  saveItinerary,
  getUserItineraries,
  getItineraryById,
} = require("../controllers/itinerary");
const {
  verifyPublication,
  addPublication,
  getUserPublications,
  getPublicationById,
  deletePublication,
  searchPublication,
  getPublications,
  getUserData,
  updateUserData,
} = require("../controllers/publications");

const authMiddleware = require("../middleware/auth");

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:resetToken").post(resetPassword);
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/dashboard").get(authMiddleware, dashboard);
router.route("/users").get(getAllUsers);
router.route("/itinerary/save-itinerary").post(authMiddleware, saveItinerary);
router
  .route("/itinerary/user-itineraries")
  .get(authMiddleware, getUserItineraries);
router.route("/itinerary/:id").get(authMiddleware, getItineraryById);
router.route("/verify-publication").post(verifyPublication);
router.route("/add-publication").post(authMiddleware, addPublication);
router.route("/get-publications").get(authMiddleware, getUserPublications);
router.route("/publication/:id").get(authMiddleware, getPublicationById);
router
  .route("/delete-publication/:id")
  .delete(authMiddleware, deletePublication);
router.route("/search-users").get(authMiddleware, searchPublication);
router.route("/user-publications/:userId").get(authMiddleware, getPublications);
router.route("/refresh-publications").post(authMiddleware, refreshPublications);
router.route("/teacher/profile").get(authMiddleware, getUserData);
router.route("/teacherprofile").put(authMiddleware, updateUserData);

module.exports = router;
