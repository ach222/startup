import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [errorText, setErrorText] = useState(null);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let submitBtnClasses = "btn btn-primary";
  if (email === "" || username === "" || password === "") {
    submitBtnClasses += " disabled";
  }

  const handleCreateAccount = useCallback(() => {
    (async () => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            username,
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
  }, [email, username, password, onLogin]);

  return (
    <main className="centered-content">
      <section className="centered-form-container">
        <form>
          <fieldset>
            <legend>Create an Account</legend>
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
                type="button"
                className={submitBtnClasses}
                value="Register"
                onClick={handleCreateAccount}
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
