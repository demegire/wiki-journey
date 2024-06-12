function isValidWikipediaArticle() {
    // Check if the URL follows the typical pattern for Wikipedia articles
    // This regex matches the main article pages but excludes special pages, user pages, etc.
    const urlRegex = /^https?:\/\/[a-z-]+\.wikipedia\.org\/(?:wiki|zh-cn|zh-hk|zh-mo|zh-my|zh-sg|zh-tw)\/(?!Special:|User:|Wikipedia:|File:|MediaWiki:|Template:|Help:|Category:|Portal:|Draft:|TimedText:|Module:|Gadget:|Gadget_definition:|Education_Program:|Topic:|Book:|Special:Search|Special:RecentChanges).+/;
    return urlRegex.test(window.location.href);
}

function sendArticleInfo() {
    if (isValidWikipediaArticle()) {
        const title = document.querySelector('h1 > :first-child').innerText;
        const url = window.location.href;
        const parent = document.referrer.includes("wikipedia.org") && isValidWikipediaArticle(document.referrer) ? document.referrer : null;

        chrome.runtime.sendMessage({
            article: { title, url, parent }
        });
    }
}

// Execute when the script loads
sendArticleInfo();
