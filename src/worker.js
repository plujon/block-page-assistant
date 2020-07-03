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

chrome.webNavigation.onErrorOccurred.addListener((details) => {
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
        chrome.tabs.update(details.tabId, {url: url});
      }
    });
});
