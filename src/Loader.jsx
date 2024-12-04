import React from "react";

import { Spinner } from "react-bootstrap";

/**
 * A loader that spins infinitely.
 */
export default function Loader({ size, boxSize }) {
  return (
    <Spinner
      size={size}
      animation="border"
      style={{ width: boxSize, height: boxSize }}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

/**
 * A loader centered inside a main content tag.
 */
export function MainLoader({ ...props }) {
  return (
    <main className="centered-content always-centered">
      <section>
        <Loader {...props} />
      </section>
    </main>
  );
}
