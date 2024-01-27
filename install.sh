# Clean up old executables
sudo rm -f /usr/bin/ovpnrental_agent

# Replace with the new version
sudo mv ovpnrental_agent /usr/bin/ovpnrental_agent

rm -f ovpnrental_agent;

# Relaunch service & show actual status
sudo service ovpnrental_agent restart;
sudo service ovpnrental_agent status;

# Remove build script
rm -f install.sh;