simbo.ninja
===========

  > [simbo.ninja](http://simbo.ninja)

## Development


### Setting up development environment

If you already have installed [Vagrant](https://www.vagrantup.com/), just do:

``` bash
vagrant up
```

***Note:***  
You will probably get a warning during provisioning like
`optional dep failed, continuing (fsevents@0.3.5)`.
Don't worry... FSEvents is API only for OSX and as this project's Vagrant box uses
Ubuntu, this dependency will not be used.


### App process management

The app is managed via [PM2](https://github.com/Unitech/pm2). It should start the app automatically on system startup.

``` bash
# restart|stop|start
pm2 restart simbo.ninja
pm2 stop simbo.ninja
pm2 start /vagrant/processes.json

# monitor app process
pm2 monit simbo.ninja

# view live log
pm2 log simbo.ninja
```


## Production (on Uberspace)


### nginx Installation/Upgrade

https://gist.github.com/simbo/bbee1099782811b88efa

### nginx Service Management

To start the service (hint: u = up):  
`svc -u ~/service/nginx`  
To stop the service (hint: d = down):  
`svc -d ~/service/nginx` 
To reload the service (hint: h = HUP):  
`svc -h ~/service/nginx` 
To restart the service (hint: du = down, up):  
`svc -du ~/service/nginx`
