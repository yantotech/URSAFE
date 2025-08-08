const express = require("express");
const db = require("../db");
const router = express.Router();

// GET semua CCTV aktif
router.get("/", (req, res) => {
  db.query(
    "SELECT id, title, location, latitude, longitude, status, created_at FROM cctv WHERE status = 'active'",
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    }
  );
});

module.exports = router;
