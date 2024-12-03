const { WebSocketServer } = require("ws");
const uuid = require("uuid");

class WebSocketManager {
  clients = {};

  constructor() {
    this.wss = WebSocketServer({ noServer: true });
    this.pingIntervalHook = -1;

    this.wss.on("connection", this.#handleNewClient.bind(this));
  }

  #handleNewClient(ws) {
    const uuid = uuid.v4();

    const clientObject = {
      uuid,
      ws,
      isAlive: true,
    };

    ws.on("pong", () => {
      clientObject.isAlive = true;
    });

    ws.on("close", () => {
      delete this.clients[uuid];
    });

    this.clients[uuid] = clientObject;
  }

  #keepAlive() {
    const toRemove = new Set();

    for (const client of self.clients) {
      if (!client.isAlive) {
        toRemove.add(client);
        continue;
      }

      client.alive = false;
      client.ws.ping();
    }

    for (const uuidToRemove of toRemove.values()) {
      self.clients[uuidToRemove].ws.terminate();
      delete self.clients[uuidToRemove];
    }
  }

  /** Start the ping loop. */
  start() {
    if (this.pingIntervalHook !== -1) {
      console.warn("Tried to start an already started WebSocketManager.");
      return;
    }

    this.pingIntervalHook = setInterval(this.#keepAlive.bind(this), 10000);
  }

  /** Stop the ping loop. */
  stop() {
    if (this.pingIntervalHook === -1) {
      console.warn("Tried to stop an already stopped WebSocketManager.");
      return;
    }

    clearInterval(this.pingIntervalHook);
    this.pingIntervalHook = -1;
  }

  /** Notify all clients of a new highscore. */
  broadcastHighScore(highScore) {
    for (const { ws } of self.clients) {
      ws.send(JSON.stringify(highScore));
    }
  }
}
