import React, { useEffect, useState } from "react";

import { Spinner } from "react-bootstrap";
import "./css/scores.css";

export default function ScoresPage() {
  const [personalHighScores, setPersonalHighScores] = useState(null);
  const [topEasyHighScores, setTopEasyHighScores] = useState(null);
  const [topHardHighScores, setTopHardHighScores] = useState(null);

  // Fetch scores
  useEffect(() => {
    (async () => {
      setPersonalHighScores(
        await withRandomDelay(
          () => [
            { mode: "easy", score: 128 },
            { mode: "hard", score: 122 },
          ],
          2000
        )
      );
    })();

    (async () => {
      setTopEasyHighScores(
        await withRandomDelay(
          () => [
            { username: "byustudent1", score: 128 },
            { username: "byustudent2", score: 122 },
          ],
          2000
        )
      );
    })();

    (async () => {
      setTopHardHighScores(
        await withRandomDelay(
          () => [
            { username: "byustudent1", score: 128 },
            { username: "byustudent2", score: 122 },
          ],
          2000
        )
      );
    })();
  }, []);

  if (
    personalHighScores === null ||
    topEasyHighScores === null ||
    topHardHighScores === null
  ) {
    return (
      <main className="centered-content">
        <Spinner animation="border" />
      </main>
    );
  }

  return (
    <LoadedScoresPage
      personalHighScores={personalHighScores}
      topEasyHighScores={topEasyHighScores}
      topHardHighScores={topHardHighScores}
    />
  );
}

function LoadedScoresPage({
  personalHighScores,
  topEasyHighScores,
  topHardHighScores,
}) {
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
          <tbody>
            <tr>
              <td>Easy</td>
              <td>100</td>
            </tr>
            <tr>
              <td>Hard</td>
              <td>80</td>
            </tr>
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
            <tr>
              <td>byustudent1</td>
              <td>100</td>
            </tr>
            <tr>
              <td>byustudent2</td>
              <td>80</td>
            </tr>
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
            <tr>
              <td>byustudent1</td>
              <td>100</td>
            </tr>
            <tr>
              <td>byustudent2</td>
              <td>80</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
