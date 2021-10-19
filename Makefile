build:
	$(info Make: Building docker images)
	docker-compose build --no-cache -f files/docker-compose.yaml
 
start:
	$(info Make: Starting docker containers.)
	docker-compose -f files/docker-compose.yaml up -d 
 
stop:
	$(info Make: Stopping docker containers.)
	docker-compose -f files/docker-compose.yaml stop 
 
restart:
	$(info Make: Restarting docker environment containers.)
	@make stop
	@make -s start
 
clean:
	@docker system prune --volumes --force
 