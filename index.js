const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const FILE = path.join(__dirname, "visits.json");

let lock = false;

function readCounter() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ count: 0 }));
  }
  const data = fs.readFileSync(FILE);
  return JSON.parse(data).count;
}

function writeCounter(count) {
  fs.writeFileSync(FILE, JSON.stringify({ count }, null, 2));
}

app.get("/", async (req, res) => {
  while (lock) {
    await new Promise(r => setTimeout(r, 10));
  }

  lock = true;

  let count = readCounter();
  count++;
  writeCounter(count);

  lock = false;

  res.send(`Nombre de visites : ${count}`);
});

app.listen(PORT, () => {
  console.log("Server running");
});