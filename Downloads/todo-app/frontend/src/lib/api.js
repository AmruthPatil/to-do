const BASE = '/api';

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  getTasks:        (params = {}) => req('/tasks?' + new URLSearchParams(params)),
  createTask:      (body)        => req('/tasks', { method: 'POST', body }),
  updateTask:      (id, body)    => req(`/tasks/${id}`, { method: 'PATCH', body }),
  deleteTask:      (id)          => req(`/tasks/${id}`, { method: 'DELETE' }),
  clearCompleted:  ()            => req('/tasks/completed/all', { method: 'DELETE' }),
  getStats:        ()            => req('/stats'),
};
