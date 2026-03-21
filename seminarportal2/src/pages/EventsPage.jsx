import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, Mic, Users } from 'lucide-react'
import { eventsAPI, registrationsAPI } from '../lib/api'
 
// ── Event Card Component ─────────────────────────────────
function EventCard({ event, regCount, onClick }) {
  const [hovered, setHovered] = useState(false)
 
  return (
    <div
      onClick={() => onClick(event)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '24px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.2)' : 'var(--card-shadow)',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.25s',
      }} />
 
      <div style={{
        display: 'inline-block',
        fontSize: '10px', fontWeight: '600',
        letterSpacing: '2px', textTransform: 'uppercase',
        color: 'var(--accent)',
        background: 'var(--accent-glow)',
        padding: '3px 10px', borderRadius: '99px',
        marginBottom: '14px',
      }}>
        {event.tag || 'Seminar'}
      </div>
 
      <div style={{
        fontFamily: 'var(--font-head)',
        fontSize: '18px', fontWeight: '700',
        lineHeight: '1.3', marginBottom: '14px',
        color: 'var(--text)',
      }}>
        {event.title}
      </div>
 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
        {[
          { icon: <Calendar size={13} />, text: formatDate(event.date) },
          { icon: <Clock size={13} />,    text: formatTime(event.time) },
          { icon: <Mic size={13} />,      text: event.speaker },
          { icon: <MapPin size={13} />,   text: event.location },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--muted)' }}>
            <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
 
      <p style={{
        fontSize: '13px', color: 'var(--muted)',
        lineHeight: '1.6', marginBottom: '18px',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {event.description}
      </p>
 
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted)' }}>
          <Users size={13} color="var(--accent)" />
          <span><strong style={{ color: 'var(--accent)' }}>{regCount}</strong> registered</span>
        </div>
        <div style={{
          background: 'var(--accent)',
          color: '#000',
          padding: '7px 16px',
          borderRadius: '7px',
          fontSize: '12px',
          fontWeight: '600',
        }}>
          Register →
        </div>
      </div>
    </div>
  )
}
 
// ── Registration Modal ───────────────────────────────────
function RegModal({ event, regCount, onClose, onSuccess }) {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
 
  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) { setError('Please fill in all fields.'); return }
    if (!email.includes('@'))          { setError('Enter a valid email address.'); return }
 
    setLoading(true); setError('')
 
    try {
      // Call our backend API — not Supabase directly!
      await registrationsAPI.create({
        name:     name.trim(),
        email:    email.trim(),
        event_id: event.id,
      })
      onSuccess(email)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    }
 
    setLoading(false)
  }
 
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '18px',
        padding: '32px',
        width: '100%', maxWidth: '500px',
        maxHeight: '90vh', overflowY: 'auto',
        animation: 'fadeUp 0.25s ease',
      }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>
          Register for Event
        </div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>
          Secure your spot — reminders sent automatically.
        </div>
 
        <div style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '22px',
        }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
            {event.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <span>📅 {formatDate(event.date)}</span>
            <span>🕐 {formatTime(event.time)}</span>
            <span>📍 {event.location}</span>
            <span>👥 {regCount} registered</span>
          </div>
        </div>
 
        {[
          { label: 'Full Name',     value: name,  set: setName,  type: 'text',  placeholder: 'e.g. Priya Sharma' },
          { label: 'Email Address', value: email, set: setEmail, type: 'email', placeholder: 'e.g. priya@iitd.ac.in' },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              {f.label}
            </label>
            <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} />
          </div>
        ))}
 
        {error && (
          <div style={{ background: 'rgba(200,50,50,0.1)', border: '1px solid rgba(200,50,50,0.3)', color: 'var(--danger)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '14px' }}>
            ⚠️ {error}
          </div>
        )}
 
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onClose} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '500' }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ background: 'var(--accent)', color: '#000', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Saving...' : '✓ Confirm Registration'}
          </button>
        </div>
      </div>
    </div>
  )
}
 
// ── Toast ────────────────────────────────────────────────
function Toast({ message, onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 3500)
    return () => clearTimeout(t)
  }, [])
 
  return (
    <div style={{
      position: 'fixed', bottom: '28px', right: '28px', zIndex: 999,
      background: 'var(--success)', color: '#fff',
      padding: '14px 22px', borderRadius: '10px',
      fontSize: '14px', fontWeight: '500',
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      animation: 'fadeUp 0.3s ease',
    }}>
      ✅ {message}
    </div>
  )
}
 
// ── Main Events Page ─────────────────────────────────────
export default function EventsPage() {
  const [events, setEvents]          = useState([])
  const [regCounts, setRegCounts]    = useState({})
  const [loading, setLoading]        = useState(true)
  const [selectedEvent, setSelected] = useState(null)
  const [toast, setToast]            = useState('')
 
  async function loadEvents() {
    setLoading(true)
    try {
      // Call our backend API
      const eventsRes = await eventsAPI.getAll()
      const regsRes   = await registrationsAPI.getAll()
 
      const counts = {}
      ;(regsRes.data || []).forEach(r => {
        counts[r.event_id] = (counts[r.event_id] || 0) + 1
      })
 
      setEvents(eventsRes.data || [])
      setRegCounts(counts)
    } catch (err) {
      console.error('Error loading events:', err)
    }
    setLoading(false)
  }
 
  useEffect(() => { loadEvents() }, [])
 
  const totalRegs = Object.values(regCounts).reduce((a, b) => a + b, 0)
  const now = new Date()
  const weekEnd = new Date(); weekEnd.setDate(weekEnd.getDate() + 7)
  const thisWeek = events.filter(e => { const d = new Date(e.date); return d >= now && d <= weekEnd }).length
 
  return (
    <div className="page-container fade-up">
      <div style={{ textAlign: 'center', padding: '56px 20px 48px' }}>
        <div style={{
          display: 'inline-block',
          fontSize: '11px', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase',
          color: 'var(--accent)', background: 'var(--accent-glow)',
          border: '1px solid var(--accent)', padding: '5px 16px', borderRadius: '99px',
          marginBottom: '20px',
        }}>
          🎓 Academic Excellence
        </div>
 
        <h1 style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(32px, 5vw, 60px)',
          fontWeight: '900', lineHeight: '1.1',
          marginBottom: '16px', color: 'var(--text)',
        }}>
          Discover <span style={{ color: 'var(--accent)' }}>Seminars</span><br />& Events
        </h1>
 
        <p style={{ color: 'var(--muted)', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
          Register for upcoming talks, workshops, and lectures hosted by your department.
        </p>
 
        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '36px' }}>
          {[
            { num: events.length, label: 'Events' },
            { num: totalRegs,     label: 'Registrations' },
            { num: thisWeek,      label: 'This Week' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '38px', fontWeight: '900', color: 'var(--accent)', lineHeight: 1 }}>
                {s.num}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '4px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
 
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>
          Upcoming Seminars
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
          Sorted by date — click any event to register.
        </p>
      </div>
 
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: '12px', color: 'var(--muted)' }}>
          <div style={{ width: '20px', height: '20px', border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <h3 style={{ fontFamily: 'var(--font-head)', color: 'var(--text)', marginBottom: '8px' }}>No Events Yet</h3>
          <p>Ask an admin to add events.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {events.map(ev => (
            <EventCard
              key={ev.id}
              event={ev}
              regCount={regCounts[ev.id] || 0}
              onClick={setSelected}
            />
          ))}
        </div>
      )}
 
      {selectedEvent && (
        <RegModal
          event={selectedEvent}
          regCount={regCounts[selectedEvent.id] || 0}
          onClose={() => setSelected(null)}
          onSuccess={email => {
            setSelected(null)
            setToast(`Registered! Reminder will be sent to ${email}`)
            loadEvents()
          }}
        />
      )}
 
      {toast && <Toast message={toast} onHide={() => setToast('')} />}
    </div>
  )
}
 
// ── Helpers ──────────────────────────────────────────────
function formatDate(d) {
  if (!d) return ''
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}
function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`
}