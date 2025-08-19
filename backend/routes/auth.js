const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const router = express.Router();

// REGISTER
router.post("/register", (req, res) => {
  const { fullName, userName, address, email, phoneNumber, password } = req.body;

  // Cek apakah username sudah dipakai
  db.query("SELECT * FROM users WHERE userName = ?", [userName], async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    db.query(
      "INSERT INTO users (fullName, userName, address, email, phoneNumber, passwordUser) VALUES (?, ?, ?, ?, ?, ?)",
      [fullName, userName, address, email, phoneNumber, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
});

// LOGIN
router.post("/login", (req, res) => {
  const { userName, password } = req.body;

  db.query("SELECT * FROM admin_login WHERE adminName = ?", [userName], (err, adminResults) => {
    if (err) return res.status(500).json({ error: err });

    if (adminResults.length > 0) {
      const admin = adminResults[0];

      if (password.trim() === admin.passwordAdmin.trim()) {
        return res.json({ message: "Login successful", role: "admin", user: admin });
      } else {
        return res.status(400).json({ error: "Invalid password" });
      }
    }

  db.query("SELECT * FROM users WHERE userName = ?", [userName], async (err, userResults) => {
    if (err) return res.status(500).json({ error: err });

    if (userResults.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = userResults[0];

    // Cek password
    const isMatch = await bcrypt.compare(password, user.passwordUser);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.json({ message: "Login successful", role: "user", user });
  });
});
});

module.exports = router;
