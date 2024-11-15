import React, { useEffect, useState } from "react";

import { MODE_TO_TEXT } from "./constants";
import "./css/scores.css";
import { MainLoader } from "./Loader";

export default function ScoresPage() {
  const [highScores, setHighScores] = useState(null);

  // Fetch scores.
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/scores");

        const json = await response.json();
        if (response.status === 200) {
          setHighScores(json);
        } else {
          setErrorText("An unknown error occured.");
        }
      } catch {
        setErrorText("An unknown error occured.");
      }
    })();
  }, []);

  if (highScores === null) {
    return <MainLoader />;
  }

  return <LoadedScoresPage highScores={highScores} />;
}

function LoadedScoresPage({ highScores }) {
  const uiPersonalHighScores = highScores.personal
    .toSorted((a, b) => b.scoreWPM - a.scoreWPM)
    .map((item, index) => (
      <tr key={index}>
        <td>{MODE_TO_TEXT[item.gameMode]}</td>
        <td>{Math.round(item.scoreWPM)}</td>
      </tr>
    ));

  const uiTopEasyHighScores = highScores.topEasy
    .toSorted((a, b) => b.scoreWPM - a.scoreWPM)
    .map((item, index) => (
      <tr key={index}>
        <td>{item.username}</td>
        <td>{Math.round(item.scoreWPM)}</td>
      </tr>
    ));

  const uiTopHardHighScores = highScores.topHard
    .toSorted((a, b) => b.scoreWPM - a.scoreWPM)
    .map((item, index) => (
      <tr key={index}>
        <td>{item.username}</td>
        <td>{Math.round(item.scoreWPM)}</td>
      </tr>
    ));

  return (
    <main id="scores" className="padded-content">
      <section>
        <h3>Personal High Scores</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Mode</th>
              <th>Score (WPM)</th>
            </tr>
          </thead>
          <tbody>
            {uiPersonalHighScores.length === 0 ? (
              <tr>
                <td colSpan={2}>No data.</td>
              </tr>
            ) : (
              uiPersonalHighScores
            )}
          </tbody>
        </table>
      </section>
      <section>
        <h3>Top Easy High Scores</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Username</th>
              <th>Score (WPM)</th>
            </tr>
          </thead>
          <tbody>
            {uiTopEasyHighScores.length === 0 ? (
              <tr>
                <td colSpan={2}>No data.</td>
              </tr>
            ) : (
              uiTopEasyHighScores
            )}
          </tbody>
        </table>
      </section>
      <section>
        <h3>Top Hard High Scores</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Username</th>
              <th>Score (WPM)</th>
            </tr>
          </thead>
          <tbody>
            {uiTopHardHighScores.length === 0 ? (
              <tr>
                <td colSpan={2}>No data.</td>
              </tr>
            ) : (
              uiTopHardHighScores
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
