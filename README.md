simbo.ninja
===========

  > [simbo.ninja](http://simbo.ninja)

[![MIT License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://simbo.mit-license.org)
[![Dependencies Status](https://img.shields.io/david/simbo/simbo.ninja.svg?style=flat-square)](https://david-dm.org/simbo/simbo.ninja)
[![devDependencies Status](https://img.shields.io/david/dev/simbo/simbo.ninja.svg?style=flat-square)](https://david-dm.org/simbo/simbo.ninja#info=devDependencies)
[![Travis Build Status](https://img.shields.io/travis/simbo/simbo.ninja/master.svg?style=flat-square)](https://travis-ci.org/simbo/simbo.ninja)


## Setting up development environment

If you already have installed [Vagrant](https://www.vagrantup.com/), just do:

``` bash
vagrant up
```

***Note:***  
You will probably get a warning during provisioning like
`optional dep failed, continuing (fsevents@0.3.5)`.
Don't worry... FSEvents is API only for OSX and as this project's Vagrant box uses
Ubuntu, this dependency will not be used.
