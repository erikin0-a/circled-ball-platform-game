const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

