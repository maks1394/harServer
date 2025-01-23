1. в портале в .docker/nginx.conf

добавить

location /api {
    proxy_pass http://mock:777;
}

2. удалить контейнер nginx и запустить заново docker-compose up -d nginx

3. закинуть сюда har (он должен быть один в папке, возьмется первый попавшийся, имя файла неважно)

4. сбилдить этот контейнер docker-compose build

5. запустить docker-compose up -d

6. при изменении har удалить контейнер и повторить пункты 3-5

7. Если хотите убрать моки, то revert первого пункта + повторяем пункт 2

на данный момент query параметры упускаются

то есть если в har есть запросы, например

/additional_params?key=snapshot_data (или нет query)

/additional_params?key=interfaces_data

то контейнер, игнорируя query, запишет только последний запрос(он перезапишет предыдущие), и на оба запроса будет выдавать тот же ответ, поэтому первый запрос придется переписать с помощью chrome overrides

внутри bin
node run ../108534kaasAll.har ../api --dry-run

