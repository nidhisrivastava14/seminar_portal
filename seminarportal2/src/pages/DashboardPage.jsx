import { useState, useEffect } from 'react'
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react'
import { db } from '../lib/supabase'

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

export default function DashboardPage() {
  const [events, setEvents]       = useState([])
  const [regCounts, setRegCounts] = useState({})
  const [loading, setLoading]     = useState(true)

  async function loadData() {
    setLoading(true)
    const { data: evs }  = await db.from('events').select('*').order('date', { ascending: true })
    const { data: regs } = await db.from('event_id').select('event_ref')
    const counts = {}
    ;(regs || []).forEach(r => { counts[r.event_ref] = (counts[r.event_ref] || 0) + 1 })
    setEvents(evs || [])
    setRegCounts(counts)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const totalRegs = Object.values(regCounts).reduce((a, b) => a + b, 0)
  const now = new Date()
  const weekEnd = new Date(); weekEnd.setDate(weekEnd.getDate() + 7)
  const thisWeek = events.filter(e => { const d = new Date(e.date); return d >= now && d <= weekEnd }).length
  const upcoming = events.filter(e => new Date(e.date) >= now).length
  const maxRegs = Math.max(...events.map(e => regCounts[e.id] || 0), 1)

  const statCards = [
    { icon: <Calendar size={20} />, label: 'Total Events',       value: events.length, color: 'var(--accent)'  },
    { icon: <Users size={20} />,    label: 'Total Registrations', value: totalRegs,     color: '#4deba0'        },
    { icon: <Clock size={20} />,    label: 'This Week',           value: thisWeek,      color: '#60a5fa'        },
    { icon: <TrendingUp size={20}/>, label: 'Upcoming',           value: upcoming,      color: 'var(--accent2)' },
  ]

  return (
    <div className="page-container fade-up">

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
          Overview of all events and registrations.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: '12px', color: 'var(--muted)' }}>
          <div style={{ width: '20px', height: '20px', border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {statCards.map(card => (
              <div key={card.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: card.color }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                    {card.label}
                  </div>
                  <div style={{ color: card.color }}>{card.icon}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '42px', fontWeight: '900', color: card.color, lineHeight: 1 }}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Registration Breakdown */}
          <div style={{ marginBottom: '12px' }}>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>
              Registration Breakdown
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
              Registrations per event
            </p>

            {events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
                <div style={{ fontFamily: 'var(--font-head)', color: 'var(--text)' }}>No events yet</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {events.map(ev => {
                  const count = regCounts[ev.id] || 0
                  const pct   = Math.round((count / maxRegs) * 100)
                  return (
                    <div key={ev.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '12px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>{ev.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <span>📅 {formatDate(ev.date)}</span>
                            <span>🕐 {formatTime(ev.time)}</span>
                            <span>🎙️ {ev.speaker}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontFamily: 'var(--font-head)', fontSize: '28px', fontWeight: '900', color: 'var(--accent)', lineHeight: 1 }}>{count}</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>registrants</div>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div style={{ background: 'var(--border)', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
                        <div style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent2))', height: '100%', width: `${pct}%`, borderRadius: '99px', transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
