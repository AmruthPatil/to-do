import { useState } from 'react';

const PRIORITIES = [
  { value: 'high',   label: 'High',   color: '#c84b2f' },
  { value: 'medium', label: 'Medium', color: '#c47c1a' },
  { value: 'low',    label: 'Low',    color: '#2855a0' },
];

export default function TaskForm({ onAdd }) {
  const [open, setOpen]         = useState(false);
  const [title, setTitle]       = useState('');
  const [desc, setDesc]         = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate]   = useState('');
  const [loading, setLoading]   = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onAdd({ title, description: desc, priority, dueDate: dueDate || null });
      setTitle(''); setDesc(''); setPriority('medium'); setDueDate('');
      setOpen(false);
    } finally { setLoading(false); }
  };

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{
      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
      padding: '14px 18px', background: 'white', border: '1.5px dashed var(--border2)',
      borderRadius: 'var(--radius)', cursor: 'pointer', color: 'var(--ink3)',
      fontSize: 14, fontFamily: 'var(--sans)', transition: 'all 0.15s',
      boxShadow: 'var(--shadow)'
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--ink3)'; }}
    >
      <span style={{ fontSize: 20, lineHeight: 1, color: 'var(--accent)' }}>+</span>
      Add a new task…
    </button>
  );

  return (
    <form onSubmit={submit} className="animate-in" style={{
      background: 'white', borderRadius: 'var(--radius)',
      border: '1.5px solid var(--accent)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden'
    }}>
      {/* Title */}
      <div style={{ padding: '16px 18px 10px' }}>
        <input
          autoFocus value={title} onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          style={{
            width: '100%', border: 'none', outline: 'none', fontSize: 16,
            fontFamily: 'var(--sans)', fontWeight: 500, color: 'var(--ink)',
            background: 'transparent'
          }}
        />
        <textarea
          value={desc} onChange={e => setDesc(e.target.value)}
          placeholder="Add details (optional)…" rows={2}
          style={{
            width: '100%', border: 'none', outline: 'none', resize: 'none',
            fontSize: 13, color: 'var(--ink2)', fontFamily: 'var(--sans)',
            background: 'transparent', marginTop: 6, lineHeight: 1.5
          }}
        />
      </div>

      {/* Options row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px',
        borderTop: '1px solid var(--border)', background: 'var(--paper)',
        flexWrap: 'wrap'
      }}>
        {/* Priority */}
        <div style={{ display: 'flex', gap: 5 }}>
          {PRIORITIES.map(p => (
            <button key={p.value} type="button" onClick={() => setPriority(p.value)} style={{
              padding: '4px 10px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
              fontFamily: 'var(--sans)', fontWeight: 500, transition: 'all 0.12s',
              background: priority === p.value ? p.color : 'transparent',
              color: priority === p.value ? 'white' : 'var(--ink3)',
              border: `1px solid ${priority === p.value ? p.color : 'var(--border2)'}`,
            }}>{p.label}</button>
          ))}
        </div>

        {/* Due date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 'auto' }}>
          <span style={{ fontSize: 12, color: 'var(--ink3)' }}>Due:</span>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
            style={{
              border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)',
              padding: '3px 8px', fontSize: 12, color: 'var(--ink2)',
              fontFamily: 'var(--sans)', background: 'white', outline: 'none'
            }}
          />
        </div>

        {/* Actions */}
        <button type="button" onClick={() => setOpen(false)} style={{
          padding: '5px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border2)',
          background: 'transparent', color: 'var(--ink3)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--sans)'
        }}>Cancel</button>
        <button type="submit" disabled={!title.trim() || loading} style={{
          padding: '5px 16px', borderRadius: 'var(--radius-sm)', border: 'none',
          background: title.trim() ? 'var(--accent)' : 'var(--border2)',
          color: 'white', fontSize: 13, fontWeight: 500, cursor: title.trim() ? 'pointer' : 'default',
          fontFamily: 'var(--sans)', transition: 'background 0.15s'
        }}>{loading ? 'Adding…' : 'Add task'}</button>
      </div>
    </form>
  );
}
