const assert = require("assert");
const { EventEmitter } = require("events");
const HyperswarmProxyClient = require("hyperswarm-proxy/client");
const createWebRTCSwarm = require("@geut/discovery-swarm-webrtc");
const debug = require("debug")("hyperswarm-webrtc-client");

const defaultBootstrap = [
  "https://geut-webrtc-signal.herokuapp.com/",
  "signal.mauve.moe"
];

const simplePeer = {
  config: {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302"
      },
      {
        urls: "stun:stun1.l.google.com:19302"
      }
    ]
  },
  reconnectTimer: 100,
  iceTransportPolicy: "relay",
  trickle: false
};

class BrowserSwarm extends EventEmitter {
  constructor(channelName, opts = {}) {
    super();

    const bootstrap = Array.isArray(opts.bootstrap)
      ? defaultBootstrap.concat(opts.bootstrap)
      : defaultBootstrap;
    this._joinWebRTCSwarm(channelName, bootstrap);
  }

  _joinWebRTCSwarm(channelName, bootstrap) {
    assert(
      channelName instanceof Buffer,
      "channelName is expected to be a Buffer"
    );
    this.webRTCSwarm = createWebRTCSwarm({ bootstrap, simplePeer });
    this.webRTCSwarm.join(Buffer.from(channelName));
    debug(`joined webrtc swarm for channel: ${channelName.toString("hex")}`);

    this.webRTCSwarm.on("error", err => this.emit("error", err));
    this.webRTCSwarm.on("connection", connection =>
      this._createHyperswarmClient(connection)
    );
  }

  _createHyperswarmClient(connection) {
    connection.on("error", err => console.error("BIG ERROR", err));

    debug("creating hyperswarm proxy client");
    this.connection = connection;
    this.hyperswarmClient = new HyperswarmProxyClient({
      connection,
      autoconnect: true,
      maxPeers: 24
    });

    this.hyperswarmClient.on("peer", peer => this.emit("peer", peer));
    this.hyperswarmClient.on("connection", (connection, info) =>
      this.emit("connection", connection, info)
    );

    this.ready = true;
    this.emit("ready");
  }

  join(topic) {
    assert(
      this.ready,
      "WebRTC swarm is not ready yet. Wait for `swarm.on('ready')` to be emitted."
    );

    this.hyperswarmClient.join(topic);
  }

  destroy() {}
}

module.exports = { BrowserSwarm };
