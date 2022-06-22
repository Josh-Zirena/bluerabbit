const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;
const fs = require("fs");
const multer = require("multer");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/myName", (req, res) => {
  res.json({ name: "Josh Zirena" });
});

app.post("/name", (req, res) => {
  const contents = fs.readFileSync("./output/name.txt", "utf-8");
  if (!contents) {
    fs.writeFileSync("./output/name.txt", req.body.name);
    res.send(req.body);
  } else {
    const arr = contents.split(",");
    arr.push(req.body.name);
    fs.writeFileSync("./output/name.txt", arr.toString());
    res.send(arr.toString());
  }
});

// Multer File Image Upload

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

app.post("/processImage", upload.single("image"), (req, res, next) => {
  console.log({ req: JSON.stringify(req.body) });
  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: "Please upload a file." });
  }
  return res.send({ message: "File uploaded successfully.", file });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
