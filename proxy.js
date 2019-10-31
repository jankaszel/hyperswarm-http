const http = require("http");
const websocket = require("websocket-stream");
const HyperswarmProxyServer = require("hyperswarm-proxy/server");
const debug = require("debug")("hyperswarm-websocket-gateway");

const port =
  process.argv.length > 2 ? Number.parseInt(process.argv[2], 10) : 4200;

async function main() {
  const server = http.createServer();
  server.listen(port);
  debug(`http server listening on port ${port}`);

  const proxyServer = new HyperswarmProxyServer({ ephemeral: false });
  const wss = websocket.createServer({ server }, handle);

  function handle(stream) {
    proxyServer.handleStream(stream);
  }
}

main();
