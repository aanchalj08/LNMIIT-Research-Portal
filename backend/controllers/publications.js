const axios = require("axios");
const Teacher = require("../models/Teacher");
const Publication = require("../models/Publication");
const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
const stemmer = natural.PorterStemmer;

exports.verifyPublication = async (req, res) => {
  const { issnNumber } = req.body;

  try {
    const response = await axios.get(
      `https://api.elsevier.com/content/serial/title/issn/${issnNumber}`,
      {
        headers: {
          "X-ELS-APIKey": "8050a60fc6e16a778dff7f8dd9c6e8a0",
        },
      }
    );

    if (response.status === 200) {
      res.status(200).json({ verified: true });
    } else {
      res.status(200).json({ verified: false });
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(200).json({ verified: false });
    } else {
      console.error("Error verifying publication:", error);
      res
        .status(500)
        .json({ error: "An error occurred while verifying the publication" });
    }
  }
};

exports.addPublication = async (req, res) => {
  try {
    const userId = req.user.id;
    const publicationData = { ...req.body, user: userId };

    const publication = new Publication(publicationData);
    await publication.save();

    res
      .status(201)
      .json({ message: "Publication added successfully", publication });
  } catch (error) {
    console.error("Error adding publication:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the publication" });
  }
};

exports.getUserPublications = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const publications = await Publication.find({ user: userId })
      .select("-__v")
      .sort({ publicationDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalPublications = await Publication.countDocuments({
      user: userId,
    });
    const totalPages = Math.ceil(totalPublications / limit);

    res.status(200).json({
      success: true,
      publications: publications,
      currentPage: page,
      totalPages: totalPages,
      totalPublications: totalPublications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user publications",
      error: error.message,
    });
  }
};
exports.getPublicationById = async (req, res) => {
  try {
    const publicationId = req.params.id;
    const publication = await Publication.findById(publicationId);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    res.status(200).json({
      success: true,
      publication: publication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching publication",
      error: error.message,
    });
  }
};

exports.deletePublication = async (req, res) => {
  try {
    const publicationId = req.params.id;
    const userId = req.user.id;
    const publication = await Publication.findOne({
      _id: publicationId,
      user: userId,
    });
    if (!publication) {
      return res.status(404).json({
        success: false,
        message:
          "Publication not found or you don't have permission to delete it",
      });
    }
    await Publication.findByIdAndDelete(publicationId);
    res.status(200).json({
      success: true,
      message: "Publication deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting publication",
      error: error.message,
    });
  }
};

exports.searchPublication = async (req, res) => {
  try {
    const { name, department, domain } = req.query;

    if (!name && !department && !domain) {
      return res.status(400).json({
        message: "Name, department, or domain query parameter is required",
      });
    }

    let searchCriteria = {};

    if (name) {
      searchCriteria.name = new RegExp(name, "i");
    }

    if (department) {
      searchCriteria.department = department;
    }

    if (domain) {
      const domainList = domain.split(",");
      searchCriteria.domains = { $in: domainList };
    }

    const users = await Teacher.find(
      searchCriteria,
      "name department email domains"
    );
    console.log(`Found ${users.length} users matching the criteria`);

    return res.json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getPublications = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching publications for user ID: ${userId}`);

    const publications = await Publication.find({ user: userId })
      .select("title publicationDate")
      .sort({ publicationDate: -1 });

    console.log(`Found ${publications.length} publications`);

    res.json({ publications });
  } catch (error) {
    console.error("Error fetching user publications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select("-password");
    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }
    console.log("Teacher found");
    console.log(teacher);
    res.json(teacher);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateUserData = async (req, res) => {
  const { name, email, department, authorID, domains } = req.body;

  const teacherFields = {};
  if (name) teacherFields.name = name;
  if (email) teacherFields.email = email;
  if (department) teacherFields.department = department;
  if (authorID) teacherFields.authorID = authorID;
  if (domains) teacherFields.domains = domains;

  try {
    let teacher = await Teacher.findById(req.user.id);

    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }

    teacher = await Teacher.findByIdAndUpdate(
      req.user.id,
      { $set: teacherFields },
      { new: true }
    );

    res.json({ teacher, message: "Profile updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
