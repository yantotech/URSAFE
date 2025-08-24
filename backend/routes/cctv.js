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

//GET CCTV by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT id, nama_lokasi, status, kondisi, jaringan FROM cctv WHERE id = ?",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "CCTV not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
