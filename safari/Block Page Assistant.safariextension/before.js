safari.self.addEventListener('message', handleMessage, false);

function handleMessage(e) {
  if (e.name === 'redirect') {
    window.location.replace(e.message.blockedUrl);
  }
}

document.onreadystatechange = function (e) {
  if (e.target.readyState === 'complete') {
    const URL = e.target.URL;
    if (URL === 'safari-resource:/ErrorPage.html') {
      // error page shown, try to redirect to "blocked" page
      safari.self.tab.dispatchMessage("error");
    } else if (/^http:\/\/mytools\.management\/isblocked\?path=/.test(URL)) {
      // check whether the URL is still blocked
      safari.self.tab.dispatchMessage('check', { URL });
    }
  }
};
