import { useCallback, useEffect, useRef, useState } from "react";

export const MESSAGE_GAME_START = "game_start";
export const MESSAGE_GAME_COMPLETE = "game_complete";

const MESSAGE_AUTO_CLOSE_SECONDS = 5;

export default function useMotivationalMessageWebSocket(isActive, currentWPM) {
  const [motivationalMessageState, setMotivationalMessageState] =
    useState(null); // Popup message
  const hideTimerRef = useRef(-1);

  const clearMotivationalMessageState = useCallback(() => {
    setMotivationalMessageState(null);

    if (hideTimerRef.current !== -1) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = -1;
    }
  }, []);

  if (
    !isActive &&
    (motivationalMessageState !== null || hideTimerRef.current !== -1)
  ) {
    clearMotivationalMessageState();
  }

  const startCloseTimer = useCallback(() => {
    if (hideTimerRef.current !== -1) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = -1;
    }

    hideTimerRef.current = window.setTimeout(() => {
      clearMotivationalMessageState(null);
      hideTimerRef.current = -1;
    }, MESSAGE_AUTO_CLOSE_SECONDS * 1000);
  }, []);

  const updateMotivationalMessage = useCallback(
    (message) => {
      switch (message.type) {
        case MESSAGE_GAME_START:
          setMotivationalMessageState({
            type: MESSAGE_GAME_START,
            data: {
              username: message.data.username,
              gameMode: message.data.gameMode,
            },
          });
          startCloseTimer();
          break;
        case MESSAGE_GAME_COMPLETE:
          setMotivationalMessageState({
            type: MESSAGE_GAME_COMPLETE,
            data: {
              myWPM: currentWPM,
              username: message.data.username,
              gameMode: message.data.gameMode,
              scoreWPM: message.data.scoreWPM,
            },
          });
          startCloseTimer();
          break;
        default:
          console.warn(
            `Got a websocket message with an unknown type: "${message.type}".`
          );
          break;
      }
    },
    [currentWPM, startCloseTimer]
  );

  const updateMotivationalMessageRef = useRef(updateMotivationalMessage);
  updateMotivationalMessageRef.current = updateMotivationalMessage;

  useEffect(() => {
    if (!isActive) {
      return () => undefined;
    }

    const ws = new WebSocket("/api/scores-ws");
    ws.addEventListener("message", (e) => {
      const message = JSON.parse(e.data);
      updateMotivationalMessageRef.current(message);
    });

    ws.addEventListener("error", (e) => console.error("Websocket error!", e));

    ws.addEventListener("close", (e) => console.error("Websocket closed!", e));

    return () => {
      ws.close();
    };
  }, [isActive]);

  return [motivationalMessageState, clearMotivationalMessageState];
}
