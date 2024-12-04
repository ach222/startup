const fetch = require("node-fetch");

const { MODE_EASY, MODE_HARD } = require("./constants");

const MAX_PROMPT_CHARS_EASY = 200;
const MAX_PROMPT_CHARS_HARD = 500;

async function getRandomArticle(subdomain, maxChars) {
  const randomUrl = `https://${subdomain}.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&format=json`;
  const randomResult = await fetch(randomUrl);
  const randomResultJSON = await randomResult.json();
  const pageId = randomResultJSON.query.random[0].id;

  const summaryUrl = `https://${subdomain}.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=extracts&exchars=${maxChars}&explaintext&format=json`;
  const summaryResult = await fetch(summaryUrl);
  const summaryResultJSON = await summaryResult.json();

  const pageResult = summaryResultJSON.query.pages[pageId];

  let summary = pageResult.extract;

  // Remove trailing ellipsis
  if (summary.endsWith("...")) {
    summary = summary.substring(0, summary.length - 3);
  }

  // Replace newlines
  summary = summary.replaceAll(/\n+/g, " ");

  // Replace section headers (e.x. ==References==)
  summary = summary.replaceAll(/==.+?==/g, "");

  // Replace non-common characters (ASCII range: https://www.asciitable.com/)
  summary = summary.replaceAll(/[^\x20-\x7e]/g, "");

  // Attempt to stop at a full sentence
  const sentencesMatch = summary.match(/^.+\./);
  summary = sentencesMatch !== null ? sentencesMatch[0] : summary;

  const result = {
    title: pageResult.title,
    link: `https://${subdomain}.wikipedia.org/wiki?curid=${pageId}`,
    text: summary,
  };

  return result;
}

async function getArticle(gameMode) {
  switch (gameMode) {
    case MODE_EASY:
      return await getRandomArticle("simple", MAX_PROMPT_CHARS_EASY);
    case MODE_HARD:
      return await getRandomArticle("en", MAX_PROMPT_CHARS_HARD);
    default:
      throw new Error(`Bad gameMode of ${gameMode}!`);
  }
}

module.exports = {
  getArticle,
};
