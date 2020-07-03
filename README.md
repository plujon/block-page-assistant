# block-page-assistant

Browser extension which detects secure HTTPS pages blocked by mytools.management and presents the user a block page.

Currently available for

* Chrome: https://chrome.google.com/webstore/detail/block-page-assistant/pkimhjnhalcimiegkknnidjmmoiedhon
* Safari: Coming soon
* Firefox: Coming soon

## How it works

Let's use badactor.co as an example of a blocked HTTPS web site site.

1. The user tries to visit https://badactor.co

2. The DNS based firewall responds with a TCP reject which the extension listens for.

3. The extension then checks `http://mytools.management/isblocked?path=badactor.co` and if the response code is 403 redirects the user to that page. Otherwise does nothing.
