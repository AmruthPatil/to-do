export default function StatsBar({ stats }) {
  if (!stats) return null;
  const pct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Progress bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--ink3)' }}>
          {stats.completed} of {stats.total} done
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: pct === 100 ? 'var(--green)' : 'var(--ink2)' }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: 5, background: 'var(--paper3)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 10,
          background: pct === 100 ? 'var(--green)' : 'var(--accent)',
          width: `${pct}%`, transition: 'width 0.4s ease'
        }} />
      </div>

      {/* Stat pills */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {[
          { label: 'Pending',  val: stats.pending,             color: 'var(--ink2)',   bg: 'var(--paper2)' },
          { label: 'Overdue',  val: stats.overdue,             color: stats.overdue ? 'var(--accent)' : 'var(--ink3)', bg: stats.overdue ? 'var(--accent-bg)' : 'var(--paper2)' },
          { label: '🔴 High',  val: stats.byPriority?.high,    color: '#c84b2f',       bg: 'rgba(200,75,47,0.08)' },
          { label: '🟡 Medium',val: stats.byPriority?.medium,  color: '#c47c1a',       bg: 'rgba(196,124,26,0.08)' },
          { label: '🔵 Low',   val: stats.byPriority?.low,     color: '#2855a0',       bg: 'rgba(40,85,160,0.08)' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 500,
            background: s.bg, color: s.color, display: 'flex', gap: 5, alignItems: 'center'
          }}>
            {s.label} <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
