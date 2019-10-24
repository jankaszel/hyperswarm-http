# Hyperswarm with HTTP

[Hyperswarm](https://github.com/hyperswarm/hyperswarm) is a technology to realize serverless, peer-to-peer (P2P) discovery for peers interested in a particular topic. [Paul Frazee detailed](https://pfrazee.hashbase.io/blog/hyperswarm) most of its prospects on this blog: It uses a new [Kademlia](https://en.wikipedia.org/wiki/Kademlia) DHT, which also implements useful features like hole-punching.

For my thesis work ([code](https://github.com/falafeljan/from-me-to-you), [blog](https://kassel.works/thesis)), I intend to overcome current issues that CRDTs like [Automerge](https://github.com/automerge/automerge) have with browser technology by using W3C standards, but in a decentralized manner. While browser APIs don't allow access to files or low-level networking (like UDP sockets), using web standards like [Linked Web Annotations](https://www.w3.org/TR/annotation-model/) allows to work with a broadly-supported technology stack.

This project aims to test Hyperswarm with simple HTTP requests, and ultimately provide simple library functions for web clients and "servers" (natively running applications) alike.

## Running the Experiment

1. `node server.js` Start a ‘serving’ peer (receiving HTTP requests via Hyperswarm).
2. `node client.js` Start a ‘requesting’ peer (sending HTTP requests and receiving responses, connecting to the server).
3. `node proxy.js` Start a proxy that relays Hyperswarm protocol messages from a WebRTC stream into the Hyperswarm network.
4. `npm run dev` Set your browser to `http://localhost:3000/`. The client will connect to the server via the WebRTC-Hyperswarm-proxy.
