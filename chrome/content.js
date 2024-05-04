function isValidArticleUrl() {
    const wikipediaRegex = /^https?:\/\/[a-z]+\.wikipedia\.org\/wiki\/(?!Special:|User:|Wikipedia:|File:|MediaWiki:|Template:|Help:|Category:|Portal:|Draft:|TimedText:|Module:|Gadget:|Gadget_definition:|Education_Program:|Topic:|Book:|Special:Search|Special:RecentChanges).+/;
    const wikiwandRegex = /^https?:\/\/www\.wikiwand\.com\/en\/.+/;

    const url = window.location.href;
    return wikipediaRegex.test(url) || wikiwandRegex.test(url);
}

function sendArticleInfo() {
    if (isValidArticleUrl()) {
        const title = document.querySelector('h1').innerText;
        const url = window.location.href;
        // Check for referrer from both wikipedia and wikiwand, normalize if needed
        const validReferrer = (url) => isValidArticleUrl(url) ? url : null;
        const parent = document.referrer ? validReferrer(document.referrer) : null;

        chrome.runtime.sendMessage({
            article: { title, url, parent }
        });
    }
}

// Execute when the script loads
sendArticleInfo();
