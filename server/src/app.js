import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

export default app;
