browser.webNavigation.onErrorOccurred.addListener(function (e) {
  if (/^Error code \d+$/i.test(e.error)) {
    /* Find if blocked URL is the same as the tab URL */
    browser.tabs.get(e.tabId, function (tab) {
      if (e.url === tab.url) {
        /* Extract host name from URL */
        const blockedUrl = 'http://mytools.management/isblocked?path=' + tab.url.replace(/^[^\/]*\/\//, '');

        /* Update tab to block page */
        browser.tabs.update(e.tabId, { url: blockedUrl });
        browser.history.deleteUrl({ url: blockedUrl });
      }
    });
  }
}, { url: [{ 'schemes': ['https'] }] });

browser.webRequest.onHeadersReceived.addListener(function (details) {
  if (details.statusCode === 200) {
    const URL = details.url.split('?path=').pop();
    const blockedUrl = `http://${URL}`;
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', blockedUrl, true);
    xhr.onload = function () {
      if (this.status === 200) {
        // unblocked, redirect to original URL
        browser.tabs.update(details.tabId, { url: blockedUrl });
      }
    };
    xhr.onerror = function () {
      // error, still blocked, do nothing
    };
    xhr.send();
  }
}, { urls: ["http://mytools.management/isblocked*"] });
