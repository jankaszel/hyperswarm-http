const hyperswarm = require("hyperswarm");
const crypto = require("crypto");
const { parseRequest } = require("./http-request.js");

const swarm = hyperswarm();

const topic = crypto
  .createHash("sha256")
  .update("hyperswarm-http-test")
  .digest();

swarm.join(topic, {
  lookup: true,
  announce: true
});

swarm.on("connection", socket => {
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
