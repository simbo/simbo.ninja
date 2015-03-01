function loadWebfonts(uid, woffUrl, woff2Url) {

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
        storedFontUrl = loSto[localStorageUrlKey],
        storedFontCss = loSto[localStorageCssKey];

    var styleElement = document.createElement('style');
    styleElement.rel = 'stylesheet';
    document.head.appendChild(styleElement);

    if (storedFontCss && (storedFontUrl === woffUrl || storedFontUrl === woff2Url)) {
        styleElement.textContent = storedFontCss;
    } else {
        var url = (woff2Url && supportsWoff2()) ? woff2Url : woffUrl;
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                loSto[localStorageUrlKey] = url;
                loSto[localStorageCssKey] = request.responseText;
                styleElement.textContent = request.responseText;
            }
        };
        request.send();
    }

    function supportsWoff2() {
        if (!window.FontFace) {
            return false;
        }
        var f = new FontFace('t', 'url("data:application/font-woff2,") format("woff2")', {});
        var p = f.load();
        try {
            p.then(null, function(){});
        }
        catch(e) {}
        return f.status === 'loading';
    }

}
