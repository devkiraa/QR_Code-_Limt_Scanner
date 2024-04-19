const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const port = 3000;

const imageAccessData = {}; // Object to store access data for each image

// Load access data from CSV file on server start
fs.createReadStream('access_data.csv')
  .pipe(csv())
  .on('data', (row) => {
    imageAccessData[row.filename] = {
      totalAccess: parseInt(row.totalAccess),
      remainingAccess: parseInt(row.remainingAccess)
    };
  })
  .on('end', () => {
    console.log('Access data loaded');
  });

// Middleware to check access count and block if necessary
function checkAccess(req, res, next) {
  const filename = req.params.filename;

  if (!imageAccessData[filename]) {
    return res.status(404).send('Image not found');
  }

  if (imageAccessData[filename].remainingAccess <= 0) {
    return res.status(403).send('Access limit reached for this image');
  }

  imageAccessData[filename].remainingAccess--;
  fs.writeFileSync('access_data.csv', generateCSVFromObject(imageAccessData));

  next();
}

// Helper function to generate CSV string from object
function generateCSVFromObject(data) {
  let csvString = 'filename,totalAccess,remainingAccess\n';
  for (const filename in data) {
    csvString += `${filename},${data[filename].totalAccess},${data[filename].remainingAccess}\n`;
  }
  return csvString;
}

// Route to serve images
app.get('/images/:filename', checkAccess, (req, res) => {
  const filename = req.params.filename;
  res.sendFile(`${__dirname}/Images/${filename}`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
