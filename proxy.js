const wrtc = require("wrtc");
const createWebRTCSwarm = require("@geut/discovery-swarm-webrtc");
const HyperswarmProxyServer = require("hyperswarm-proxy/server");

const channelId = Buffer.from("super-foobar-exciting-thing");

const webRTCSwarm = createWebRTCSwarm({
  bootstrap: ["https://geut-webrtc-signal.herokuapp.com/"],
  simplePeer: { wrtc }
});

webRTCSwarm.join(channelId);
console.log(
  "Joined WebRTC swarm:",
  channelId.toString(),
  channelId.toString("hex")
);

const server = new HyperswarmProxyServer({ ephemeral: false });

webRTCSwarm.on("connection", peer => {
  console.log("Connected to a new WebRTC peer.");
  server.handleStream(peer);
});

process.on("SIGINT", () => {
  webRTCSwarm.close(() => {
    console.log("WebRTC swarm closed.");
  });

  server.destroy(() => {
    console.log("Server destroyed.");
  });

  process.exit(0);
});
