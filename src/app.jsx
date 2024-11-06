import React, { useCallback, useEffect, useState } from "react";

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
  const [authState, setAuthState] = useState(null);

  // Load the auth state (HTTP mock).
  useEffect(() => {
    const loadedAuthState = window.localStorage.getItem("authState");

    if (loadedAuthState === null || loadedAuthState === "") {
      setAuthState({
        isLoggedIn: false,
      });

      return;
    }

    setAuthState(JSON.parse(loadedAuthState));
  }, []);

  const onLogin = useCallback((username) => {
    const newAuthState = {
      isLoggedIn: true,
      username,
      highScoreWPM: 10,
    };

    window.localStorage.setItem("authState", JSON.stringify(newAuthState));
    setAuthState(newAuthState);
  }, []);

  const onLogout = useCallback((username) => {
    const newAuthState = {
      isLoggedIn: false,
    };

    window.localStorage.setItem("authState", JSON.stringify(newAuthState));
    setAuthState(newAuthState);
  }, []);

  if (authState === null) {
    return null;
  }

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
                {!authState.isLoggedIn && (
                  <li className="nav-item">
                    <NavLink to="login" className="nav-link">
                      Login
                    </NavLink>
                  </li>
                )}
                {authState.isLoggedIn && (
                  <>
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
                  </>
                )}

                <li className="nav-item">
                  <NavLink to="about" className="nav-link">
                    About
                  </NavLink>
                </li>
              </ul>
              <div className="nav-filler"></div>
              <ul className="navbar-nav">
                {authState.isLoggedIn && (
                  <li className="nav-item">
                    <a href="#" className="nav-link" onClick={onLogout}>
                      {authState.username} - Logout
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            authState.isLoggedIn ? (
              <Navigate to="/game" />
            ) : (
              <Navigate to="/login" />
            )
          }
          exact
        />
        <Route
          path="/login"
          element={
            authState.isLoggedIn ? (
              <Navigate to="/game" />
            ) : (
              <LoginPage onLogin={onLogin} />
            )
          }
          exact
        />
        <Route
          path="/create-account"
          element={
            authState.isLoggedIn ? (
              <Navigate to="/game" />
            ) : (
              <CreateAccountPage onLogin={onLogin} />
            )
          }
          exact
        />
        <Route
          path="/game"
          element={
            authState.isLoggedIn ? (
              <GamePage authState={authState} />
            ) : (
              <Navigate to="/login" />
            )
          }
          exact
        />
        <Route
          path="/scores"
          element={
            authState.isLoggedIn ? <ScoresPage /> : <Navigate to="/login" />
          }
          exact
        />
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
