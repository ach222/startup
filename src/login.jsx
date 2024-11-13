import React, { useCallback, useState } from "react";

import { Link } from "react-router-dom";
import "./css/login.css";

export default function LoginPage({ onLogin }) {
  const [errorText, setErrorText] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let submitBtnClasses = "btn btn-primary";
  if (email === "" || password === "") {
    submitBtnClasses += " disabled";
  }

  const handleLogin = useCallback(() => {
    (async () => {
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
      } catch {
        setErrorText("An unknown error occured.");
      }
    })();
  }, [email, password, onLogin]);

  return (
    <main className="centered-content">
      <section className="centered-form-container">
        <form>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                type="button"
                className={submitBtnClasses}
                value="Login"
                onClick={handleLogin}
              />
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
