# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.ssh.forward_agent = true
  config.vm.box = "simbo/ubuntu"
  config.vm.box_version = "0.1.4"
  config.vm.network "forwarded_port", guest: 52323, host: 8080
  config.vm.network "private_network", ip: "10.0.0.5"
  config.vm.provision "shell", path: ".provision/provision.sh", privileged: false
  config.vm.provider "virtualbox" do |v|
    v.customize [
      "modifyvm", :id,
      "--memory", 1024,
      "--cpus", 1
    ]
  end
end
