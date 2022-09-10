#!/bin/sh
cd scripts/startAllSrc

/mnt/c/Windows/System32/cmd.exe /c "wt new-tab --title DiscordBot wsl source /var/stuff/forestvendetta/ForestVendetta/scripts/startAllSrc/startDiscordBot.sh ; \
new-tab --title Scheduler wsl source /var/stuff/forestvendetta/ForestVendetta/scripts/startAllSrc/startScheduler.sh ; \
new-tab --title tempBackend wsl source /var/stuff/forestvendetta/ForestVendetta/scripts/startAllSrc/startTempBackend.sh ; \
new-tab --title MongoDatabase wsl source /var/stuff/forestvendetta/ForestVendetta/scripts/startAllSrc/startMongo.sh ; \
new-tab --title RabbitMessageBroker wsl source /var/stuff/forestvendetta/ForestVendetta/scripts/startAllSrc/startRabbit.sh"