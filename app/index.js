const crypto = require("crypto");
const { BrowserSwarm } = require("../lib/browser-swarm");

const channelName = "super-foobar-exciting-thing";

function createRequest(socket, message) {
  socket.write(message);

  socket.on("data", data => {
    console.log("Received " + data.length + " bytes\n" + data);
  });
  socket.on("end", () => socket.destroy());
}

async function main() {
  const topic = crypto
    .createHash("sha256")
    .update("hyperswarm-http-test")
    .digest();

  const swarm = new BrowserSwarm(Buffer.from(channelName));
  swarm.on("error", console.error);
  swarm.on("ready", () => {
    swarm.join(topic);
    console.log(`joined swarm: ${topic.toString("hex")}`);

    swarm.once("connection", socket => {
      createRequest(
        socket,
        `GET / HTTP/1.0

`
      );
    });
  });
}

main();
