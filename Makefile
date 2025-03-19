init:
	docker compose build
stop:
	docker compose down -v
start:
	docker compose up -d
restart:
	make stop
	docker compose up -d
props:
	rm -rf ./result
	docker cp harserver-har_compiler-1:/app/api/headerProps ./result
rebuild:
	make stop
	docker rmi -f harserver-har_compiler harserver-har_server
	docker-compose build