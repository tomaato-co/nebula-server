
docker ps -q | xargs docker stop

docker rm nginx-proxy
docker rm letsencrypt-helper

cd ./rproxy
docker-compose up -d

cd ../

