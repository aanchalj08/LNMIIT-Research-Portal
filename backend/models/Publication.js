const mongoose = require("mongoose");

const PublicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    email: String,
    issnNumber: String,
    authors: [String],
    title: String,
    journalTitle: String,
    publicationDate: Date,
    pageNumbers: String,
    citationCount: String,
    keywords: [String],
    paperLink: String,
    description: String,
    eid: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Publication", PublicationSchema);
