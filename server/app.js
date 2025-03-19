const express = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { getIsDeepEqual } = require('./utils');

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
      const request = jsonData.find(({ queryData, postData }) => {
        const isQueryDataEquals = queryData
          ? _.isEqual(JSON.parse(queryData), req.query)
          : !req.query?.length;

        const isPostDataEquals = postData
          ? getIsDeepEqual(JSON.parse(JSON.parse(postData)?.text), req.body)
          : method === 'GET';

        return isQueryDataEquals && isPostDataEquals;
      });
      const getResult = () => {
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

      res.status(request?.status || 200).send(getResult());
    } catch (parseErr) {
      console.error(`Error parsing JSON: ${parseErr}`);
      res.status(500).send('Error parsing JSON');
    }
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
