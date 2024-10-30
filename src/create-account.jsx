import React from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
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
              />
            </div>
            <div>
              <input
                type="submit"
                className="btn btn-primary"
                value="Register"
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
