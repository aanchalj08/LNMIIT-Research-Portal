import React from "react";
import "../styles/DisplayContainer.css";
import Navbar from "./Navbar";

const DisplayContainer = ({
  title,
  journalTitle,
  authors,
  issnNumber,
  publicationDate,
  citationCount,
  pageNumbers,
  keywords,
  link,
  description,
}) => {
  return (
    <div>
      <Navbar></Navbar>
      <div className="page-container">
        <div className="display-container">
          <h1 className="publication-title">{title}</h1>
          <div className="publication-meta">
            <p>
              <strong>Journal</strong> {journalTitle}
            </p>
            <p>
              <strong>ISSN</strong> {issnNumber}
            </p>
            <p>
              <strong>Publication Date</strong>{" "}
              {new Date(publicationDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Citation Count</strong> {citationCount}
            </p>
            <p>
              <strong>Pages</strong> {pageNumbers}
            </p>
          </div>
          <div className="authors-section">
            <h2>Authors</h2>
            <ul>
              {authors.map((author, index) => (
                <li key={index}>{author}</li>
              ))}
            </ul>
          </div>
          <div className="keywords-section">
            <h2>Keywords</h2>
            <ul className="keywords-list">
              {keywords.map((keyword, index) => (
                <li key={index} className="keyword-item">
                  {keyword}
                </li>
              ))}
            </ul>
          </div>
          <div className="description-section">
            <h2>Description</h2>
            <p>{description}</p>
          </div>
          <div className="link-section">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="paper-link"
            >
              View on Scopus
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayContainer;
