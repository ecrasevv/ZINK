const express = require("express");
const path = require("path");

const app = express();

// handle GET -> serve the starter page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/login.html'));
});

// handle CSS, img, HTML
app.use(express.static(path.join(__dirname, '../src')));

// handle POST 
app.post('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(3000, () => {
    console.log("App listening on port 3000");
});

