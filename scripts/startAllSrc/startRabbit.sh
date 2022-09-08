#!/bin/sh
trap "exit" INT TERM ERR
cd /var/stuff/forestvendetta/ForestVendetta
/usr/bin/docker stop forestvendetta-rabbitmq || true
/usr/bin/docker rm forestvendetta-rabbitmq || true
/usr/bin/docker pull rabbitmq:3.10-management
/usr/bin/docker run --rm --name forestvendetta-rabbitmq --hostname forestvendetta-rabbitmq rabbitmq:3.10-management