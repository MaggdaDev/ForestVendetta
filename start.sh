#!/bin/sh
if [ -z "$1"]
then
    source scripts/startAllSrc/startAllCommand.sh
else
case $1 in
    discordbot)
    /mnt/c/Windows/System32/cmd.exe /c "wt --title DiscordBot wsl source /var/stuff/forestvendetta/ForestVendetta/scripts/startAllSrc/startDiscordBot.sh"
    ;;
    scheduler)
    /mnt/c/Windows/System32/cmd.exe /c "wt --title Scheduler wsl source /var/stuff/forestvendetta/ForestVendetta/scripts/startAllSrc/startScheduler.sh"
    ;;
    tempbackend)
    /mnt/c/Windows/System32/cmd.exe /c "wt --title Tempbackend wsl source /var/stuff/forestvendetta/ForestVendetta/scripts/startAllSrc/startTempBackend.sh"
    ;;
    rabbit)
    /mnt/c/Windows/System32/cmd.exe /c "wt --title Rabbit wsl source /var/stuff/forestvendetta/ForestVendetta/scripts/startAllSrc/startRabbit.sh"
    ;;
    mongo)
    /mnt/c/Windows/System32/cmd.exe /c "wt --title Mongo wsl source /var/stuff/forestvendetta/ForestVendetta/scripts/startAllSrc/startMongo.sh"
    ;;
esac
fi
