---
title: External repositories within your GitHub page
---
Using git submodules you can include external repositories into your repository.
I'm using this technique to include demos of some of my projects into my GitHub page.
Here's a quick overview on how to manage this.

> Make sure you use the <samp>https://</samp> read-only URL for your submodules, including nested submodules. You can make this change in your *.gitmodules* file.  
> Submodules must also be served from public repositories, as the Pages server cannot access private repositories.
> <cite>[GitHub Help: Using submodules in pages](https://help.github.com/articles/using-submodules-with-pages)</cite>

Add a submodule in `demo/` directory:

```bash
git submodule add https://github.com/user/repo.git demo/repo
```

Update all submodules:

```bash
git submodule foreach git pull origin master
```

More info:
- [Git Docs: Submodules](http://git-scm.com/book/en/Git-Tools-Submodules)
- [Stackoverflow: Update git submodules](http://stackoverflow.com/a/5828396/962027)
