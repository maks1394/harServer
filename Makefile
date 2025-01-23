restart:
	docker compose down
	make clear
	docker compose up -d --force-recreate
clear:
	docker volume rm mock_api-volume