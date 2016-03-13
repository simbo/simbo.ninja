# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    config.vm.box = "simbo/trusty64"
    config.vm.box_version = "0.8.2"
    config.vm.network "forwarded_port", guest: 52323, host: 8080
    config.vm.network "private_network", ip: "10.0.0.5"
    config.vm.provision "shell", path: ".provision/provision.sh", privileged: false
end
