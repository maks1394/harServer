init:
	mkdir harToMocks/currentHar
	mkdir harToMocks/cases
	docker-compose build
stop:
	docker compose down -v
start:
	docker compose up -d
restart:
	make stop
	docker compose up -d
props:
	rm -rf ./result
	docker cp harserver-har_server-1:/app/api/headerProps ./result