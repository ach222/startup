import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let submitBtnClasses = "btn btn-primary";
  if (email === "" || username === "" || password === "") {
    submitBtnClasses += " disabled";
  }

  return (
    <main className="centered-content">
      <section className="centered-form-container">
        <form method="get" action="/">
          <fieldset>
            <legend>Create an Account</legend>
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
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="user-name"
                name="user-name"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                type="submit"
                className={submitBtnClasses}
                value="Register"
                onClick={() => onLogin(email.split("@")[0])}
              />
              <Link to="/" className="btn btn-link">
                Login instead
              </Link>
            </div>
          </fieldset>
        </form>
      </section>
    </main>
  );
}
