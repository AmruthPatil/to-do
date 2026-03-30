import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import StatsBar from './components/StatsBar';
import './styles/global.css';

const FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'active',    label: 'Active' },
  { id: 'completed', label: 'Done' },
];

const PRIORITIES = [
  { id: 'all',    label: 'All priorities' },
  { id: 'high',   label: '🔴 High' },
  { id: 'medium', label: '🟡 Medium' },
  { id: 'low',    label: '🔵 Low' },
];

export default function App() {
  const [status,   setStatus]   = useState('all');
  const [priority, setPriority] = useState('all');
  const [search,   setSearch]   = useState('');

  const filters = {};
  if (status   !== 'all') filters.status   = status;
  if (priority !== 'all') filters.priority = priority;

  const { tasks, stats, loading, error, createTask, updateTask, deleteTask, clearCompleted, toggleComplete, togglePin } = useTasks(filters);

  const displayed = search
    ? tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()))
    : tasks;

  return (
    <div style={{ minHeight: '100vh', padding: '0 0 60px' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)', background: 'rgba(245,240,232,0.95)',
        backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 10,
        padding: '0 24px'
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 56 }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontStyle: 'italic', color: 'var(--ink)', letterSpacing: '-0.5px' }}>
            Taskr
          </h1>
          <div style={{ flex: 1 }} />
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink3)', fontSize: 14 }}>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks…"
              style={{
                padding: '6px 10px 6px 28px', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)',
                background: 'white', color: 'var(--ink)', fontSize: 13, fontFamily: 'var(--sans)',
                outline: 'none', width: 180
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border2)'}
            />
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '28px 24px' }}>
        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Filter row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {/* Status filters */}
          <div style={{ display: 'flex', background: 'var(--paper2)', borderRadius: 'var(--radius-sm)', padding: 3, gap: 2 }}>
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setStatus(f.id)} style={{
                padding: '4px 14px', borderRadius: 5, border: 'none', fontSize: 13,
                fontFamily: 'var(--sans)', cursor: 'pointer', transition: 'all 0.15s', fontWeight: status === f.id ? 500 : 400,
                background: status === f.id ? 'white' : 'transparent',
                color: status === f.id ? 'var(--ink)' : 'var(--ink3)',
                boxShadow: status === f.id ? 'var(--shadow)' : 'none'
              }}>{f.label}</button>
            ))}
          </div>

          {/* Priority filter */}
          <select value={priority} onChange={e => setPriority(e.target.value)} style={{
            padding: '6px 10px', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)',
            background: 'white', color: 'var(--ink2)', fontSize: 12.5, fontFamily: 'var(--sans)',
            outline: 'none', cursor: 'pointer'
          }}>
            {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>

          {/* Clear completed */}
          {stats?.completed > 0 && (
            <button onClick={clearCompleted} style={{
              marginLeft: 'auto', padding: '5px 12px', border: '1px solid var(--border2)',
              borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--ink3)',
              fontSize: 12, cursor: 'pointer', fontFamily: 'var(--sans)'
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink3)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
            >Clear {stats.completed} done</button>
          )}
        </div>

        {/* Add task form */}
        <div style={{ marginBottom: 16 }}>
          <TaskForm onAdd={createTask} />
        </div>

        {/* Task list */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink3)', fontSize: 14 }}>
            Loading…
          </div>
        )}

        {error && (
          <div style={{
            padding: '12px 16px', background: 'var(--accent-bg)', border: '1px solid var(--accent)',
            borderRadius: 'var(--radius)', color: 'var(--accent)', fontSize: 13, marginBottom: 12
          }}>
            ⚠ Backend not running. Start it with: <code style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>cd backend && npm run dev</code>
          </div>
        )}

        {!loading && !error && displayed.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12, fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink3)' }}>
              {search ? '?' : status === 'completed' ? '✓' : '○'}
            </div>
            <p style={{ color: 'var(--ink3)', fontSize: 14 }}>
              {search ? `No tasks matching "${search}"` : status === 'completed' ? 'No completed tasks yet' : 'No tasks yet — add one above!'}
            </p>
          </div>
        )}

        <div>
          {displayed.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleComplete}
              onPin={togglePin}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          ))}
        </div>

        {/* Footer count */}
        {displayed.length > 0 && (
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink3)', marginTop: 20 }}>
            {displayed.length} task{displayed.length !== 1 ? 's' : ''}
            {search && ` matching "${search}"`}
          </p>
        )}
      </main>
    </div>
  );
}
