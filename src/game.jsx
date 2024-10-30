import React from "react";

import "./css/game.css";

export default function GamePage() {
  return (
    <main>
      <div className="centered-content" style={{ display: "none" }}>
        <section className="centered-form-container">
          <h3>Start a Game</h3>
          <div>
            <button type="button" className="btn btn-success">
              Easy
            </button>
            <button type="button" className="btn btn-danger">
              Hard
            </button>
          </div>
        </section>
      </div>

      <div className="padded-content" style={{ display: "block" }}>
        <section>
          <div className="mb-3">
            <div>
              WPM:{" "}
              <span className="js-placeholder">Placeholder: JavaScript</span>
            </div>
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="typing-input"
              className="form-control"
              name="typing-input"
              placeholder="Start Typing!"
              value="This is a sample"
              onChange={() => null}
            />
          </div>
          <div>
            <p>
              <span className="text-typed">This is a sample</span> of text to
              that has been partially typed...
            </p>
            <p className="js-placeholder">
              Placeholder: Third-Party Service (paragraph goes here)
            </p>
          </div>
        </section>
      </div>

      <div className="notification">
        <div className="close-btn">
          <a href="#">Close</a>
        </div>
        <div className="js-placeholder">
          Placeholder: WebSocket (sample notification; "encouraging" score goes
          here)
        </div>
      </div>
    </main>
  );
}
