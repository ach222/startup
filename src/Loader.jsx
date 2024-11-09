import React from "react";

import { Spinner } from "react-bootstrap";

/**
 * A loader that spins infinitely.
 */
export default function Loader() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

/**
 * A loader centered inside a main content tag.
 */
export function MainLoader() {
  return (
    <main className="centered-content">
      <section>
        <Loader />
      </section>
    </main>
  );
}
