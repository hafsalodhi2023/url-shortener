require("dotenv").config();
require("./config/db")();

const express = require("express");
const cors = require("cors");
const path = require("path");

const urlModel = require("./models/url");

const app = express();

const urlRoute = require("./routes/url");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use("/url", urlRoute);

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/:shortid", async (req, res) => {
  const shortid = req.params.shortid;

  const entry = await urlModel.findOneAndUpdate(
    { shortId: shortid },
    {
      $push: {
        visitHistory: Date.now(),
      },
    }
  );

  if (!entry) return res.status(404).json({ error: "URL not found" });

  return res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
