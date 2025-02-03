stop:
	docker compose down -v
restart:
	make stop
	docker compose up -d