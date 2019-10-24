const crypto = require("crypto");
const HyperswarmProxyClient = require("hyperswarm-proxy/client");
const createWebRTCSwarm = require("@geut/discovery-swarm-webrtc");

const channelName = "super-foobar-exciting-thing";

function createRequest(socket) {
  socket.write(`GET / HTTP/1.0

`);

  socket.on("data", data => {
    console.log("Received " + data.length + " bytes\n" + data);
  });
}

async function initiateHyperswarmClient(peer) {
  const swarm = new HyperswarmProxyClient({
    connection: peer,
    autoconnect: true,
    maxPeers: 24
  });

  const topic = crypto
    .createHash("sha256")
    .update("hyperswarm-http-test")
    .digest();

  swarm.join(topic);
  console.log(`Joined swarm: ${topic.toString("hex")}`);

  swarm.once("connection", socket => {
    createRequest(socket);
  });
}

async function main() {
  const swarmOpts = {
    bootstrap: ["https://geut-webrtc-signal.herokuapp.com/"]
  };

  const webRTCSwarm = createWebRTCSwarm(swarmOpts);

  webRTCSwarm.join(Buffer.from(channelName));
  console.log(
    "Joined WebRTC swarm:",
    channelName,
    Buffer.from(channelName).toString("hex")
  );

  webRTCSwarm.on("connection", async peer => {
    console.log("Connected to a new WebRTC peer");
    await initiateHyperswarmClient(peer);
  });
}

main();
