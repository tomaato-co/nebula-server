
#!/bin/bash
# Initialises the nebula-server environment.

# Create directory for static-sites (web-files and docker-compose configs).
mkdir -p ./sites

# Create nginx docker network.
docker network create nginx-proxy

