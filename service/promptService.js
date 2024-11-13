const fetch = require("node-fetch");

const { MODE_EASY, MODE_HARD } = require("./constants");

const NUM_PROMPT_CHARS = 200;

async function getRandomArticle(subdomain) {
  const randomUrl = `https://${subdomain}.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&format=json`;
  const randomResult = await fetch(randomUrl);
  const randomResultJSON = await randomResult.json();
  const pageId = randomResultJSON.query.random[0].id;

  const summaryUrl = `https://${subdomain}.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=extracts&exchars=${NUM_PROMPT_CHARS}&explaintext&format=json`;
  const summaryResult = await fetch(summaryUrl);
  const summaryResultJSON = await summaryResult.json();

  const pageResult = summaryResultJSON.query.pages[pageId];

  let summary = pageResult.extract;

  // Remove trailing ellipsis
  if (summary.endsWith("...")) {
    summary = summary.substring(0, summary.length - 3);
  }

  // Replace non-common characters (ASCII range: https://www.asciitable.com/)
  summary = summary.replaceAll(/[^\x20-\x7e]/g, "");

  const result = {
    title: pageResult.title,
    link: `https://en.wikipedia.org/wiki?curid=${pageId}`,
    text: summary,
  };

  return result;
}

async function getArticle(gameMode) {
  switch (gameMode) {
    case MODE_EASY:
      return await getRandomArticle("simple");
    case MODE_HARD:
      return await getRandomArticle("en");
    default:
      throw new Error(`Bad gameMode of ${gameMode}!`);
  }
}

module.exports = {
  getArticle,
};
