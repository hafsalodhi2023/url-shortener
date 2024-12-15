const js_shortid = require("js-shortid");
const urlModel = require("../models/url");

module.exports = async function (req, res) {
  try {
    const { url } = req.body;

    // Validate input
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Generate a unique short ID
    const shortid = js_shortid.gen();

    // Create a new URL document in the database
    const newURL = await urlModel.create({
      shortId: shortid,
      redirectUrl: url,
      visitHistory: [],
    });

    // Respond with the generated short ID
    return res.status(201).json({ id: shortid });
  } catch (err) {
    // Log the error and respond with a 500 status code
    console.error("Error in create controller:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
