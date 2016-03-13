---
title: Fix VLC slowdown on OS X
---
From time to time [VLC player](http://www.videolan.org/) kind of cripples itself and becomes very slow on startup and/or loading movies. This (and other problems with VLC) can be easily fixed by deleting its preferences. First stop VLC, then:

```
cd ~/Library/Preferences
rm -r org.videolan.*
```

Next time you start VLC, it will launch/load as fast as it should.