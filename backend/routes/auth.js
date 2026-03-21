
// ── What is this file? ──────────────────────────────────
// This file handles admin login and authentication.
// POST /api/auth/login  → admin logs in, gets a token
// GET  /api/auth/verify → check if token is still valid
 
const express = require('express')
const router  = express.Router()
const jwt     = require('jsonwebtoken')
const verifyToken = require('../middleware/auth')
 
// ── Admin credentials ────────────────────────────────────
// In a real app these would be in the database
// For now we store them in .env
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@academix.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@2026'
 
// ── POST /api/auth/login ─────────────────────────────────
// Admin sends email + password
// We check if correct and send back a token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
 
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }
 
    // Check if credentials match
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }
 
    // Create a JWT token
    // This token expires in 24 hours
    const token = jwt.sign(
      { email, role: 'admin' },   // data stored in token
      process.env.JWT_SECRET,      // secret key to sign token
      { expiresIn: '24h' }         // token expires in 24 hours
    )
 
    res.json({
      success: true,
      message: 'Login successful!',
      token
    })
 
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})
 
// ── GET /api/auth/verify ─────────────────────────────────
// Check if the admin's token is still valid
// Used when admin refreshes the page
router.get('/verify', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    admin: req.admin
  })
})
 
module.exports = router
 