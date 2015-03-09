# start provisioning
PROVISION_STARTED=`date +%s`
echo "Starting provisioning..."

# test if machine is already provisioned
PROVISIONED="/tmp/PROVISIONED"
if [[ -f $PROVISIONED ]]; then
    echo "Skipping provisioning. (already provisioned on $(cat $PROVISIONED))"
    exit
fi

# fix locale
sudo locale-gen de_DE.UTF-8
sudo dpkg-reconfigure locales

# update sources, upgrade packages
sudo apt-get update
sudo apt-get upgrade

# install basics
sudo apt-get -y install build-essential libssl-dev git

# setup zsh with oh-my-zsh and zsh-git-prompt
git clone git://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
git clone git://github.com/olivierverdier/zsh-git-prompt.git ~/.zsh-git-prompt
sudo apt-get -y install zsh
sudo chsh -s /bin/zsh vagrant
cp -R /vagrant/.provision/files/vagrant/.zshrc ~/

# install couchdb
sudo apt-get -y install couchdb
sudo cp /vagrant/.provision/files/root/etc/couchdb/* /etc/couchdb
sudo service couchdb restart

# install nginx, setup site
sudo apt-get -y install nginx
sudo cp -R /vagrant/.provision/files/root/etc/nginx/* /etc/nginx
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/vagrant /etc/nginx/sites-enabled/vagrant
sudo service nginx restart

# install node.js via nvm
git clone https://github.com/creationix/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
source ~/.nvm/nvm.sh
echo "Installing node.js..."
nvm install 0.12 &> /dev/null
nvm alias default 0.12

# install global node packages
echo "Installing global node.js packages... (please be patient)"
npm install -g pm2 gulp bower npm-check-updates

# install project dependencies and build
cd /vagrant/
echo "Installing local node.js packages... (please be patient)"
npm install
npm run build-dev

# run app via pm2
pm2 start /vagrant/processes.json
pm2 startup ubuntu &> /dev/null
sudo env PATH=$PATH:/usr/bin pm2 startup ubuntu -u vagrant

# write provision date to file to avoid reprovisioning
echo "$(date)" > $PROVISIONED

# print provision duration
PROVISION_DURATION=$((`date +%s`-$PROVISION_STARTED))
format_duration() {
    ((h=${1}/3600))
    ((m=(${1}%3600)/60))
    ((s=${1}%60))
    printf "%02d:%02d:%02d\n" $h $m $s
}
echo "Provisioning done after $(format_duration $PROVISION_DURATION)."
