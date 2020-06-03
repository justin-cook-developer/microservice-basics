const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { randomBytes } = require("crypto");

const PORT = process.env.PORT || 4001;
const app = express();

const commentsByPostId = {};

// could use this function to process past events
const handleEvent = async (event) => {
  const { type, data } = event;

  if (type === "CommentModerated") {
    const comment = commentsByPostId[data.postId].find((c) => c.id === data.id);

    if (comment !== undefined) {
      comment.status = data.status;

      await axios.post("http://localhost:4005/events", {
        type: "CommentUpdated",
        data,
      });
    }
  }
};

app.use(cors());
app.use(express.json());

app.get("/posts/:id/comments", (req, res) => {
  res.json(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const comment = {
    id: randomBytes(4).toString("hex"),
    content: req.body.content,
    status: "pending",
  };

  const postId = req.params.id;

  if (!commentsByPostId.hasOwnProperty(postId)) {
    commentsByPostId[postId] = [];
  }

  commentsByPostId[postId].push(comment);

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      ...comment,
      postId,
    },
  });

  res.status(201).json(commentsByPostId[postId]);
});

app.post("/events", async (req, res) => {
  await handleEvent(req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
