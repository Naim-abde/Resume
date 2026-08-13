const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/index.html", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/builder.html", (req, res) => res.sendFile(path.join(__dirname, "builder.html")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.get("/favicon.svg", (req, res) => res.sendFile(path.join(__dirname, "favicon.svg")));
app.get("/robots.txt", (req, res) => res.sendFile(path.join(__dirname, "robots.txt")));
app.get("/sitemap.xml", (req, res) => res.sendFile(path.join(__dirname, "sitemap.xml")));
app.get("/og-image.png", (req, res) => res.sendFile(path.join(__dirname, "og-image.png")));

app.listen(PORT, () => {
  console.log(`ResumeForge running at http://localhost:${PORT}`);
});
