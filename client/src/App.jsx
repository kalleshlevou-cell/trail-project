import React, { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import KanbanBoard from './components/KanbanBoard';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';

export default function App() {
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks(filters);

  const handleCreate = async (data) => {
    await createTask(data);
    setShowForm(false);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleUpdate = async (data) => {
    await updateTask(editingTask._id, data);
    setShowForm(false);
    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateTask(id, { status });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="app-title">AI Team Task Manager</h1>
            <p className="app-subtitle">Coordinated by Concord MCP</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingTask(null); setShowForm(true); }}>
            + New Task
          </button>
        </div>
      </header>

      <main className="app-main">
        {showForm && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal">
              <TaskForm
                onSubmit={editingTask ? handleUpdate : handleCreate}
                onCancel={handleCancelForm}
                initialData={editingTask}
              />
            </div>
          </div>
        )}

        <FilterBar filters={filters} onChange={setFilters} />

        {loading && <p className="status-msg">Loading tasks…</p>}
        {error && (
          <p className="status-msg error" role="alert">
            Error: {error}
          </p>
        )}

        {!loading && !error && (
          <KanbanBoard
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>
    </div>
  );
}
