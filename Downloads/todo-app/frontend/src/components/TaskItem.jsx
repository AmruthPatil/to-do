import { useState } from 'react';

const PRIORITY_META = {
  high:   { label: 'High',   color: '#c84b2f', bg: 'rgba(200,75,47,0.08)'   },
  medium: { label: 'Medium', color: '#c47c1a', bg: 'rgba(196,124,26,0.08)'  },
  low:    { label: 'Low',    color: '#2855a0', bg: 'rgba(40,85,160,0.08)'   },
};

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dueDate, completed) {
  return !completed && dueDate && new Date(dueDate) < new Date();
}

export default function TaskItem({ task, onToggle, onPin, onDelete, onUpdate }) {
  const [editing, setEditing]   = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [deleting, setDeleting] = useState(false);
  const pm = PRIORITY_META[task.priority] || PRIORITY_META.medium;
  const overdue = isOverdue(task.dueDate, task.completed);

  const saveEdit = async () => {
    if (editTitle.trim() && editTitle !== task.title) {
      await onUpdate(task.id, { title: editTitle.trim() });
    }
    setEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task.id);
  };

  return (
    <div className="animate-in" style={{
      display: 'flex', gap: 12, padding: '14px 16px',
      background: task.completed ? 'var(--paper2)' : 'white',
      borderRadius: 'var(--radius)', border: '1px solid var(--border)',
      boxShadow: task.pinned ? '0 0 0 2px var(--accent), var(--shadow)' : 'var(--shadow)',
      opacity: deleting ? 0.4 : 1, transition: 'all 0.2s',
      marginBottom: 8
    }}>
      {/* Checkbox */}
      <button onClick={() => onToggle(task.id, task.completed)}
        style={{
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
          border: task.completed ? 'none' : `2px solid ${pm.color}`,
          background: task.completed ? 'var(--green)' : 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s', animation: task.completed ? 'checkPop 0.3s ease' : 'none'
        }}>
        {task.completed && <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <input autoFocus value={editTitle} onChange={e => setEditTitle(e.target.value)}
            onBlur={saveEdit} onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false); }}
            style={{
              width: '100%', border: 'none', borderBottom: '1.5px solid var(--accent)',
              outline: 'none', fontSize: 14.5, fontWeight: 500, fontFamily: 'var(--sans)',
              color: 'var(--ink)', background: 'transparent', padding: '0 0 2px'
            }}
          />
        ) : (
          <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
            <span onDoubleClick={() => !task.completed && setEditing(true)} style={{
              fontSize: 14.5, fontWeight: 500, color: task.completed ? 'var(--ink3)' : 'var(--ink)',
              textDecoration: task.completed ? 'line-through' : 'none',
              cursor: task.completed ? 'default' : 'text', wordBreak: 'break-word'
            }}>{task.title}</span>
          </div>
        )}

        {task.description && (
          <p style={{ fontSize: 12.5, color: 'var(--ink3)', marginTop: 3, lineHeight: 1.5 }}>
            {task.description}
          </p>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 11, padding: '1px 8px', borderRadius: 20, fontWeight: 500,
            background: pm.bg, color: pm.color, border: `1px solid ${pm.color}33`
          }}>{pm.label}</span>

          {task.dueDate && (
            <span style={{
              fontSize: 11, color: overdue ? 'var(--accent)' : 'var(--ink3)',
              fontWeight: overdue ? 600 : 400,
              display: 'flex', alignItems: 'center', gap: 3
            }}>
              {overdue ? '⚠ ' : '◷ '}{formatDate(task.dueDate)}
              {overdue && ' overdue'}
            </span>
          )}

          {task.completedAt && (
            <span style={{ fontSize: 11, color: 'var(--green)' }}>
              ✓ {formatDate(task.completedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <button onClick={() => onPin(task.id, task.pinned)} title={task.pinned ? 'Unpin' : 'Pin'} style={{
          width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
          background: task.pinned ? 'var(--accent-bg)' : 'transparent',
          color: task.pinned ? 'var(--accent)' : 'var(--ink3)', fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>⊙</button>
        <button onClick={handleDelete} title="Delete" style={{
          width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
          background: 'transparent', color: 'var(--ink3)', fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.12s'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-bg)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink3)'; }}
        >✕</button>
      </div>
    </div>
  );
}
