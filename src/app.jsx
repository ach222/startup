import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import AboutPage from "./about";
import CreateAccountPage from "./create-account";
import "./css/main.css";
import GamePage from "./game";
import LoginPage from "./login";
import NotFoundPage from "./not-found";
import ScoresPage from "./scores";

export default function App() {
  return (
    <BrowserRouter>
      <header>
        <nav className="navbar navbar-expand-sm">
          <div className="container-fluid">
            <NavLink to="" className="navbar-brand">
              TinyType
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#nav-collapse-section"
              aria-controls="nav-collapse-section"
              aria-expanded="false"
              aria-label="Expand navigation bar"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="nav-collapse-section">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink to="login" className="nav-link">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="game" className="nav-link">
                    Play
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="scores" className="nav-link">
                    Highscores
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="about" className="nav-link">
                    About
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="login" />} exact />
        <Route path="/login" element={<LoginPage />} exact />
        <Route path="/create-account" element={<CreateAccountPage />} exact />
        <Route path="/game" element={<GamePage />} exact />
        <Route path="/scores" element={<ScoresPage />} exact />
        <Route path="/about" element={<AboutPage />} exact />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <footer>
        <span>
          Written by <a href="https://github.com/ach222">Alden Howard</a>. Get
          the source code <a href="https://github.com/ach222/startup">here</a>.
        </span>
      </footer>
    </BrowserRouter>
  );
}
