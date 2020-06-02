const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 4002;
const app = express();

// { [postId]: { id: '', title: '', comments: [] } }
const posts = {};

app.use(cors());
app.use(express.json());

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "PostCreated") {
    posts[data.id] = { ...data, comments: [] };
  } else if (type === "CommentCreated") {
    const { postId, id, content, status } = data;
    posts[postId].comments.push({ id, content, status });
  } else if (type === "CommentUpdated") {
    const { postId, id, content, status } = data;
    const comment = posts[postId].comments.find((c) => c.id === id);

    if (comment !== undefined) {
      comment.content = content;
      comment.status = status;
    } else {
      // you are a teapot
      return res.sendStatus(418);
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
