var errorHandler = function(e) {
  if (e.error == "net::ERR_CONNECTION_REFUSED" || e.error == "net::ERR_CONNECTION_RESET"
    || e.error == "net::ERR_CONNECTION_CLOSED") {
    /* Find if blocked URL is the same as the tab URL */
    chrome.tabs.get(e.tabId, function (tab) {
        if (e.url == tab.url) {
            /* Extract host name from URL */
        var u_parts = e.url.split('/');
            var blocked_url = u_parts[2];
        for (var i = 3; i < u_parts.length; i++) {
          blocked_url += "/" + u_parts[i];
        }

        /* Update tab to block page */
         chrome.tabs.update(e.tabId, {
                url: 'http://mytools.management/isblocked?path=' + blocked_url
         });

         chrome.history.deleteUrl({
            url: 'http://mytools.management/isblocked?path=' + blocked_url
         });
        }
    });
  }
}

var filter = {url: [{'schemes': ['https']}]};
chrome.webNavigation.onErrorOccurred.addListener(errorHandler, filter);


chrome.webRequest.onHeadersReceived.addListener(
function (details) {
    if (details.statusCode == 200) {
        var storage_key = 'load_' + details.url.split("?path=")[1];
        var reload_count = 0;
        chrome.storage.local.get(storage_key, function (result) {
            reload_count = result;
        });
        chrome.storage.local.set({
            storage_key: (reload_count + 1)
        });

        if (reload_count > 7) {
            console.log('Do not reload to infinity.');
        } else {
            var redirect_url = "http://" + details.url.split("?path=")[1];
            chrome.tabs.update(details.tabId, {
                url: redirect_url
            });
        }
    }
},
{
    urls: [
        "http://mytools.management/isblocked*"
    ]
});
