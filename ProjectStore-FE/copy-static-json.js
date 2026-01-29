// copy-static-json.js
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "static.json");
const dest = path.join(__dirname, "build", "static.json");

fs.copyFile(src, dest, (err) => {
  if (err) {
    console.error("❌ Failed to copy static.json:", err);
  } else {
    console.log("✅ static.json copied to build/ successfully.");
  }
});
