---
title: ls aliases for OS X
---
Some useful aliases for <samp>ls</samp> under Mac OS X.

```bash
alias ls="ls -G"        # add colors
alias ll="ls -lh"       # list view, human readable
alias lm="ll |more"     # list view piped through 'more'
alias lr="ll -R |more"  # recursive list view piped through 'more'
alias la="ll -A"        # list view including hidden files
```

Insert into `~/.bash_profile` and reload with `source ~/.bash_profile` afterwards.