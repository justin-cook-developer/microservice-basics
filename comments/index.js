const express = require("express");
const cors = require("cors");
const { randomBytes } = require("crypto");

const PORT = process.env.PORT || 4001;
const app = express();

const commentsByPostId = {};

app.use(cors());

app.use(express.json());

app.get("/posts/:id/comments", (req, res) => {
  res.json(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const comment = {
    id: randomBytes(4).toString("hex"),
    content: req.body.content,
  };

  const postId = req.params.id;

  if (!commentsByPostId.hasOwnProperty(postId)) {
    commentsByPostId[postId] = [];
  }

  commentsByPostId[postId].push(comment);

  res.status(201).json(commentsByPostId[postId]);
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
