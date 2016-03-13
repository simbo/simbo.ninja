---
title: Semantic blog markup using HTML5 and hNews
---
Here's an example for properly formatted blog post markup using HTML5 and the hNews specification.

```html
<article class="hentry">
    <header>
        <h1 class="entry-title">THE TITLE</h1>
        <p class="entry-summary">THE TAGLINE</p>
        <time class="published" datetime="YYYY-MM-DDTHH:MM:SS+TZ">THE DATE</time>
        <p class="byline author vcard">by <span class="fn">THE AUTHOR</span></p>
    </header>
    <div class="entry-content">
        <p>SOME TEXT CONTENT</p>
        <figure>
            SOME MEDIA
            <figcaption>A CAPTION</figcaption>
        </figure>
        <aside>
            SHARING BUTTONS / ARTICLE RELATED STUFF
        </aside>
    </div>
    <footer>
        <p class="source-org vcard copyright">
            (cc) <span class="org fn">THE LICENSE HOLDER ORG</span>
        </p>
    </footer>
</article>
```

More info:
- [W3C HTML 5.1 Nightly Overview](http://www.w3.org/html/wg/drafts/html/master/Overview.html)
- [hNews microformat specification](http://microformats.org/wiki/hnews)
