# block-page-assistant

Browser extension which detects secure HTTPS pages blocked by mytools.management and presents the user a block page

Currently available for

* Chrome: https://chrome.google.com/webstore/detail/block-page-assistant/pkimhjnhalcimiegkknnidjmmoiedhon
* Safari: https://downloads.dnsthingy.com/safari/1.0/BlockPageAssistant.safariextz
* Firefox: https://addons.mozilla.org/en-US/firefox/addon/block-page-assistant/

## How it works

Let's use badactor.co as an example of a blocked HTTPS web site site.

1. The user tries to visit https://badactor.co

2. The DNS based firewall responds with a TCP reject which the extension listens for.

3. The extension then checks `http://mytools.management/isblocked?path=badactor.co` and if the response code is 403 redirects the user to that page. Otherwise does nothing.

The extension also checks if the user is reloading `mytools.management/isblocked`, and if they are checks the response code, and if it's 200 redirects the user back to the value of `path`.
