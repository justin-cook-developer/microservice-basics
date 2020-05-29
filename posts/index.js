const express = require("express");
const cors = require("cors");
const { randomBytes } = require("crypto");

const PORT = process.env.PORT || 4000;
const app = express();

const posts = {};

app.use(cors());

app.use(express.json());

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.post("/posts", (req, res) => {
  const post = {
    id: randomBytes(4).toString("hex"),
    title: req.body.title,
  };

  posts[post.id] = post;

  res.status(201).json(post);
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
