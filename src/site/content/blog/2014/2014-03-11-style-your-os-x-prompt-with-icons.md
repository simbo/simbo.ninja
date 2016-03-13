---
title: Style your OS X prompt with icons
---
Inspired by Andre Torrez' note [*Put a burger in your shell*](http://notes.torrez.org/2013/04/put-a-burger-in-your-shell.html), i just styled the prompt on my Mac with a *see-no-evil monkey*.

![My new prompt...](/media/prompt-with-monkey.png)

You have to insert something like this into your `~/.bash_profile`:

```bash
export PS1="\e[35;1m\w\e[0m 🙈  \e[30;1m# \e[0m"
```

You can browse UTF-8 symbols on [FileFormats.org](http://www.fileformat.info/info/unicode/block/index.htm) and copy your desired symbol rightaway.

Or if you want to browse symbols directly in OS X you can open *System Preferences / Keyboard* and check *"Show input menu in menu bar"*. Click on the new icon in your menu bar and bring up the character tables. You can dragndrop your favorite symbol to wherever you like.

Colorcodes, sequences and more information on prompt styling can be found at [IBM DeveloperWorks](http://www.ibm.com/developerworks/linux/library/l-tip-prompt/).