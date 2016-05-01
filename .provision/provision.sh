source "/vagrant/.provision/lib/env.sh"

# start provisioning
PROVISION_STARTED=`date +%s`
echo_c "Starting provisioning..."

# update sources, upgrade packages
echo_c "Updating apt sources..."
sudo apt-get -y -qq update

# install apt packages
echo_c "Installing apt packages..."
sudo apt-get -y -qq install nginx couchdb

# configure nginx
echo_c "Configuring nginx..."
sudo cp -Rf $PROVISION_FILES/etc/nginx/* /etc/nginx
sudo rm -f /etc/nginx/sites-enabled/*
sudo service nginx restart

# configure couchdb
echo_c "Configuring couchdb..."
COUCHDB_USER="dev"
COUCHDB_PASS="dev"
COUCHDB_PORT=52324
curl -X PUT http://127.0.0.1:5984/_config/admins/$COUCHDB_USER -d "\"${COUCHDB_PASS}\"" &> /dev/null
sudo sed -i "s/^\(port\s*=\s*\).*$/\1${COUCHDB_PORT}/" /etc/couchdb/default.ini
curl -X POST http://$COUCHDB_USER:$COUCHDB_PASS@localhost:5984/_restart -H"Content-Type: application/json" &> /dev/null

# edit and reload .zshrc
if ! grep -Fxq "# added by provision" ~/.zshrc
then
cat <<EOF >> ~/.zshrc
# added by provision
export NODE_PATH=/vagrant/src
EOF
fi

# install global node packages
echo_c "Installing global node.js packages..."
npm i -g pm2@1.1.3 gulp@3.9.1

# install project dependencies
echo_c "Installing local node.js packages..."
cd /vagrant
rm -rf node_modules
npm i --production
npm i

# setup pm2 and start app
echo_c "Configuring pm2..."
sudo su -c "env PATH=$PATH:/usr/bin pm2 startup ubuntu -u vagrant --hp /home/vagrant"
pm2 start /vagrant/src/config/pm2.json
pm2 save

# print provision duration
PROVISION_DURATION=$((`date +%s`-$PROVISION_STARTED))
echo "Provisioning done after $(format_duration $PROVISION_DURATION)."
