#!/bin/sh
trap "exit" INT TERM ERR EXIT
cd /var/stuff/forestvendetta/ForestVendetta
npm start --prefix shardManager