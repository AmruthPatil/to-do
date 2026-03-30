import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export function useTasks(filters = {}) {
  const [tasks, setTasks]   = useState([]);
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [td, sd] = await Promise.all([api.getTasks(filters), api.getStats()]);
      setTasks(td.tasks);
      setStats(sd);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [JSON.stringify(filters)]);

  useEffect(() => { load(); }, [load]);

  const createTask = async (body) => {
    const { task } = await api.createTask(body);
    await load();
    return task;
  };

  const updateTask = async (id, body) => {
    const { task } = await api.updateTask(id, body);
    setTasks(prev => prev.map(t => t.id === id ? task : t));
    api.getStats().then(setStats);
    return task;
  };

  const deleteTask = async (id) => {
    await api.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
    api.getStats().then(setStats);
  };

  const clearCompleted = async () => {
    await api.clearCompleted();
    await load();
  };

  const toggleComplete = (id, completed) => updateTask(id, { completed: !completed });
  const togglePin      = (id, pinned)    => updateTask(id, { pinned: !pinned });

  return { tasks, stats, loading, error, reload: load, createTask, updateTask, deleteTask, clearCompleted, toggleComplete, togglePin };
}
