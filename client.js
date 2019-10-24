const hyperswarm = require("hyperswarm");
const crypto = require("crypto");
const { createRequest } = require("./lib/http-request");

const swarm = hyperswarm();

const topic = crypto
  .createHash("sha256")
  .update("hyperswarm-http-test")
  .digest();

swarm.join(topic, {
  lookup: true,
  announce: false
});

swarm.once("connection", socket => {
  createRequest(socket);
});
