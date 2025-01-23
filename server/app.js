const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 777;

app.use((req, res) => {
  const method = req.method;
  const urlPath = req.path;
  const filePath = path.join(__dirname, urlPath, `${method}.json`);

  // const filePath = path.join(
  //   __dirname,
  //   urlPath,
  //   `${method}_${JSON.stringify(
  //     req.query.sort((a, b) => a.name.localeCompare(b.name))
  //   )}.json`
  // );

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file from disk: ${err}`);
      return res.status(404).send('File not found');
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
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
