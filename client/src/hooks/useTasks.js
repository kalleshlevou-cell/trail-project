import { useState, useEffect, useCallback } from 'react';

const API_BASE = '/api/tasks';

export function useTasks(filters = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildQuery = (f) => {
    const params = new URLSearchParams();
    if (f.status) params.set('status', f.status);
    if (f.priority) params.set('priority', f.priority);
    return params.toString() ? `?${params.toString()}` : '';
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}${buildQuery(filters)}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.priority]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData) => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create task');
    await fetchTasks();
    return data;
  };

  const updateTask = async (id, taskData) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update task');
    await fetchTasks();
    return data;
  };

  const deleteTask = async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete task');
    await fetchTasks();
  };

  return { tasks, loading, error, createTask, updateTask, deleteTask, refetch: fetchTasks };
}
