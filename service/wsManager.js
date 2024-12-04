const { WebSocketServer } = require("ws");
const { v4: uuid4 } = require("uuid");

class WebSocketManager {
  clients = {};

  static #MESSAGE_GAME_START = "game_start";
  static #MESSAGE_GAME_COMPLETE = "game_complete";

  constructor(server, path) {
    this.wss = new WebSocketServer({ server, path });
    this.pingIntervalHook = -1;

    this.wss.on("connection", this.#handleNewClient.bind(this));
  }

  #handleNewClient(ws) {
    const uuid = uuid4();

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

    for (const client of Object.values(this.clients)) {
      if (!client.isAlive) {
        toRemove.add(client);
        continue;
      }

      client.alive = false;
      client.ws.ping();
    }

    for (const uuidToRemove of toRemove.values()) {
      this.clients[uuidToRemove].ws.terminate();
      delete this.clients[uuidToRemove];
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

  /** Notify all clients of a game start. */
  broadcastGameStart(username, gameMode) {
    for (const { ws } of Object.values(this.clients)) {
      ws.send(
        JSON.stringify({
          type: WebSocketManager.#MESSAGE_GAME_START,
          data: { username, gameMode },
        })
      );
    }
  }

  /** Notify all clients of a new highscore. */
  broadcastGameComplete(username, gameMode, scoreWPM) {
    for (const { ws } of Object.values(this.clients)) {
      ws.send(
        JSON.stringify({
          type: WebSocketManager.#MESSAGE_GAME_COMPLETE,
          data: { username, gameMode, scoreWPM },
        })
      );
    }
  }
}

module.exports = { WebSocketManager };
