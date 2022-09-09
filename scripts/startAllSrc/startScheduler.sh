#!/bin/sh
trap "exit" INT TERM ERR
cd /var/stuff/forestvendetta/ForestVendetta
npm start --prefix Scheduler
wait