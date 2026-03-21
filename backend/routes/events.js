 
const express  = require('express')
const router   = express.Router()
const supabase = require('../supabase')
const verifyToken = require('../middleware/auth.js')
console.log('verifyToken type:', typeof verifyToken)
 
// ── GET all events ───────────────────────────────────────
// Anyone can see events (students + admin)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
 
    if (error) throw error
 
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})
 
// ── GET one event by ID ──────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single()
 
    if (error) throw error
 
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})
 
// ── POST create new event (admin only) ───────────────────
// verifyToken checks if the admin is logged in
router.post('/', verifyToken, async (req, res) => {
  try {
    // Validate required fields
    const { title, speaker, date, time, location } = req.body
    if (!title || !speaker || !date || !time || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      })
    }
 
    const { data, error } = await supabase
      .from('events')
      .insert([req.body])
      .select()
 
    if (error) throw error
 
    res.status(201).json({ success: true, data: data[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})
 
// ── PUT update event (admin only) ────────────────────────
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
 
    if (error) throw error
 
    res.json({ success: true, data: data[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})
 
// ── DELETE event (admin only) ─────────────────────────────
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // First delete all registrations for this event
    await supabase
      .from('registrations')
      .delete()
      .eq('event_id', req.params.id)
 
    // Then delete the event itself
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', req.params.id)
 
    if (error) throw error
 
    res.json({ success: true, message: 'Event deleted successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})
 
module.exports = router