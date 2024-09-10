const axios = require("axios");
const Publication = require("../models/Publication");
const SCOPUS_API_KEY = process.env.SCOPUS_API_KEY;

async function fetchAndSavePublications(user, authorID) {
  let startIndex = 0;
  let totalResults = 1;
  while (startIndex < totalResults) {
    const searchUrl = `https://api.elsevier.com/content/search/scopus?query=AU-ID(${authorID})&start=${startIndex}&count=25`;
    try {
      console.log(`Making search request to: ${searchUrl}`);
      const searchResponse = await axios.get(searchUrl, {
        headers: { "X-ELS-APIKey": SCOPUS_API_KEY },
      });
     

      const searchData = searchResponse.data["search-results"];
      totalResults = parseInt(searchData["opensearch:totalResults"]);
      for (const entry of searchData.entry) {
        const abstractUrl = `${entry["prism:url"]}?field=author,affiliation,authkeywords,dc:description,eid`;
        const abstractResponse = await axios.get(abstractUrl, {
          headers: { "X-ELS-APIKey": SCOPUS_API_KEY },
        });
        const abstractData =
          abstractResponse.data["abstracts-retrieval-response"];
        console.log(abstractData);
        const publicationData = {
          user: user._id,
          name: user.name,
          email: user.email,
          issnNumber: entry["prism:issn"],
          title: entry["dc:title"],
          journalTitle: entry["prism:publicationName"],
          publicationDate: new Date(entry["prism:coverDate"]),
          pageNumbers: entry["prism:pageRange"],
          citationCount: parseInt(entry["citedby-count"]),
          paperLink: `https://www.scopus.com/record/display.uri?eid=${entry.eid}&origin=resultslist`,
          description: abstractData?.coredata?.["dc:description"] || "",
          authors:
            abstractData.authors?.author?.map(
              (author) => author["ce:given-name"] + " " + author["ce:surname"]
            ) || [],
          keywords: parseKeywords(abstractData.authkeywords),
          eid: entry.eid,
        };
        console.log(publicationData);
        try {
          await Publication.findOneAndUpdate(
            { eid: publicationData.eid },
            publicationData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        } catch (error) {
          console.error("Error updating/inserting publication:", error);
        }
      }
      startIndex += 25;
    } catch (error) {
      console.error("Error fetching publications:", error);
      break;
    }
  }
}

async function validateAuthorID(authorID) {
  const searchUrl = `https://api.elsevier.com/content/search/scopus?query=AU-ID(${authorID})&count=1`;
  try {
    console.log(`Making search request to: ${searchUrl}`);
    const searchResponse = await axios.get(searchUrl, {
      headers: { "X-ELS-APIKey": SCOPUS_API_KEY },
    });

    console.log("Search API Response Status:", searchResponse.status);
    console.log(
      "Search API Response Headers:",
      JSON.stringify(searchResponse.headers, null, 2)
    );

    const searchData = searchResponse.data["search-results"];
    const totalResults = parseInt(searchData["opensearch:totalResults"]);
    console.log(`Total results: ${totalResults}`);

    return totalResults > 0;
  } catch (error) {
    console.error("Error validating Author ID:", error);
    return false;
  }
}

function parseKeywords(authkeywords) {
  if (!authkeywords) return [];
  if (Array.isArray(authkeywords["author-keyword"])) {
    return authkeywords["author-keyword"].map((keyword) => keyword["$"]);
  } else if (typeof authkeywords["author-keyword"] === "object") {
    return [authkeywords["author-keyword"]["$"]];
  } else if (typeof authkeywords["author-keyword"] === "string") {
    return [authkeywords["author-keyword"]];
  }
  return [];
}

module.exports = { fetchAndSavePublications, validateAuthorID };
