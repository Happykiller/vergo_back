# Makefile
# Mark targets as not file-dependent; they are always executed
.PHONY: start startall down reset tar install help

start: 
	docker compose up -d

startall: 
	docker compose up --build -d

down:
	docker stop vergo_back

reset: down
	docker rm vergo_back

# Build the Docker image and save it as a tarball
tar: 
	docker build --no-cache -t vergo_back -f Dockerfile .
	docker save vergo_back -o vergo_back.tar

# Install the Docker image by loading it from a tarball and running it
install:
	docker stop vergo_back
	docker rm vergo_back
	docker image rm vergo_back
	docker load -i vergo_back.tar
	docker compose -f docker-compose.prod.yml up -d

help:
	@echo ""
	@echo "~~ Vergo Apis Makefile ~~"
	@echo ""
	@echo "\033[33m make start\033[39m    : Démarre le projet"
	@echo "\033[33m make startall\033[39m : Build et démarre le projet"
	@echo "\033[33m make down\033[39m     : Stop le projet"
	@echo "\033[33m make reset\033[39m    : Reset les containers, les volumes, les networks et les données local"
	@echo ""