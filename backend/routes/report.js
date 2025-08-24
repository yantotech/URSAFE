// routes/report.js
const express = require("express");
const db = require("../db");
const router = express.Router();

// =================== POST /api/reports (user buat laporan → masuk reports dulu) ===================
router.post("/", (req, res) => {
  let {
    userId,
    jenisKejadian,
    lokasiKejadian,
    latitude,
    longitude,
    waktuKejadian,
    deskripsiKejadian,
  } = req.body;

  console.log("BODY DITERIMA:", req.body);

  if (!userId || !jenisKejadian || !lokasiKejadian || !waktuKejadian || !deskripsiKejadian) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  latitude =
    latitude !== null && latitude !== undefined && latitude !== ""
      ? parseFloat(latitude)
      : null;
  longitude =
    longitude !== null && longitude !== undefined && longitude !== ""
      ? parseFloat(longitude)
      : null;

  const sql = `
    INSERT INTO reports 
    (userId, jenisKejadian, lokasiKejadian, latitude, longitude, waktuKejadian, deskripsiKejadian) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [userId, jenisKejadian, lokasiKejadian, latitude, longitude, waktuKejadian, deskripsiKejadian],
    (err, result) => {
      if (err) {
        console.error("Error insert:", err);
        return res.status(500).json({ error: "Gagal menyimpan data" });
      }
      res.status(201).json({ message: "Report pending berhasil disimpan", id: result.insertId });
    }
  );
});

// =================== GET semua laporan pending (belum diverifikasi) ===================
router.get("/pending", (req, res) => {
  const sql = `
    SELECT 
      r.id, 
      r.userId,
      r.jenisKejadian AS jenis, 
      r.lokasiKejadian AS lokasi,
      r.latitude,
      r.longitude,
      r.waktuKejadian AS waktu,
      r.deskripsiKejadian AS deskripsi,
      u.fullName AS nama
    FROM reports r
    JOIN users u ON r.userId = u.id
    ORDER BY r.waktuKejadian DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetch pending reports:", err);
      return res.status(500).json({ error: "Gagal mengambil data reports" });
    }
    res.json(results);
  });
});

// =================== ADMIN ACC laporan → pindah ke verified ===================
router.post("/accept/:id", (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT * FROM reports WHERE id = ?";
  db.query(selectSql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ambil data report" });
    if (results.length === 0) return res.status(404).json({ error: "Report tidak ditemukan" });

    const report = results[0];

    const insertSql = `
      INSERT INTO verified 
      (userId, jenisKejadian, lokasiKejadian, latitude, longitude, waktuKejadian, deskripsiKejadian) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertSql, [
      report.userId,
      report.jenisKejadian,
      report.lokasiKejadian,
      report.latitude,
      report.longitude,
      report.waktuKejadian,
      report.deskripsiKejadian
    ], (err) => {
      if (err) return res.status(500).json({ error: "Gagal pindah ke verified" });

      const deleteSql = "DELETE FROM reports WHERE id = ?";
      db.query(deleteSql, [id], (err) => {
        if (err) return res.status(500).json({ error: "Gagal hapus dari reports" });
        res.json({ message: "Laporan berhasil diverifikasi" });
      });
    });
  });
});

// =================== ADMIN REJECT laporan (hapus dari reports) ===================
router.delete("/reject/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM reports WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Gagal reject report" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Report tidak ditemukan" });
    res.json({ message: "Laporan ditolak & dihapus" });
  });
});

// =================== GET semua laporan yang sudah verified ===================
router.get("/verified", (req, res) => {
  const sql = `
    SELECT 
      v.id, 
      v.userId,
      v.jenisKejadian AS jenis, 
      v.lokasiKejadian AS lokasi,
      v.latitude,
      v.longitude,
      v.waktuKejadian AS waktu,
      v.deskripsiKejadian AS deskripsi,
      u.fullName AS nama
    FROM verified v
    JOIN users u ON v.userId = u.id
    ORDER BY v.waktuKejadian DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ambil data verified" });
    res.json(results);
  });
});

// =================== GET detail report pending by id ===================
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

//grafik
router.get("/", (req, res) => {
  const { from, to } = req.query;

  let sql = "SELECT jenisKejadian, COUNT(*) AS jumlah FROM reports";
  let params = [];

  if (from && to) {
    sql += " WHERE tanggalKejadian BETWEEN ? AND ?";
    params.push(from + " 00:00:00", to + " 23:59:59");
  }

  sql += " GROUP BY jenisKejadian";

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Gagal ambil report" });
    }
    res.json(results);
  });
});

// GET laporan per bulan
// GET laporan per bulan
router.get("/chart-bulan", (req, res) => {
  const sql = `
    SELECT 
      DATE_FORMAT(tanggalKejadian, '%Y-%m') AS bulan,
      COUNT(*) AS total
    FROM kejadian
    GROUP BY DATE_FORMAT(tanggalKejadian, '%Y-%m')
    ORDER BY bulan ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Query gagal" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Report tidak ditemukan" });
    }

    // hasilnya array, cocok untuk data.map di React
    res.json(results);
  });
});


module.exports = router;