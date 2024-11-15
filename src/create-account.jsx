import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader";

export default function LoginPage({ onLogin }) {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [errorText, setErrorText] = useState(null);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = !(
    isCreatingAccount ||
    email === "" ||
    username === "" ||
    password === ""
  );

  let submitBtnClasses = "btn btn-primary";
  if (!canSubmit) {
    submitBtnClasses += " disabled";
  }

  const handleCreateAccount = useCallback(() => {
    if (!canSubmit) {
      return;
    }

    (async () => {
      setIsCreatingAccount(true);
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
      } catch (e) {
        console.error(e);
        setErrorText("An unknown error occured.");
      } finally {
        setIsCreatingAccount(false);
      }
    })();
  }, [canSubmit, email, username, password, onLogin]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleCreateAccount();
      }
    },
    [handleCreateAccount]
  );

  return (
    <main id="create-account" className="centered-content">
      <section className="centered-form-container">
        <form onKeyDown={handleKeyDown}>
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
                disabled={isCreatingAccount}
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
                disabled={isCreatingAccount}
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
                disabled={isCreatingAccount}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="button"
                className={submitBtnClasses}
                onClick={handleCreateAccount}
              >
                {isCreatingAccount ? (
                  <Loader size="sm" boxSize="1em" />
                ) : (
                  "Register"
                )}
              </button>
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
