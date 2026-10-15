import React from 'react';

const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' };
const STATUS_LABELS = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const handleStatusChange = (e) => {
    onStatusChange(task._id, e.target.value);
  };

  return (
    <article className={`task-card priority-${task.priority}`} aria-label={`Task: ${task.title}`}>
      <div className="task-card-header">
        <span className={`badge badge-priority priority-${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        {task.assignedTo && (
          <span className="badge badge-agent" title={`Assigned to ${task.assignedTo}`}>
            {task.assignedTo}
          </span>
        )}
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-card-footer">
        <select
          className={`status-select status-${task.status}`}
          value={task.status}
          onChange={handleStatusChange}
          aria-label="Change status"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <div className="task-actions">
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(task._id)}
            aria-label={`Delete ${task.title}`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
