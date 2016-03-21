simbo.ninja
===========

  > My private playground.  
  > [simbo.ninja](http://simbo.ninja/)

--

**EVERYTHING IS DRAFT AND IN PROGRESS**

<!-- MarkdownTOC -->

- [General Setup](#general-setup)
- [Vagrant](#vagrant)
- [Uberspace](#uberspace)
  - [Preparations](#preparations)
  - [Service Management](#service-management)
- [App process management](#app-process-management)

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


## Vagrant

After a `vagrant up`, the machine should be provisioned and services should be
running.

  - **Website** [localhost:8080](http://localhost:8080/) or [10.0.0.5:52323](http://10.0.0.5:52323/)

  - **CouchDB Futon** [http://10.0.0.5:52322/_utils/](http://10.0.0.5:52322/_utils/)


## Uberspace

  - **CouchDB Futon** https://simbo.libra.uberspace.de/couchdb/_utils


### Preparations

Notes on [installing/updating nginx on uberspace](https://gist.github.com/simbo/bbee1099782811b88efa)

`pm2 start /var/www/virtual/simbo/nginx/simbo.ninja/config/pm2.json --no-daemon`

``` sh
# setup couchdb
uberspace-setup-couchdb

# install global npm packages
npm i -g npm@latest
npm i -g pm2@1.0.2
```


### Service Management

``` bash
svc -u <service>  # start (u = up)
svc -d <service>  # stop (d = down)
svc -h <service>  # reload (h = HUP)
svc -du <service> # restart (du = down, up)
```

Services:

  - `~/service/nginx`
  - `~/service/couchdb`


## App process management

...is done via [PM2](https://github.com/Unitech/pm2).
It should start the app automatically on system startup and keep it running.

``` bash
# restart|stop|start
pm2 restart simbo.ninja
pm2 stop simbo.ninja
pm2 start /vagrant/config/pm2.json

# monitor app process
pm2 monit simbo.ninja

# view live log
pm2 log simbo.ninja
```
