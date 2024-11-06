export function withRandomDelay(callback, maxDelayMilliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(
      () => resolve(callback()),
      Math.floor(Math.random() * maxDelayMilliseconds)
    );
  });
}
