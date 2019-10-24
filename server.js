const hyperswarm = require("hyperswarm");
const crypto = require("crypto");
const { parseRequest } = require("./lib/http-request.js");

const swarm = hyperswarm();

const topic = crypto
  .createHash("sha256")
  .update("hyperswarm-http-test")
  .digest();

swarm.join(topic, {
  lookup: false,
  announce: true
});

console.log(`Joined network: ${topic.toString("hex")}`);

swarm.on("connection", socket => {
  console.log("Established a new Hyperswarm client connection.");
  const parser = parseRequest(socket);

  parser.on("request", (req, res) => {
    console.log(req.method, req.url);

    res.statusCode = 200;
    res.end("yee");
  });

  parser.once("error", err => {
    console.error(err);
  });
});
