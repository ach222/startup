import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import { MODE_EASY, MODE_HARD, MODE_TO_TEXT } from "./constants";
import "./css/game.css";
import { computeGameState, computeWPM } from "./gameLogic";
import Loader, { MainLoader } from "./Loader";
import Notification from "./Notification";
import useScoreWebSocket, {
  MESSAGE_GAME_COMPLETE,
  MESSAGE_GAME_START,
} from "./useScoreWebSocket";

const WPM_TIE_MARGIN = 5;

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
        console.error(e);
        setFetchError("An unknown error occured.");
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
  const [typedText, setTypedText] = useState("");
  const [gameStateObject, setGameStateObject] = useState(
    computeGameState(prompt.text, "")
  ); // Game state; see the return value for `computeGameState`.
  const [displayWPM, setDisplayWPM] = useState(0); // Debounced WPM displayed to the user
  const [hasWinner, setHasWinner] = useState(false);
  const [completeWPM, setCompleteWPM] = useState(-1); // WPM set on win

  const uiFragments = useMemo(() => {
    const components = [];

    let fragIdx = 0;
    for (const fragment of gameStateObject.fragments) {
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
  }, [gameStateObject.fragments]);

  // Update the WPM every second or when the typed text changes
  useEffect(
    () => {
      // Stop the timer
      if (hasWinner) {
        return () => null;
      }

      let intervalId = -1;

      const updateLoop = () => {
        const { numCharsCorrect, numCharsIncorrect } = gameStateObject;
        const wpm = computeWPM(
          startTime,
          Date.now(),
          numCharsCorrect,
          numCharsIncorrect
        );

        setDisplayWPM(wpm);

        intervalId = window.setTimeout(updateLoop, 1000);
      };

      intervalId = window.setTimeout(updateLoop, 1000);

      return () => {
        if (intervalId === -1) {
          return;
        }

        window.clearTimeout(intervalId);
      };
    },
    [
      hasWinner,
      startTime,
      gameStateObject.numCharsCorrect,
      gameStateObject.numCharsIncorrect,
    ],
    gameStateObject
  );

  const [motivationalMessageState, clearMotivationalMessage] =
    useScoreWebSocket(!hasWinner, displayWPM);

  const uiMotivationalMessage = useMemo(() => {
    if (motivationalMessageState === null) {
      return null;
    }

    switch (motivationalMessageState.type) {
      case MESSAGE_GAME_START:
        const { username, gameMode } = motivationalMessageState.data;

        return (
          <span>
            <span className="bold">{username}</span> just started a{" "}
            <span className="bold">{MODE_TO_TEXT[gameMode].toLowerCase()}</span>{" "}
            game. The competition is heating up!
          </span>
        );
      case MESSAGE_GAME_COMPLETE: {
        const { myWPM, username, gameMode, scoreWPM } =
          motivationalMessageState.data;

        const completedFrag = (
          <>
            <span className="bold">{username}</span> just completed a game with
            a score of <span className="bold">{Math.round(scoreWPM)}</span> on{" "}
            <span className="bold">{MODE_TO_TEXT[gameMode].toLowerCase()}</span>
            !
          </>
        );

        if (myWPM > scoreWPM + WPM_TIE_MARGIN) {
          return <span>{completedFrag} You're crushing it!</span>;
        } else if (myWPM < scoreWPM - WPM_TIE_MARGIN) {
          return <span>{completedFrag} Better go faster!</span>;
        } else {
          return (
            <span>{completedFrag}. You're neck and neck! Keep it up!</span>
          );
        }
      }

      default:
        return null;
    }
  }, [motivationalMessageState]);

  const handleTypedTextChange = useCallback(
    (e) => {
      let _startTime = startTime;
      if (startTime === -1) {
        _startTime = Date.now();
        setStartTime(_startTime);
      }

      const newText = e.target.value;
      const newGameState = computeGameState(prompt.text, newText);
      const { numCharsCorrect, numCharsIncorrect, hasWinner } = newGameState;

      const wpm = computeWPM(
        _startTime,
        Date.now(),
        numCharsCorrect,
        numCharsIncorrect
      );

      setTypedText(newText);
      setGameStateObject(newGameState);
      setDisplayWPM(wpm);

      // Handle winner
      if (hasWinner) {
        setHasWinner(true);
        setCompleteWPM(wpm);
      }
    },
    [startTime, prompt.text]
  );

  if (hasWinner && completeWPM !== -1) {
    return (
      <div className="centered-content">
        <section className="centered-form-container">
          <h3>{MODE_TO_TEXT[gameMode]} Game Complete!</h3>
          <p>
            Your score was {Math.round(completeWPM)} WPM with an accuracy of{" "}
            {Math.round(gameStateObject.accuracy * 100)}%!
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
            {Math.round(gameStateObject.accuracy * 100)}% accuracy | WPM:{" "}
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
            onChange={handleTypedTextChange}
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

      {uiMotivationalMessage !== null && (
        <Notification
          text={uiMotivationalMessage}
          onClose={clearMotivationalMessage}
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
        console.error(e);
        setSendScoresError("An unknown error occured.");
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
        <p className="bold success">You set a new global high score!</p>
      )}
      {didSetHighScores.didSetPersonalHighScore && (
        <p className="bold success">You set a new personal high score!</p>
      )}
      {!didSetHighScores.didSetGlobalHighScore &&
        !didSetHighScores.didSetPersonalHighScore && (
          <p>You didn't set any high scores this time.</p>
        )}
    </>
  );
}
