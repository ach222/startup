import React, { useCallback, useState } from "react";

import { Link } from "react-router-dom";
import "./css/login.css";
import Loader from "./Loader";

export default function LoginPage({ onLogin }) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorText, setErrorText] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = !(isLoggingIn || email === "" || password === "");

  let submitBtnClasses = "btn btn-primary";
  if (!canSubmit) {
    submitBtnClasses += " disabled";
  }

  const handleLogin = useCallback(() => {
    if (!canSubmit) {
      return;
    }

    (async () => {
      setIsLoggingIn(true);
      try {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const json = await response.json();
        if (response.status === 200) {
          onLogin(json);
        } else {
          setErrorText(json.message);
        }
      } catch (e) {
        console.error(e);
        setErrorText("An unknown error occured.");
      } finally {
        setIsLoggingIn(false);
      }
    })();
  }, [canSubmit, email, password, onLogin]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleLogin();
      }
    },
    [handleLogin]
  );

  return (
    <main id="login" className="centered-content">
      <section className="centered-form-container">
        <form onKeyDown={handleKeyDown}>
          <fieldset>
            <legend>Login</legend>
            {errorText !== null && (
              <div className="mb-3">
                <span className="error">{errorText}</span>
              </div>
            )}
            <div className="mb-3">
              <label className="form-label" htmlFor="user-email">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="user-email"
                name="user-email"
                placeholder="Email"
                required
                disabled={isLoggingIn}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="user-password">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="user-password"
                name="user-password"
                placeholder="Password"
                required
                disabled={isLoggingIn}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="button"
                className={submitBtnClasses}
                onClick={handleLogin}
              >
                {isLoggingIn ? <Loader size="sm" boxSize="1em" /> : "Login"}
              </button>
              <Link to="/create-account" className="btn btn-link">
                Create an Account
              </Link>
            </div>
          </fieldset>
        </form>
      </section>

      <section id="get-code">
        <p>
          Get the source code{" "}
          <a href="https://github.com/ach222/startup">here</a>.
        </p>
      </section>
    </main>
  );
}
