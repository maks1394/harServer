const express = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { getIsDeepEqual, getInfoTextFromJsonData } = require('./utils');

const app = express();
const PORT = 1394;

app.use(express.json());

app.use((req, res) => {
  const method = req.method;
  const urlPath = req.path;
  const filePath = path.join(__dirname, urlPath, `${method}.json`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file from disk: ${err}`);
      return res.status(404).send('File not found');
    }

    try {
      const jsonData = JSON.parse(data);
      const getResult = () => {
        const request = jsonData.find(({ queryData, postData }, index) => {
          const isQueryDataEquals = queryData
            ? _.isEqual(JSON.parse(queryData), req.query)
            : !req.query?.length;

          const isPostDataEquals = postData
            ? getIsDeepEqual(JSON.parse(JSON.parse(postData)?.text), req.body)
            : method === 'GET';

          return isQueryDataEquals && isPostDataEquals;
        });
        if (request) {
          console.log(
            `\n data was founded by query and post data ${method} ${urlPath} \n`
          );
          return JSON.parse(request.fileData);
        } else {
          console.log(
            `\n data was not founded by query and post data. First data was got ${method} ${urlPath} \n`
          );
          return JSON.parse(jsonData?.[0]?.fileData);
        }
      };

      res.json(getResult());
    } catch (parseErr) {
      console.error(`Error parsing JSON: ${parseErr}`);
      res.status(500).send('Error parsing JSON');
    }
  });
});

// Запуск сервера
app.listen(PORT, () => {
  setTimeout(() => {
    fs.readFile(
      path.join(__dirname, 'api/headerProps', `header.json`),
      'utf8',
      (err, data) => {
        if (err) {
          console.error(`Error reading file from disk: ${err}`);
          return;
        }

        try {
          const jsonData = JSON.parse(data);
          console.log(
            `\nВ данном har присутсвует html document. Для локального воспроизведения начальных данных откройте файл в \nportal client/apps/portal/app/common/header/Header.tsx\nВместо деструктуризированных пропсов вставьте (props) и в начале данного компонета вставьте содержимое между звездочками(либо выполните команду make props)\nПосле в компонете нажмите сочетание клавиш alt + z и сделайте форматирование документа\nДобавьте импорт useMemo\nimport React, { FC, useEffect, useMemo } from 'react';`
          );

          const stars = new Array(150).join('*');
          console.log(stars);
          const result = getInfoTextFromJsonData(jsonData);
          console.log(getInfoTextFromJsonData(jsonData));
          console.log(stars);
          fs.writeFile(path.join(__dirname, 'api/headerProps', `headerProps.js`), result, err => {
            if (err) {
              console.error(err);
            } else {
              // file written successfully
            }
          });
        } catch (parseErr) {
          console.error(`Error parsing JSON: ${parseErr}`);
        }
      }
    );
  }, 5000);
  console.log(`Server is running on http://localhost:${PORT}`);
});
