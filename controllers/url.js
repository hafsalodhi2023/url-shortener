const js_shortid = require("js-shortid");
const urlModel = require("../models/url");

module.exports = async function (req, res) {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url is required" });

  const shortid = js_shortid.gen();

  const newURL = await urlModel.create({
    shortId: shortid,
    redirectUrl: req.body.url,
    visitHistory: [],
  });

  return res.json({ id: shortid });
};

