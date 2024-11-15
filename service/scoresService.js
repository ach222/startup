const { startupDb } = require("./db");
const { MODE_EASY, MODE_HARD } = require("./constants");

const NUM_SCORES_TO_USE = 5;
const SCORE_SORT = { scoreWPM: -1 };

const scoresCollection = startupDb.collection("scores");

async function getHighScores(username) {
  return {
    personal: await scoresCollection
      .find({
        username,
      })
      .sort(SCORE_SORT)
      .limit(NUM_SCORES_TO_USE)
      .project({ _id: false, gameMode: true, scoreWPM: true })
      .toArray(),
    topEasy: await scoresCollection
      .find({ gameMode: MODE_EASY })
      .sort(SCORE_SORT)
      .limit(NUM_SCORES_TO_USE)
      .project({ _id: false, username: true, scoreWPM: true })
      .toArray(),
    topHard: await scoresCollection
      .find({ gameMode: MODE_HARD })
      .sort(SCORE_SORT)
      .limit(NUM_SCORES_TO_USE)
      .project({ _id: false, username: true, scoreWPM: true })
      .toArray(),
  };
}

async function publishScore(username, gameMode, scoreWPM) {
  await scoresCollection.insertOne({ username, gameMode, scoreWPM });

  const highScores = await getHighScores();

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
      beatenGlobalScores.length > 0,
    didSetGlobalHighScore:
      globalScores.length < NUM_SCORES_TO_USE ||
      beatenPersonalScores.length > 0,
  };
}

module.exports = {
  getHighScores,
  publishScore,
};
