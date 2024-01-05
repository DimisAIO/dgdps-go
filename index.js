const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file || file.mimetype !== 'application/x-msdownload') {
    res.status(400).send('Invalid file');
    return;
  }

  const fileContent = req.file.buffer.toString('binary');

  let modifiedContent = fileContent;

  // Check if the file contains the instance of "http://www.boomlings.com/database"
  if (!fileContent.includes('www.boomlings.com/database')) {
    res.status(400).send('File does not contain "http://www.boomlings.com/database"! Did you use a gdps?');
    return;
  } else if(modifiedContent.includes('http://www.boomlings.com/database')) {
    modifiedContent = modifiedContent.replace(/http:\/\/www\.boomlings\.com\/database/g, 'https://dindegmdps.us.to/database');
  } else {
    modifiedContent = modifiedContent.replace(/https:\/\/www\.boomlings\.com\/database/g, 'https://dindegmdps.us.to//database');
  }

  modifiedContent = modifiedContent.replace(/aHR0cDovL3d3dy5ib29tbGluZ3MuY29tL2RhdGFiYXNl/g, 'aHR0cHM6Ly9kaW5kZWdtZHBzLnVzLnRvL2RhdGFiYXNl');

  const modifiedFile = Buffer.from(modifiedContent, 'binary');

  res.setHeader('Content-Disposition', 'attachment; filename=DindeGDPS.exe');
  res.setHeader('Content-Type', 'application/x-msdownload');
  res.send(modifiedFile);
});

app.listen(8100, () => {
  console.log(`Server is running on port lol`);
});
