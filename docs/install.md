# Install
mkdir -p /var/stuff/forestvendetta
git clone *project*
*create user forestvendetta and add to group docker*
*create and chown home directory*
*chown forestvendetta directory*
*copy config-example to config*
sudo systemctl link /var/stuff/forestvendetta/ForestVendetta/misc/systemd/forestvendetta*
sudo systemctl start forestvendetta

## run on wsl
*this doesn't work - there's no systemd*
sudo ln -s /mnt/c/Users/Tom/files/220722_forestvendetta/ForestVendetta /var/stuff/forestvendetta/