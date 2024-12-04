const { ObjectId } = require("mongodb");
const { startupDb, withoutFieldFromIterableObjects } = require("./db");
const { MODE_EASY, MODE_HARD } = require("./constants");

const NUM_SCORES_TO_USE = 5;
const SCORE_SORT = { scoreWPM: -1 };

const scoresCollection = startupDb.collection("scores");

async function getHighScoresRaw(username) {
  return {
    personal: await scoresCollection
      .find({
        username,
      })
      .sort(SCORE_SORT)
      .limit(NUM_SCORES_TO_USE)
      .project({ _id: true, gameMode: true, scoreWPM: true })
      .toArray(),
    topEasy: await scoresCollection
      .find({ gameMode: MODE_EASY })
      .sort(SCORE_SORT)
      .limit(NUM_SCORES_TO_USE)
      .project({ _id: true, username: true, scoreWPM: true })
      .toArray(),
    topHard: await scoresCollection
      .find({ gameMode: MODE_HARD })
      .sort(SCORE_SORT)
      .limit(NUM_SCORES_TO_USE)
      .project({ _id: true, username: true, scoreWPM: true })
      .toArray(),
  };
}

/** Returns the high scores object from {@link getHighScoresRaw} with the `_id` field removed. */
async function getHighScoresFormatted(username) {
  const highScores = await getHighScoresRaw(username);

  return {
    personal: withoutFieldFromIterableObjects(highScores.personal, "_id"),
    topEasy: withoutFieldFromIterableObjects(highScores.topEasy, "_id"),
    topHard: withoutFieldFromIterableObjects(highScores.topHard, "_id"),
  };
}

/** Removes extra scores that are not displayed (per user). */
async function cleanHighScores(username) {
  const rawHighScores = await getHighScoresRaw(username);

  const excludeIdsSet = new Set();

  // Convert all objectIds from all categories to strings so they can be joined in a set
  for (const highScoreList of Object.values(rawHighScores)) {
    for (const highScore of highScoreList) {
      excludeIdsSet.add(highScore._id.toString());
    }
  }

  // Turn the set into a list and convert the strings back to objectIds
  const excludeIds = Array.from(excludeIdsSet.values()).map(
    (idStr) => new ObjectId(idStr)
  );

  await scoresCollection.deleteMany({
    _id: { $nin: excludeIds },
    username,
  });
}

async function publishScore(username, gameMode, scoreWPM) {
  await scoresCollection.insertOne({ username, gameMode, scoreWPM });

  // Remove excess high scores
  await cleanHighScores(username);

  const highScores = await getHighScoresFormatted(username);

  const globalScores =
    gameMode === MODE_EASY ? highScores.topEasy : highScores.topHard;

  const beatenPersonalScores = highScores.personal.filter(
    (highScore) => scoreWPM > highScore.scoreWPM
  );
  const beatenGlobalScores = globalScores.filter(
    (highScore) => scoreWPM > highScore.scoreWPM
  );

  return {
    didSetPersonalHighScore:
      highScores.personal.length < NUM_SCORES_TO_USE ||
      beatenPersonalScores.length > 0,
    didSetGlobalHighScore:
      globalScores.length < NUM_SCORES_TO_USE || beatenGlobalScores.length > 0,
  };
}

module.exports = {
  getHighScoresFormatted,
  publishScore,
};
