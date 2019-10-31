# Hyperswarm with HTTP

[Hyperswarm](https://github.com/hyperswarm/hyperswarm) is a technology to realize serverless, peer-to-peer (P2P) discovery for peers interested in a particular topic. [Paul Frazee detailed](https://pfrazee.hashbase.io/blog/hyperswarm) most of its prospects on this blog: It uses a new [Kademlia](https://en.wikipedia.org/wiki/Kademlia) DHT, which also implements useful features like hole-punching.

For my thesis work ([code](https://github.com/falafeljan/from-me-to-you), [blog](https://kassel.works/thesis)), I intend to overcome current issues that CRDTs like [Automerge](https://github.com/automerge/automerge) have with browser technology by using W3C standards, but in a decentralized manner. While browser APIs don't allow access to files or low-level networking (like UDP sockets), using web standards like [Linked Web Annotations](https://www.w3.org/TR/annotation-model/) allows to work with a broadly-supported technology stack.

This project aims to test Hyperswarm with simple HTTP requests, and ultimately provide simple library functions for web clients and "servers" (natively running applications) alike. Originally, WebRTC was inteded to create _'decentralized'_ gateway bridges (via [`@geut/discovery-swarm-webrtc`](https://github.com/geut/discovery-swarm-webrtc)), but WebRTC didn't work well in our tests. Hence, we switched over to fixed-host gateways using WebSockets (via [`websocket-stream`](https://github.com/maxogden/websocket-stream)).

## Running the Experiment

1. `node server.js` Start a ‘serving’ peer (receiving HTTP requests via Hyperswarm).
2. `node client.js` Start a ‘requesting’ peer (sending HTTP requests and receiving responses, connecting to the server).
3. `node proxy.js [<port>]` Start a proxy that relays Hyperswarm protocol messages from a WebSocket stream into the Hyperswarm network. `port` defaults to 4200.
4. `npm run dev` Set your browser to `http://localhost:3000/`. The client will connect to the server via the WebSocket gateway.

## Related Work

- Maymounkov, P., & Mazières, D. (2002). Kademlia: A Peer-to-Peer Information System Based on the XOR Metric. In Peer-to-Peer Systems (pp. 53–65). Springer Berlin Heidelberg. https://doi.org/10.1007/3-540-45748-8_5
- Kleppmann, M., Wiggins, A., van Hardenberg, P., & McGranaghan, M. (2019). Local-first software: you own your data, in spite of the cloud. In Proceedings of the 2019 ACM SIGPLAN International Symposium on New Ideas, New Paradigms, and Reflections on Programming and Software - Onward! 2019. ACM Press. https://doi.org/10.1145/3359591.3359737
- Frazee, P. (2018). Announcing Hyperswarm. [online] pfrazee.hashbase.io. Available at: https://pfrazee.hashbase.io/blog/hyperswarm [Accessed 24 Oct. 2019].
