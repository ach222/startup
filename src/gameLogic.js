const CHAR_VALID = "valid";
const CHAR_EXTRA = "extra";
const CHAR_INVALID = "invalid";
const CHAR_UNTYPED = "untyped";

export function computeGameState(promptText, typedText) {
  const promptParts = promptText.split(" ").filter((it) => it !== "");

  const typedTextParts = typedText.split(" ").filter((it) => it !== "");

  // Compute fragments
  const fragments = [];

  for (
    let wordIndex = 0;
    wordIndex < Math.max(promptParts.length, typedTextParts.length);
    wordIndex++
  ) {
    let fragment = [];
    // Handle non-extra words
    if (wordIndex < promptParts.length && wordIndex < typedTextParts.length) {
      const promptWord = promptParts[wordIndex];
      const typedTextWord = typedTextParts[wordIndex];

      for (
        let charIndex = 0;
        charIndex < Math.max(promptWord.length, typedTextWord.length);
        charIndex++
      ) {
        // Handle non-extra chars
        if (charIndex < promptWord.length && charIndex < typedTextWord.length) {
          if (promptWord[charIndex] === typedTextWord[charIndex]) {
            fragment.push({
              char: promptWord[charIndex],
              type: CHAR_VALID,
            });
          } else {
            fragment.push({
              char: promptWord[charIndex],
              type: CHAR_INVALID,
            });
          }
        }
        // Handle extra chars
        else if (charIndex < promptWord.length) {
          fragment.push({ char: promptWord[charIndex], type: CHAR_UNTYPED });
        } else if (charIndex < typedTextWord.length) {
          fragment.push({ char: typedTextWord[charIndex], type: CHAR_EXTRA });
        }
      }
    }
    // Handle extra words
    else if (wordIndex < promptParts.length) {
      fragment = Array.from(promptParts[wordIndex]).map((char) => ({
        char,
        type: CHAR_UNTYPED,
      }));
    } else if (wordIndex < typedTextParts.length) {
      fragment = Array.from(typedTextParts[wordIndex]).map((char) => ({
        char,
        type: CHAR_EXTRA,
      }));
    }

    fragments.push(fragment);
  }

  // Compute chars correct, chars incorrect, and accuracy

  let numCharsCorrect = 0;
  let numCharsIncorrect = 0;
  for (const charData of fragments.flat()) {
    if (charData.type === CHAR_VALID) {
      numCharsCorrect++;
    } else if (charData.type === CHAR_INVALID || charData.type === CHAR_EXTRA) {
      numCharsIncorrect++;
    }
  }

  let accuracy = 0;
  if (numCharsCorrect + numCharsIncorrect !== 0) {
    accuracy = numCharsCorrect / (numCharsCorrect + numCharsIncorrect);
  }

  // Compute winner
  // Same number of words and the last word is fully typed or more typed words than prompt words.
  const hasWinner =
    (typedTextParts.length == promptParts.length &&
      typedTextParts[typedTextParts.length - 1].length >=
        promptParts[promptParts.length - 1].length) ||
    typedTextParts.length > promptParts.length;

  return {
    fragments,
    numCharsCorrect,
    numCharsIncorrect,
    accuracy,
    hasWinner,
  };
}

export function computeWPM(
  startTime,
  currentTime,
  numCharsCorrect,
  numCharsIncorrect
) {
  if (startTime === -1) {
    return 0;
  }

  const charDiff = Math.max(0, numCharsCorrect - numCharsIncorrect);

  const wordsDiff = charDiff / 5;

  const dtMinutes = (currentTime - startTime) / 1000 / 60;

  if (dtMinutes === 0) {
    return 0; // This only occurs if someone tries to copy/paste the prompt; They simply get 0 wpm.
  }

  return wordsDiff / dtMinutes;
}
