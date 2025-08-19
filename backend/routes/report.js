// routes/report.js
const express = require("express");
const db = require("../db");
const router = express.Router();

// =================== POST /api/reports ===================
router.post("/", (req, res) => {
  let {
    jenisKejadian,
    lokasiKejadian,
    latitude,
    longitude,
    waktuKejadian,
    deskripsiKejadian,
  } = req.body;

  console.log("BODY DITERIMA:", req.body); // debug log

  if (!jenisKejadian || !lokasiKejadian || !waktuKejadian || !deskripsiKejadian) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  // pastikan angka
  latitude =
    latitude !== null && latitude !== undefined && latitude !== ""
      ? parseFloat(latitude)
      : null;
  longitude =
    longitude !== null && longitude !== undefined && longitude !== ""
      ? parseFloat(longitude)
      : null;

  console.log("Latitude parsed:", latitude, "Longitude parsed:", longitude); // debug log

  const sql = `
    INSERT INTO reports 
    (jenisKejadian, lokasiKejadian, latitude, longitude, waktuKejadian, deskripsiKejadian) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [jenisKejadian, lokasiKejadian, latitude, longitude, waktuKejadian, deskripsiKejadian],
    (err, result) => {
      if (err) {
        console.error("Error insert:", err);
        return res.status(500).json({ error: "Gagal menyimpan data" });
      }
      res
        .status(201)
        .json({ message: "Report berhasil disimpan", id: result.insertId });
    }
  );
});

// =================== GET /api/reports ===================
router.get("/", (req, res) => {
  const sql = "SELECT * FROM reports ORDER BY waktuKejadian DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetch reports:", err);
      return res.status(500).json({ error: "Gagal mengambil data reports" });
    }
    res.json(results);
  });
});

// =================== GET /api/reports/:id ===================
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM reports WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetch report by id:", err);
      return res.status(500).json({ error: "Gagal mengambil data report" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Report tidak ditemukan" });
    }
    res.json(results[0]);
  });
});

module.exports = router;
