#!/bin/sh
trap "exit" INT TERM ERR
cd /var/stuff/forestvendetta/ForestVendetta
/usr/bin/docker stop forestvendetta-mongodb || true
/usr/bin/docker rm forestvendetta-mongodb || true
/usr/bin/docker pull mongo:6

/usr/bin/docker run --rm --name forestvendetta-mongodb -v /var/stuff/forestvendetta/ForestVendetta/storage/mongodb:/data/db -e MONGO_INITDB_ROOT_USERNAME=${MONGODB_USER} -e MONGO_INITDB_ROOT_PASSWORD=${MONGODB_PASS} mongo:6