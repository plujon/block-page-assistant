// "If any https page fails to load, a request should be made to
//  http://mytools.management/isblocked?path=[domain].  If the status
//  of the request is 200, the current page should continue to be
//  displayed and nothing should happen.
//
//  If the mytools page returns 403, then the user should be
//  redirected to http://mytools.management/isblocked?path=[domain]."
//
//  -- an email to Jon from R.P.

const url_base = 'http://mytools.management/isblocked?path=';

function handleBlockedPage(tabId, tabUrl, betterUrl) {
  // In a simple world, the body of this function would merely be:
  //
  //   chrome.tabs.update(tabId, {url:betterUrl});
  //
  // But in Safari Technology Preview Release 112 (the lastest as of
  // 2020-08-28), details is a half-cooked object that contains
  // something like:
  //
  // { frameId:0, parentFrameId:-1, tabId:0,
  //   timestamp:1598644059156.1234, url:"http://hi.eewe.us/" }
  //
  // Notice that tabId is 0.  That's wrong.  If one uses it like so:
  //
  //   chrome.tabs.update(0, {url:betterUrl}, (tab) => {
  //     if (chrome.runtime.lastError) { console.error('nope') }
  //     console.log('tab', tab);
  //   });
  //
  // the call supposedly succeeds, but the tab object is null, and the
  // browser tab in question is not actually updated.
  //
  // So, in the complex, buggy, beta-quality world, one does the
  // following to update the tab instead, or to create a new tab in
  // case other courses are closed.
  if (tabId) {
    chrome.tabs.update(tabId, {url:betterUrl})
  } else {
    // You'd think this would work, but it does not.  It may be yet
    // another Safari Technology Preview bug.
    //
    //   chrome.tabs.query({url:tabUrl}, () => {})
    chrome.tabs.query({}, (tabs) => {
      try {
        if (1 !== tabs.length) {
          tabs = tabs.filter(tab => tab.url === tabUrl)
        }
        if (1 === tabs.length) {
          chrome.tabs.update(tabs[0].id, {url:betterUrl})
        } else {
          chrome.tabs.create({url:betterUrl})
        }
      } catch(e) { console.error('d384', e) }
    });
  }
}

chrome.webNavigation.onErrorOccurred.addListener((details) => {
  try {
    if (details.url.startsWith(url_base)) {
      // Avoid infinite recursion.
      return;
    }
    let domain = (new URL(details.url)).hostname;
    if (!domain) {
      // Ignore about:blank, etc.
      return;
    }
    let url = url_base + domain;
    fetch(url)
      .then((response) => {
        if (403 == response.status) {
          handleBlockedPage(details.tabId, details.url, url)
        }
      });
  } catch(e) { console.error('d383', e) }
});
