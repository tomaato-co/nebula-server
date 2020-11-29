#!/bin/sh

docker stop nginx-proxy

docker rm nginx-proxy

cd ./rproxy

exec docker-compose up -d

cd ../

