const { MongoClient } = require("mongodb");
const dbConfig = require("./dbConfig");

const dbClient = new MongoClient(dbConfig.url);
const startupDb = dbClient.db("startup");

async function ensureDB() {
  try {
    await dbClient.connect();
    await startupDb.command({ ping: 1 });
  } catch (e) {
    console.error(`Could not connect to db because ${e.message}.`);
    process.exit(1);
  }
}

/** Copies a list of objects and removes a key from each one. */
function withoutFieldFromIterableObjects(iterable, key) {
  const iterableCopy = structuredClone(iterable);

  for (const item of iterableCopy) {
    delete iterable[key];
  }

  return iterableCopy;
}

module.exports = {
  startupDb,
  ensureDB,
  withoutFieldFromIterableObjects,
};
