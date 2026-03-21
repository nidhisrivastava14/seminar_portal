 
const express  = require('express')
const router   = express.Router()
const supabase = require('../supabase')
const verifyToken = require('../middleware/auth')
 
// ── POST register for event ──────────────────────────────
// Anyone can register (students)
router.post('/', async (req, res) => {
  try {
    const { name, email, event_id } = req.body
 
    // ── Input Validation ─────────────────────────────────
    // Check all fields are provided
    if (!name || !email || !event_id) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and event are required'
      })
    }
 
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      })
    }
 
    // Check name is not just numbers
    if (/^\d+$/.test(name)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid name'
      })
    }
 
    // ── Duplicate Check ──────────────────────────────────
    // Convert email to lowercase to prevent duplicates
    const cleanEmail = email.toLowerCase().trim()
 
    const { data: existing } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', event_id)
      .eq('email', cleanEmail)
 
    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered for this event'
      })
    }
 
    // ── Save Registration ────────────────────────────────
    const { data, error } = await supabase
      .from('registrations')
      .insert([{
        name:          name.trim(),
        email:         cleanEmail,
        event_id:      event_id,
        registered_at: new Date().toISOString()
      }])
      .select()
 
    if (error) throw error
 
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: data[0]
    })
 
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})
 
// ── GET registrations for one event (admin only) ─────────
router.get('/:eventId', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', req.params.eventId)
      .order('registered_at', { ascending: false })
 
    if (error) throw error
 
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})
 
// ── GET registration counts for all events ───────────────
router.get('/', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('event_id')
 
    if (error) throw error
 
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})
 
module.exports = router
 