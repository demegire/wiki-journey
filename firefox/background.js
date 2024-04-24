let articlesTree = {};
let lastJourneyDate = '';

function toLocalISOString(date) {
  var localOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  var localTime = new Date(date.getTime() - localOffset);
  return localTime.toISOString().split('T')[0];
}

function addArticleToTree(title, url, parentUrl) {
    // If there's no parent, this is a root article
    if (!parentUrl) {
      articlesTree[url] = articlesTree[url] || { title, children: {} };
    } else {
      // Recursively search for the parent node in the tree
      const parentNode = findParentNode(articlesTree, parentUrl);
      if (parentNode) {
        // Add the article under its parent
        parentNode.children[url] = parentNode.children[url] || { title, children: {} };
      } else {
        // If the parent node is not found, treat it as a root article
        articlesTree[url] = articlesTree[url] || { title, children: {} };
      }
    }
    // Save the updated tree to storage
    saveCurrentDayJourney()
  }
  
function findParentNode(tree, parentUrl) {
  for (const url in tree) {
    if (url === parentUrl) {
      return tree[url];
    }
    const foundInChildren = findParentNode(tree[url].children, parentUrl);
    if (foundInChildren) {
      return foundInChildren;
    }
  }
  return null;
}

async function handleMessage(request, sender, sendResponse) {
  if (request.article) {
    await checkNewDay(); // Ensure this completes before proceeding
    const { title, url, parent } = request.article;
    addArticleToTree(title, url, parent);
  }
}


function saveCurrentDayJourney() {
  const dateString = toLocalISOString(new Date());
  const key = `journey_${dateString}`;
  browser.storage.local.set({ [key]: articlesTree });
}

// Load the articles tree from storage or start a new one each day
function loadOrInitializeTree() {
  const dateString = toLocalISOString(new Date());
  const key = `journey_${dateString}`;
  browser.storage.local.get([key], (result) => {
    if (result[key]) {
      articlesTree = result[key];
    } else {
      articlesTree = {}; // If there's no entry for today, start a new tree
      browser.storage.local.set({ [key]: articlesTree });
    }
  });
}

function checkNewDay() {
  const dateString = toLocalISOString(new Date());
  const key = `journey_${dateString}`;
  return new Promise((resolve, reject) => {
    browser.storage.local.get([key], (result) => {
      if (result[key]) {
        articlesTree = result[key];
        resolve();
      } else {
        articlesTree = {}; // If there's no entry for today, start a new tree
        browser.storage.local.set({ [key]: articlesTree }, resolve);
      }
    });
  });
}

loadOrInitializeTree();

browser.runtime.onMessage.addListener(handleMessage);
