const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { randomBytes } = require("crypto");

const PORT = process.env.PORT || 4000;
const app = express();

const posts = {};

app.use(cors());
app.use(express.json());

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.post("/posts", async (req, res) => {
  const post = {
    id: randomBytes(4).toString("hex"),
    title: req.body.title,
  };

  posts[post.id] = post;

  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: post,
  });

  res.status(201).json(post);
});

app.post("/events", (req, res) => {
  const event = req.body;
  console.log("Event received " + event.type);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
