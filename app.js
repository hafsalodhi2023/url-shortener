require("dotenv").config();
require("./config/db")(); // Ensure your database connection is correctly configured

const express = require("express");
const cors = require("cors");
const path = require("path");

const urlModel = require("./models/url");
const urlRoute = require("./routes/url");

const app = express();

// Use PORT from the environment or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware for error handling should be added after all other middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://se-short.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Set views directory and view engine
app.set("views", path.join(__dirname, "views")); // Changed to "./views" if your views are in the same directory level
app.set("view engine", "ejs");

// Routes
app.use("/url", urlRoute);

app.get("/", async (req, res) => {
  try {
    res.render("index");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error loading the page");
  }
});

app.get("/:shortid", async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err.message);
    res.status(500).send("An error occurred");
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
