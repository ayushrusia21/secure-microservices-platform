const express = require("express");
const { Pool } = require("pg");
const client = require("prom-client");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

/* =========================
   PostgreSQL Connection
========================= */

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "postgres",
  port: 5432,
});

/* =========================
   Prometheus Metrics
========================= */

// Collect default Node.js metrics
client.collectDefaultMetrics();

// HTTP request counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
});

// HTTP request duration histogram
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  buckets: [0.1, 0.5, 1, 2, 5],
});

/* =========================
   Routes
========================= */

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Sample API endpoint (instrumented)
app.get("/api", async (req, res) => {
  const end = httpRequestDuration.startTimer();
  httpRequestCounter.inc();

  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  end();
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
