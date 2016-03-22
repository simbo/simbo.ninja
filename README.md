simbo.ninja
===========

  > My private playground.  
  > [simbo.ninja](http://simbo.ninja/)

--

**EVERYTHING IS DRAFT AND IN PROGRESS**

<!-- MarkdownTOC depth=4 -->

- [General Setup](#general-setup)
- [Development](#development)
  - [Vagrant](#vagrant)
  - [Gulp](#gulp)
- [Uberspace](#uberspace)
  - [Setup](#setup)
    - [nginx](#nginx)
    - [couchdb](#couchdb)
    - [node.js](#nodejs)
    - [pm2](#pm2)

<!-- /MarkdownTOC -->

--


## General Setup

The project is hosted using a shared host on [uberspace](https://uberspace.de/),
therefore services are not using default ports.
Vagrant is used for local development and production environment is given as far
as necessary.

The project contains

  - a nginx server, serving static files and as proxy for node.js app
  - a couchdb
  - a node.js app using express


## Development


### Vagrant

After a `vagrant up`, the machine should be provisioned and services should be
running.

  - **Website**  
    [localhost:8080](http://localhost:8080/) or [10.0.0.5:52323](http://10.0.0.5:52323/)

  - **CouchDB Futon**  
    [10.0.0.5:52322/_utils/](http://10.0.0.5:52322/_utils/)


### Gulp

Run `gulp` within project root to list available tasks with descriptions.

**Common gulp tasks:**

  - **`build`** ➜ `[clean], [copy + build:css + build:js + build:site]`  
    *clean and rebuild all static files*

  - **`dev`** ➜ `build, [browsersync + watch]`  
    *build and watch static files, serve via browsersync*

  - **`release:www`** ➜ `env:prod, build, uberspace:rsync-www`  
    *build in production environment and rsync static files to uberspace*

  - **`nginx-conf`** ➜ `clean:nginx-conf, build:nginx-conf, uberspace:rsync-nginx-conf, uberspace:reload-nginx`  
    *generate production nginx config, rsync to uberspace and reload nginx*

  - **`release:app`** ➜ `uberspace:rsync-app, uberspace:after-rsync-app`  
    *rsync app and dependencies to uberspace, install production packages, apply production config and restart app via pm2*


## Uberspace

  - **Website**  
    [simbo.ninja](http://simbo.ninja/)

  - **CouchDB Futon**  
    [simbo.libra.uberspace.de/couchdb/_utils/](https://simbo.libra.uberspace.de/couchdb/_utils/)


### Setup


#### nginx

nginx has to be installed and updated manually.

``` bash
# download, unpack, configure and install latest nginx
wget http://nginx.org/download/nginx-1.7.9.tar.gz 
tar xf nginx-1.7.9.tar.gz && cd nginx-1.7.9
./configure --prefix=$HOME/nginx --with-http_realip_module --with-ipv6
make && make install

# symlink binary and create service
ln -s ~/nginx/sbin/nginx ~/bin
uberspace-setup-service nginx ~/nginx/sbin/nginx

# restart service
svc -du ~/service/nginx

# reload nginx config
nginx -s reload
```

nginx is listening on custom port 52323. Nevertheless it is available via port
80 using pound proxy for my domain. (Thanks to uberspace team for custom config!)

nginx config is located at `~/nginx/conf`. Beside other rules, the `nginx.conf`
has to contain the following:

``` nginx
daemon off;

http {
  set_real_ip_from 127.0.0.1;
  set_real_ip_from ::1;
  real_ip_header X-Forwarded-For;
}
```


#### couchdb

For details, see [couchdb](https://wiki.uberspace.de/database:couchdb) 
in uberspace wiki.

``` bash
#setup couchdb service
uberspace-setup-couchdb

# change port in couchdb.ini
sed -i "s/^\(port\s*=\s*\).*$/\152324/" ~/couchdb.ini

# restart service
svc -du ~/service/couchdb
```

Edit `.htaccess` in `/var/www/virtual/simbo/html/` to rewrite `/couchdb/`:

``` apache
RewriteEngine on
RewriteBase /
RewriteCond %{HTTPS} on [OR]
RewriteCond %{ENV:HTTPS} on
RewriteRule ^couchdb/(.*) http://localhost:52324/$1 [P]
```


#### node.js

For details, see [node.js](https://wiki.uberspace.de/development:nodejs)
in uberspace wiki.

Edit and reload `~/.bash_profile`:

``` bash
export PATH=/package/host/localhost/nodejs-5.7.0/bin:$PATH
```

Install and configure latest npm:

``` bash
npm i -g npm@latest
npm config set cache-lock-stale 604800000
npm config set cache-min 86400
npm config set progress false
npm config set loglevel error
```


#### pm2

For details, see [daemontools](https://wiki.uberspace.de/system:daemontools)
in uberspace wiki.

``` bash
# install
npm i -g pm2@1.0.2

# start app via pm2; save process list; stop app; kill pm2 daemon
pm2 start /var/www/virtual/simbo/nginx/simbo.ninja/config/pm2.json
pm2 save
pm2 stop 0
pm2 kill

# setup pm2 as a service
uberspace-setup-service pm2 ~/bin/pm2 resurrect --no-daemon

# restart service
svc -du ~/service/pm2
```


##### App management

``` bash
# restart|stop|start
pm2 restart 0
pm2 stop 0
pm2 start 0
# monitor app process
pm2 monit 0
# show live log
pm2 log 0
```
