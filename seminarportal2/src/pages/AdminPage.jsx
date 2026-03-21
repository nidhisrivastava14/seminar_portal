import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Users, X, Calendar, Clock, MapPin, Mic, Tag, FileText } from 'lucide-react'
import { db } from '../lib/supabase'
 
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
 
// ── Event Form Modal ─────────────────────────────────────
function EventFormModal({ event, onClose, onSave }) {
  const [form, setForm] = useState({
    title:       event?.title       || '',
    speaker:     event?.speaker     || '',
    date:        event?.date        || '',
    time:        event?.time        || '',
    location:    event?.location    || '',
    tag:         event?.tag         || '',
    description: event?.description || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
 
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
 
  const handleSave = async () => {
    if (!form.title || !form.speaker || !form.date || !form.time || !form.location) {
      setError('Please fill in all required fields.'); return
    }
    setLoading(true); setError('')
 
    let err
    if (event?.id) {
      const { error: e } = await db.from('events').update(form).eq('id', event.id)
      err = e
    } else {
      const { error: e } = await db.from('events').insert([{ ...form, tag: form.tag || 'Seminar' }])
      err = e
    }
 
    setLoading(false)
    if (err) { setError('Failed to save. Please try again.'); return }
    onSave()
  }
 
  const fields = [
    { key: 'title',       label: 'Event Title',          icon: <FileText size={14} />, type: 'text',     placeholder: 'e.g. Introduction to Topology',   required: true  },
    { key: 'speaker',     label: 'Speaker / Host',        icon: <Mic size={14} />,      type: 'text',     placeholder: 'e.g. Prof. Ramanujan',             required: true  },
    { key: 'date',        label: 'Date',                  icon: <Calendar size={14} />, type: 'date',     placeholder: '',                                required: true  },
    { key: 'time',        label: 'Time',                  icon: <Clock size={14} />,    type: 'time',     placeholder: '',                                required: true  },
    { key: 'location',    label: 'Location / Link',       icon: <MapPin size={14} />,   type: 'text',     placeholder: 'e.g. Room 301 or Zoom link',       required: true  },
    { key: 'tag',         label: 'Department / Tag',      icon: <Tag size={14} />,      type: 'text',     placeholder: 'e.g. Mathematics',                required: false },
  ]
 
  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'18px', padding:'32px', width:'100%', maxWidth:'520px', maxHeight:'90vh', overflowY:'auto', animation:'fadeUp 0.25s ease' }}>
 
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
          <div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:'22px', fontWeight:'700' }}>
              {event?.id ? 'Edit Event' : 'Add New Event'}
            </div>
            <div style={{ fontSize:'13px', color:'var(--muted)', marginTop:'2px' }}>
              {event?.id ? 'Update the event details below.' : 'Fill in the seminar details below.'}
            </div>
          </div>
          <button onClick={onClose} style={{ background:'var(--bg)', border:'1px solid var(--border)', color:'var(--muted)', width:'32px', height:'32px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <X size={16} />
          </button>
        </div>
 
        {/* Fields */}
        {fields.map(f => (
          <div key={f.key} style={{ marginBottom:'14px' }}>
            <label style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', fontWeight:'600', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'6px' }}>
              <span style={{ color:'var(--accent)' }}>{f.icon}</span>
              {f.label} {f.required && <span style={{ color:'var(--accent)' }}>*</span>}
            </label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder}
            />
          </div>
        ))}
 
        {/* Description */}
        <div style={{ marginBottom:'14px' }}>
          <label style={{ display:'block', fontSize:'11px', fontWeight:'600', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'6px' }}>
            Description
          </label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Brief description of the event..."
            style={{ minHeight:'90px' }}
          />
        </div>
 
        {/* Error */}
        {error && (
          <div style={{ background:'rgba(200,50,50,0.1)', border:'1px solid rgba(200,50,50,0.3)', color:'var(--danger)', borderRadius:'8px', padding:'10px 14px', fontSize:'13px', marginBottom:'14px' }}>
            ⚠️ {error}
          </div>
        )}
 
        {/* Actions */}
        <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'20px' }}>
          <button onClick={onClose} style={{ background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text)', padding:'10px 20px', borderRadius:'8px', fontSize:'13px', fontWeight:'500' }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{ background:'var(--accent)', color:'#000', padding:'10px 24px', borderRadius:'8px', fontSize:'13px', fontWeight:'600', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Saving...' : (event?.id ? 'Update Event' : 'Add Event')}
          </button>
        </div>
      </div>
    </div>
  )
}
 
// ── Registrants Modal ────────────────────────────────────
function RegsModal({ event, onClose }) {
  const [regs, setRegs]       = useState([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    async function load() {
      const { data } = await db.from('event_id').select('*').eq('event_ref', event.id).order('registered_at', { ascending: false })
      setRegs(data || [])
      setLoading(false)
    }
    load()
  }, [event.id])
 
  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'18px', padding:'32px', width:'100%', maxWidth:'500px', maxHeight:'85vh', overflowY:'auto', animation:'fadeUp 0.25s ease' }}>
 
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px' }}>
          <div style={{ fontFamily:'var(--font-head)', fontSize:'20px', fontWeight:'700' }}>Registered Participants</div>
          <button onClick={onClose} style={{ background:'var(--bg)', border:'1px solid var(--border)', color:'var(--muted)', width:'32px', height:'32px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ fontSize:'13px', color:'var(--muted)', marginBottom:'20px' }}>{event.title}</div>
 
        {loading ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'40px', gap:'12px', color:'var(--muted)' }}>
            <div style={{ width:'18px', height:'18px', border:'2px solid var(--border)', borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
            Loading...
          </div>
        ) : regs.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px', color:'var(--muted)' }}>
            <div style={{ fontSize:'40px', marginBottom:'12px' }}>👤</div>
            <div style={{ fontFamily:'var(--font-head)', color:'var(--text)', marginBottom:'6px' }}>No Registrations Yet</div>
            <div style={{ fontSize:'13px' }}>Nobody has registered for this event.</div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {regs.map(r => (
              <div key={r.id} style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', padding:'14px 16px', display:'flex', alignItems:'center', gap:'14px' }}>
                <div style={{ width:'38px', height:'38px', background:'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700', fontSize:'15px', color:'#000', flexShrink:0 }}>
                  {r.name[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight:'500', fontSize:'14px' }}>{r.name}</div>
                  <div style={{ fontSize:'12px', color:'var(--muted)' }}>{r.email}</div>
                  <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'2px' }}>
                    {new Date(r.registered_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
 
// ── Toast ────────────────────────────────────────────────
function Toast({ message, color = 'var(--success)', onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 3000)
    return () => clearTimeout(t)
  }, [])
  return (
    <div style={{ position:'fixed', bottom:'28px', right:'28px', zIndex:999, background:color, color:'#fff', padding:'14px 22px', borderRadius:'10px', fontSize:'14px', fontWeight:'500', boxShadow:'0 8px 30px rgba(0,0,0,0.3)', animation:'fadeUp 0.3s ease' }}>
      {message}
    </div>
  )
}
 
// ── Main Admin Page ──────────────────────────────────────
export default function AdminPage() {
  const [events, setEvents]       = useState([])
  const [regCounts, setRegCounts] = useState({})
  const [loading, setLoading]     = useState(true)
  const [formEvent, setFormEvent] = useState(null)   // null = closed, {} = new, event = edit
  const [viewRegs, setViewRegs]   = useState(null)
  const [toast, setToast]         = useState(null)
 
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
 
  async function handleDelete(id) {
    if (!confirm('Delete this event and all its registrations?')) return
    await db.from('event_id').delete().eq('event_ref', id)
    await db.from('events').delete().eq('id', id)
    setToast({ msg: '🗑️ Event deleted.', color: 'var(--danger)' })
    loadData()
  }
 
  return (
    <div className="page-container fade-up">
 
      {/* Page header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px', marginBottom:'32px' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'32px', fontWeight:'700', marginBottom:'4px' }}>
            Admin Panel
          </h1>
          <p style={{ color:'var(--muted)', fontSize:'14px' }}>
            Manage seminars and view registrations.
          </p>
        </div>
        <button
          onClick={() => setFormEvent({})}
          style={{ display:'flex', alignItems:'center', gap:'8px', background:'var(--accent)', color:'#000', padding:'11px 22px', borderRadius:'10px', fontSize:'14px', fontWeight:'600' }}
        >
          <Plus size={16} /> Add Event
        </button>
      </div>
 
      {/* Table */}
      {loading ? (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'80px', gap:'12px', color:'var(--muted)' }}>
          <div style={{ width:'20px', height:'20px', border:'2px solid var(--border)', borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 20px', color:'var(--muted)' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>📋</div>
          <h3 style={{ fontFamily:'var(--font-head)', color:'var(--text)', marginBottom:'8px' }}>No Events Yet</h3>
          <p>Click "Add Event" to create your first seminar.</p>
        </div>
      ) : (
        <div style={{ overflowX:'auto', borderRadius:'var(--radius)', border:'1px solid var(--border)' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead style={{ background:'var(--bg)' }}>
              <tr>
                {['Event Title', 'Date & Time', 'Speaker', 'Location', 'Registrants', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'13px 16px', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'1.5px', color:'var(--muted)', whiteSpace:'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id} style={{ borderTop:'1px solid var(--border)' }}>
                  <td style={{ padding:'14px 16px', fontWeight:'600', fontSize:'13px', maxWidth:'200px' }}>
                    <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ev.title}</div>
                    <div style={{ fontSize:'11px', color:'var(--accent)', marginTop:'3px' }}>{ev.tag}</div>
                  </td>
                  <td style={{ padding:'14px 16px', fontSize:'13px', color:'var(--muted)', whiteSpace:'nowrap' }}>
                    <div>{formatDate(ev.date)}</div>
                    <div style={{ marginTop:'2px' }}>{formatTime(ev.time)}</div>
                  </td>
                  <td style={{ padding:'14px 16px', fontSize:'13px', whiteSpace:'nowrap' }}>{ev.speaker}</td>
                  <td style={{ padding:'14px 16px', fontSize:'13px', color:'var(--muted)', maxWidth:'160px' }}>
                    <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ev.location}</div>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ fontFamily:'var(--font-head)', fontSize:'20px', fontWeight:'700', color:'var(--accent)' }}>
                      {regCounts[ev.id] || 0}
                    </span>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <button
                        onClick={() => setViewRegs(ev)}
                        style={{ display:'flex', alignItems:'center', gap:'5px', background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text)', padding:'6px 12px', borderRadius:'7px', fontSize:'12px', fontWeight:'500' }}
                      >
                        <Users size={13} /> View
                      </button>
                      <button
                        onClick={() => setFormEvent(ev)}
                        style={{ display:'flex', alignItems:'center', gap:'5px', background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text)', padding:'6px 12px', borderRadius:'7px', fontSize:'12px', fontWeight:'500' }}
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        style={{ display:'flex', alignItems:'center', gap:'5px', background:'rgba(200,50,50,0.1)', border:'1px solid rgba(200,50,50,0.3)', color:'var(--danger)', padding:'6px 12px', borderRadius:'7px', fontSize:'12px', fontWeight:'500' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
 
      {/* Modals */}
      {formEvent !== null && (
        <EventFormModal
          event={formEvent}
          onClose={() => setFormEvent(null)}
          onSave={() => {
            setFormEvent(null)
            setToast({ msg: '✅ Event saved successfully!', color: 'var(--success)' })
            loadData()
          }}
        />
      )}
 
      {viewRegs && (
        <RegsModal event={viewRegs} onClose={() => setViewRegs(null)} />
      )}
 
      {toast && <Toast message={toast.msg} color={toast.color} onHide={() => setToast(null)} />}
    </div>
  )
}