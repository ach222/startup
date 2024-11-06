import React, { useState } from "react";

import { Link } from "react-router-dom";
import "./css/login.css";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let submitBtnClasses = "btn btn-primary";
  if (email === "" || password === "") {
    submitBtnClasses += " disabled";
  }

  return (
    <main className="centered-content">
      <section className="centered-form-container">
        <form method="get" action="/game.html">
          <fieldset>
            <legend>Login</legend>
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
                onClick={() => onLogin(email.split("@")[0])}
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
