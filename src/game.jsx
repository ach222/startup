import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import { MODE_EASY, MODE_HARD, MODE_TO_TEXT } from "./constants";
import "./css/game.css";
import Loader, { MainLoader } from "./Loader";
import Notification from "./Notification";

const CHAR_VALID = "valid";
const CHAR_EXTRA = "extra";
const CHAR_INVALID = "invalid";
const CHAR_UNTYPED = "untyped";

export default function GamePage() {
  const [selectedGameMode, setSelectedGameMode] = useState(null);

  const onNewGame = () => {
    setSelectedGameMode(null);
  };

  return (
    <main id="game">
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
        <Game gameMode={selectedGameMode} onComplete={onNewGame} />
      )}
    </main>
  );
}

function Game({ gameMode, onComplete }) {
  const [promptFetchError, setFetchError] = useState(null);
  const [prompt, setPrompt] = useState(null);

  // Load the prompt (HTTP mock).
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/prompt?gameMode=${gameMode}`);
        const json = await response.json();
        if (response.status === 200) {
          setPrompt(json);
        } else {
          setFetchError(json.message);
        }
      } catch (e) {
        setFetchError("An unknown error occured.");
        console.error(e);
      }
    })();
  }, []);

  if (promptFetchError !== null) {
    return <div className="error">{promptFetchError}</div>;
  }

  if (prompt === null) {
    return <MainLoader />;
  }

  return (
    <GameWithPrompt
      prompt={prompt}
      gameMode={gameMode}
      onComplete={onComplete}
    />
  );
}

function GameWithPrompt({ gameMode, prompt, onComplete }) {
  const [startTime, setStartTime] = useState(-1);

  const promptParts = useMemo(
    () => prompt.text.split(" ").filter((it) => it !== ""),
    [prompt.text]
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

  const [displayWPM, setDisplayWPM] = useState(0); // Debounced WPM displayed to the user
  const [completeWPM, setCompleteWPM] = useState(-1); // WPM set on win

  const instantaneousWPM = useMemo(() => {
    if (startTime === -1) {
      return;
    }

    const charDiff = Math.max(0, numCharsCorrect - numCharsIncorrect);

    const wordsDiff = charDiff / 5;

    const dtMinutes = (Date.now() - startTime) / 1000 / 60;

    return wordsDiff / dtMinutes;
  }, [numCharsCorrect, numCharsIncorrect, startTime]);

  const updateDisplayWPM = useCallback(() => {
    setDisplayWPM(instantaneousWPM);
  }, [instantaneousWPM]);

  // Same number of words and the last word is fully typed or more typed words than prompt words.
  const [hasWinner, setHasWinner] = useState(false);
  const _hasWinner =
    (typedTextParts.length == promptParts.length &&
      typedTextParts[typedTextParts.length - 1].length >=
        promptParts[promptParts.length - 1].length) ||
    typedTextParts.length > promptParts.length;
  if (!hasWinner && _hasWinner) {
    setHasWinner(true);
    setCompleteWPM(instantaneousWPM);
  }

  // Update the WPM every second or when the typed text changes
  useEffect(() => {
    // Stop the timer and do a final WPM update on winner.
    if (hasWinner) {
      return () => null;
    }

    let intervalId = -1;

    const updateLoop = () => {
      updateDisplayWPM();
      intervalId = window.setTimeout(updateLoop, 1000);
    };

    intervalId = window.setTimeout(updateLoop, 1000);

    return () => {
      if (intervalId === -1) {
        return;
      }

      window.clearTimeout(intervalId);
    };
  }, [hasWinner, updateDisplayWPM]);

  // Start the timer and recompute the WPM when the fragments change
  useEffect(() => {
    if (startTime === -1) {
      setStartTime(Date.now());
    }

    updateDisplayWPM();
  }, [fragments, startTime]);

  const [motivationalMessage, setMotivationalMessage] = useState(null);

  // Websocket mock
  const updateMotivationalMessage = useCallback(() => {
    if (motivationalMessage === null) {
      setMotivationalMessage(
        'This is a motivational message! Placeholder: WebSocket (sample notification; "encouraging" score goes here)'
      );
    } else {
      setMotivationalMessage(null);
    }
  }, [motivationalMessage]);

  useEffect(() => {
    // Stop the timer and hide the message on winner.
    if (hasWinner) {
      setMotivationalMessage(null);
      return () => null;
    }

    let intervalId = -1;

    const updateLoop = () => {
      updateMotivationalMessage();
      intervalId = window.setTimeout(updateLoop, 5000);
    };

    intervalId = window.setTimeout(updateLoop, 5000);

    return () => {
      if (intervalId === -1) {
        return;
      }

      window.clearTimeout(intervalId);
    };
  }, [hasWinner, updateMotivationalMessage]);

  useEffect(() => {
    // Stop the timer and hide the message on winner.
    if (hasWinner) {
      setMotivationalMessage(null);
      return;
    }

    const intervalId = window.setInterval(
      () => updateMotivationalMessage(),
      5000
    );
    return () => window.clearInterval(intervalId);
  }, [updateMotivationalMessage]);

  if (hasWinner && completeWPM !== -1) {
    return (
      <div className="centered-content">
        <section className="centered-form-container">
          <h3>{MODE_TO_TEXT[gameMode]} Game Complete!</h3>
          <p>
            Your score was {Math.round(completeWPM)} WPM with an accuracy of{" "}
            {Math.round(percentCorrect * 100)}%!
          </p>
          <GameCompletionHighScore wpm={completeWPM} gameMode={gameMode} />

          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onComplete}
            >
              New game
            </button>
            <Link to="/scores" className="btn btn-link">
              High Scores
            </Link>
          </div>
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
            {Math.round(displayWPM)}
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
          <p className="prompt">{uiFragments}</p>
          <p className="caption">
            Text courtesy of <a href="https://wikipedia.org">Wikipedia</a>. This
            excerpt comes from the article titled{" "}
            <a href={prompt.link}>{prompt.title}</a>.
          </p>
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

/**
 * Tells the player if they have beaten any high scores.
 */
function GameCompletionHighScore({ wpm, gameMode }) {
  const [sendScoresError, setSendScoresError] = useState(null);
  const [didSetHighScores, setDidSetHighScores] = useState(null);

  // Submit score
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameMode,
            scoreWPM: wpm,
          }),
        });

        const json = await response.json();
        if (response.status === 200) {
          setDidSetHighScores(json);
        } else {
          setSendScoresError(json.message);
        }
      } catch (e) {
        setSendScoresError("An unknown error occured.");
        console.error(e);
      }
    })();
  }, []);

  if (sendScoresError !== null) {
    return <div className="error">{sendScoresError}</div>;
  }

  if (didSetHighScores === null) {
    return <Loader />;
  }

  return (
    <>
      {didSetHighScores.didSetGlobalHighScore && (
        <p>You set a new global high score!</p>
      )}
      {didSetHighScores.didSetPersonalHighScore && (
        <p>You set a new personal high score!</p>
      )}
      {!didSetHighScores.didSetGlobalHighScore &&
        !didSetHighScores.didSetPersonalHighScore && (
          <p>You didn't set any high scores this time.</p>
        )}
    </>
  );
}
