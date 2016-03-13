---
title: Run Sublime Text from OS X terminal
---
[Sublime Text](http://www.sublimetext.com/) offers a CLI (subl) within its app package. This can be used to open files and projects from the terminal in Sublime Text, as well as working as an <var>EDITOR</var> for git or other command-line tools.

First, create a symlink to subl. Paths may differ depending on your version of Sublime Text or personal preferences...

```bash
sudo ln -s "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" /usr/local/bin/subl
```

Now edit your `~/.bash_profile` to make sure the symlink you just created is within your <var>PATH</var> and other software recognizes subl as <var>EDITOR</var>.
You can also add an alias for `open` to automatically use your default editor (which should of course be set to Sublime Text, i.e. via [RCDefaultApp](http://www.rubicode.com/Software/RCDefaultApp/)).

```bash
export PATH=/usr/local/bin:$PATH
export EDITOR='subl -w'
alias open='open -t'
```

Afterwards, reload your profile with `source ~/.bash_profile`.

Have fun.