const express = require("express");
const axios = require("axios");

const PORT = process.env.PORT || 4005;
const app = express();

// treat like a queue of events
const events = [];

app.use(express.json());

app.post("/events", (request, response) => {
  const event = request.body;

  events.push(event);

  axios.post("http://localhost:4000/events", event);
  axios.post("http://localhost:4001/events", event);
  axios.post("http://localhost:4002/events", event);
  axios.post("http://localhost:4003/events", event);

  response.sendStatus(200);
});

app.get("/events", (req, res) => {
  res.json(events);
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
