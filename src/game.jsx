import React, { useEffect, useMemo, useRef, useState } from "react";

import { MODE_EASY, MODE_HARD, MODE_TO_TEXT } from "./constants";
import "./css/game.css";
import Loader from "./Loader";
import Notification from "./Notification";
import { withRandomDelay } from "./utils";

const CHAR_VALID = "valid";
const CHAR_EXTRA = "extra";
const CHAR_INVALID = "invalid";
const CHAR_UNTYPED = "untyped";

export default function GamePage({ authState }) {
  const [selectedGameMode, setSelectedGameMode] = useState(null);

  const onNewGame = () => {
    setSelectedGameMode(null);
  };

  return (
    <main>
      {selectedGameMode === null ? (
        <div className="centered-content">
          <section className="centered-form-container">
            <h3>Start a Game</h3>
            <div className="game-mode-selection-container">
              <button
                type="button"
                className="btn btn-success"
                onClick={() => setSelectedGameMode(MODE_EASY)}
              >
                Easy
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setSelectedGameMode(MODE_HARD)}
              >
                Hard
              </button>
            </div>
          </section>
        </div>
      ) : (
        <Game
          authState={authState}
          gameMode={selectedGameMode}
          onComplete={onNewGame}
        />
      )}
    </main>
  );
}

function Game({ authState, gameMode, onComplete }) {
  const [prompt, setPrompt] = useState(null);

  // Load the prompt (HTTP mock).
  useEffect(() => {
    (async () => {
      setPrompt(await withRandomDelay(() => "This is a test", 1000));
    })();
  }, []);

  if (prompt === null) {
    return <Loader />;
  }

  return (
    <GameWithPrompt
      authState={authState}
      prompt={prompt}
      gameMode={gameMode}
      onComplete={onComplete}
    />
  );
}

function GameWithPrompt({ authState, gameMode, prompt, onComplete }) {
  const [startTime, setStartTime] = useState(-1);

  const promptParts = useMemo(
    () => prompt.split(" ").filter((it) => it !== ""),
    [prompt]
  );

  const [typedText, setTypedText] = useState("");
  const typedTextParts = useMemo(
    () => typedText.split(" ").filter((it) => it !== ""),
    [typedText]
  );

  const fragments = useMemo(() => {
    const fragments = [];

    for (
      let wordIndex = 0;
      wordIndex < Math.max(promptParts.length, typedTextParts.length);
      wordIndex++
    ) {
      let fragment = [];
      // Handle non-extra words
      if (wordIndex < promptParts.length && wordIndex < typedTextParts.length) {
        const promptWord = promptParts[wordIndex];
        const typedTextWord = typedTextParts[wordIndex];

        for (
          let charIndex = 0;
          charIndex < Math.max(promptWord.length, typedTextWord.length);
          charIndex++
        ) {
          // Handle non-extra chars
          if (
            charIndex < promptWord.length &&
            charIndex < typedTextWord.length
          ) {
            if (
              promptWord[charIndex].toLowerCase() ===
              typedTextWord[charIndex].toLowerCase()
            ) {
              fragment.push({
                char: promptWord[charIndex],
                type: CHAR_VALID,
              });
            } else {
              fragment.push({
                char: promptWord[charIndex],
                type: CHAR_INVALID,
              });
            }
          }
          // Handle extra chars
          else if (charIndex < promptWord.length) {
            fragment.push({ char: promptWord[charIndex], type: CHAR_UNTYPED });
          } else if (charIndex < typedTextWord.length) {
            fragment.push({ char: typedTextWord[charIndex], type: CHAR_EXTRA });
          }
        }
      }
      // Handle extra words
      else if (wordIndex < promptParts.length) {
        fragment = Array.from(promptParts[wordIndex]).map((char) => ({
          char,
          type: CHAR_UNTYPED,
        }));
      } else if (wordIndex < typedTextParts.length) {
        fragment = Array.from(typedTextParts[wordIndex]).map((char) => ({
          char,
          type: CHAR_EXTRA,
        }));
      }

      fragments.push(fragment);
    }

    return fragments;
  }, [typedTextParts, promptParts]);

  const uiFragments = useMemo(() => {
    const components = [];

    let fragIdx = 0;
    for (const fragment of fragments) {
      let charIdx = 0;
      for (const charData of fragment) {
        components.push(
          <span
            key={`${fragIdx}-${charIdx}`}
            className={`text ${charData.type}`}
          >
            {charData.char}
          </span>
        );

        charIdx++;
      }

      components.push(<span key={`${fragIdx}-space`}> </span>);
      fragIdx++;
    }

    return components;
  }, [fragments]);

  const [numCharsCorrect, numCharsIncorrect, percentCorrect] = useMemo(() => {
    let numCharsCorrect = 0;
    let numCharsIncorrect = 0;
    for (const charData of fragments.flat()) {
      if (charData.type === CHAR_VALID) {
        numCharsCorrect++;
      } else if (
        charData.type === CHAR_INVALID ||
        charData.type === CHAR_EXTRA
      ) {
        numCharsIncorrect++;
      }
    }

    if (numCharsCorrect + numCharsIncorrect === 0) {
      return [numCharsCorrect, numCharsIncorrect, 0];
    }

    return [
      numCharsCorrect,
      numCharsIncorrect,
      numCharsCorrect / (numCharsCorrect + numCharsIncorrect),
    ];
  }, [fragments, promptParts]);

  // Same number of words and the last word is fully typed
  const hasWinner =
    typedTextParts.length >= promptParts.length &&
    typedTextParts[typedTextParts.length - 1].length >=
      promptParts[promptParts.length - 1].length;

  const [wpm, setWPM] = useState(0);

  const updateWPMRef = useRef(() => null);
  updateWPMRef.current = () => {
    if (startTime === -1) {
      return;
    }

    const numWordsCorrect = numCharsCorrect / 5;

    const dtMin = (Date.now() - startTime) / 1000 / 60;

    setWPM(numWordsCorrect / dtMin);
  };

  // Update the WPM every second
  useEffect(() => {
    // Stop the timer and do a final WPM update on winner.
    if (hasWinner) {
      updateWPMRef.current();
      return;
    }

    const intervalId = window.setInterval(() => updateWPMRef.current(), 1000);
    return () => window.clearInterval(intervalId);
  }, [hasWinner]);

  // Start the timer and update the WPM when the fragments change
  useEffect(() => {
    if (startTime === -1) {
      setStartTime(Date.now());
    }

    updateWPMRef.current();
  }, [fragments, startTime]);

  const [motivationalMessage, setMotivationalMessage] = useState(null);

  // Websocket mock
  const updateMotivationalMessageRef = useRef(() => null);
  updateMotivationalMessageRef.current = () => {
    if (motivationalMessage === null) {
      setMotivationalMessage(
        'This is a motivational message! Placeholder: WebSocket (sample notification; "encouraging" score goes here)'
      );
    } else {
      setMotivationalMessage(null);
    }
  };

  useEffect(() => {
    // Stop the timer and hide the message on winner.
    if (hasWinner) {
      setMotivationalMessage(null);
      return;
    }

    const intervalId = window.setInterval(
      () => updateMotivationalMessageRef.current(),
      5000
    );
    return () => window.clearInterval(intervalId);
  }, []);

  if (hasWinner) {
    return (
      <div className="centered-content">
        <section className="centered-form-container">
          <h3>{MODE_TO_TEXT[gameMode]} Game Complete!</h3>
          <p>
            Your score was {Math.round(wpm)} WPM with an accuracy of{" "}
            {Math.round(percentCorrect * 100)}%!
          </p>
          {wpm >= authState.highScoreWPM && (
            <p>
              You beat your high score WPM of{" "}
              {Math.round(authState.highScoreWPM)}!
            </p>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={onComplete}
          >
            New game
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="padded-content">
      <section>
        <div className="mb-3">
          <div>
            {Math.round(percentCorrect * 100)}% accuracy | WPM:{" "}
            {Math.round(wpm)}
          </div>
        </div>
        <div className="mb-3">
          <input
            type="text"
            id="typing-input"
            className="form-control"
            name="typing-input"
            placeholder="Start Typing!"
            autoFocus
            autoComplete="off"
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
          />
        </div>
        <div>
          <p>
            {uiFragments}
            <span className="text-typed"></span>
          </p>
          <p className="js-placeholder">Placeholder: Third-Party Service</p>
        </div>
      </section>

      {motivationalMessage !== null && (
        <Notification
          text={motivationalMessage}
          onClose={() => setMotivationalMessage(null)}
        />
      )}
    </div>
  );
}
