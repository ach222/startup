import React from "react";

import "./css/scores.css";

export default function ScoresPage() {
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
