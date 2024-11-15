import React from "react";

import "./css/about.css";

export default function AboutPage() {
  return (
    <main id="about" className="padded-content">
      <section>
        <p>
          <img
            id="logo"
            src="/img/logo-512.png"
            alt="TinyType Logo"
            width="128"
          />
          TinyType is a single-player competitive typing game. Word-per-minute
          values are calculated as you type. As other players post high scores,
          notifications are shown to you during gameplay to provide
          encouragement. Typing samples are sourced from{" "}
          <a href="https://wikipedia.org">Wikipedia</a>. Do you think you have
          what it takes to climb the leaderboards?
        </p>
        <p>
          Created for BYU's{" "}
          <a href="https://catalog.byu.edu/courses/13420-000">CS260</a> course.
        </p>
      </section>
    </main>
  );
}
