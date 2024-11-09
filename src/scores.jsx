import React, { useEffect, useState } from "react";

import { MODE_EASY, MODE_HARD, MODE_TO_TEXT } from "./constants";
import "./css/scores.css";
import { MainLoader } from "./Loader";
import { withRandomDelay } from "./utils";

export function getMockScores() {
  return {
    personal: [
      { mode: MODE_EASY, scoreWPM: 128 },
      { mode: MODE_HARD, scoreWPM: 122 },
    ],
    topEasy: [
      { username: "byustudent1", scoreWPM: 200 },
      { username: "byustudent2", scoreWPM: 198 },
    ],
    topHard: [
      { username: "byustudent1", scoreWPM: 100 },
      { username: "byustudent2", scoreWPM: 98 },
    ],
  };
}

export default function ScoresPage() {
  const [highScores, setHighScores] = useState(null);

  // Fetch scores (HTTP mock).
  useEffect(() => {
    (async () => {
      setHighScores(await withRandomDelay(getMockScores, 2000));
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
        <td>{MODE_TO_TEXT[item.mode]}</td>
        <td>{item.scoreWPM}</td>
      </tr>
    ));

  const uiTopEasyHighScores = highScores.topEasy
    .toSorted((a, b) => b.scoreWPM - a.scoreWPM)
    .map((item, index) => (
      <tr key={index}>
        <td>{item.username}</td>
        <td>{item.scoreWPM}</td>
      </tr>
    ));

  const uiTopHardHighScores = highScores.topHard
    .toSorted((a, b) => b.scoreWPM - a.scoreWPM)
    .map((item, index) => (
      <tr key={index}>
        <td>{item.username}</td>
        <td>{item.scoreWPM}</td>
      </tr>
    ));

  return (
    <main className="padded-content">
      <section className="js-placeholder">
        Placeholder: Database (whole page)
      </section>
      <section>
        <h3>Personal High Scores</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Mode</th>
              <th>Score (WPM)</th>
            </tr>
          </thead>
          <tbody>{uiPersonalHighScores}</tbody>
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
          <tbody>{uiTopEasyHighScores}</tbody>
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
          <tbody>{uiTopHardHighScores}</tbody>
        </table>
      </section>
    </main>
  );
}
