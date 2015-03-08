function loadWebfonts(woffUrl, woff2Url, woffHash, woff2Hash, uid) {
    uid = uid || '';

    var userAgent = navigator.userAgent,
        noSupport = !window.addEventListener || (userAgent.match(/(Android (2|3|4.0|4.1|4.2|4.3))|(Opera (Mini|Mobi))/) && !userAgent.match(/Chrome/));
    if (noSupport) {
        return;
    }

    var loSto = {};
    try {
        loSto = localStorage || {};
    }
    catch(e) {}

    var localStoragePrefix = 'x-fonts-' + uid,
        localStorageUrlKey = localStoragePrefix + 'url',
        localStorageCssKey = localStoragePrefix + 'css',
        localStorageHashKey = localStoragePrefix + 'hash',
        woff2Support = supportsWoff2(),
        url = woff2Support ? woff2Url : woffUrl,
        hash = woff2Support ? woff2Hash : woffHash;

    var styleElement = document.createElement('style');
    styleElement.rel = 'stylesheet';
    document.head.appendChild(styleElement);

    if (loSto[localStorageCssKey] && (loSto[localStorageUrlKey] === url) && (loSto[localStorageHashKey] === hash)) {
        styleElement.textContent = loSto[localStorageCssKey];
    }
    else {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                try {
                    loSto[localStorageUrlKey] = url;
                    loSto[localStorageHashKey] = hash;
                    loSto[localStorageCssKey] = request.responseText;
                }
                catch(e) {}
                styleElement.textContent = request.responseText;
            }
        };
        request.send();
    }

    function supportsWoff2() {
        if (!window.FontFace) {
            return false;
        }
        var fontface = new FontFace('t', 'url("data:application/font-woff2,") format("woff2")', {}),
            promise = fontface.load();
        try {
            promise.then(null, function(){});
        }
        catch(e) {}
        return fontface.status === 'loading';
    }

}
