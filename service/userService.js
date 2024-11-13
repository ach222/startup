const { MongoClient } = require("mongodb");
const dbConfig = require("./secrets/dbconfig");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const dbClient = new MongoClient(dbConfig.url);
const startupDb = dbClient.db("startup");
const usersCollection = startupDb.collection("users");

async function ensureDB() {
  try {
    await dbClient.connect();
    await startupDb.command({ ping: 1 });
  } catch (e) {
    console.error(`Could not connect to db because ${e.message}.`);
    process.exit(1);
  }
}

function newToken() {
  return uuid.v4();
}

async function newUser(email, username, password) {
  const newSessionToken = newToken();
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    email,
    username,
    hashedPassword,
    sessionToken: newSessionToken,
  };

  await usersCollection.insertOne(newUser);

  return newUser;
}

async function getUserByEmail(email) {
  return await usersCollection.findOne({ email });
}

async function getUserByUsername(username) {
  return await usersCollection.findOne({ username });
}

async function getUserByToken(sessionToken) {
  if (sessionToken === null) {
    return null;
  }

  return await usersCollection.findOne({ sessionToken });
}

// Validates and logs in a user and returns null or a new token
async function loginUser(email, password) {
  const resultingUser = await usersCollection.findOne({
    email,
  });

  if (resultingUser === null) {
    return null;
  }

  if (!(await bcrypt.compare(password, resultingUser.hashedPassword))) {
    return null;
  }

  const newSessionToken = newToken();

  await usersCollection.updateOne(
    { _id: resultingUser._id },
    {
      $set: { sessionToken: newSessionToken },
    }
  );

  return { ...resultingUser, sessionToken: newSessionToken };
}

async function logoutUser(sessionToken) {
  await usersCollection.updateOne(
    { sessionToken },
    { $unset: { sessionToken } }
  );
}

module.exports = {
  ensureDB,
  newUser,
  getUserByEmail,
  getUserByUsername,
  getUserByToken,
  loginUser,
  logoutUser,
};
