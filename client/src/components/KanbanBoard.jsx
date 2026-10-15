import React from 'react';
import TaskCard from './TaskCard';

const COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

export default function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange }) {
  const tasksByStatus = COLUMNS.reduce((acc, col) => {
    acc[col.key] = tasks.filter((t) => t.status === col.key);
    return acc;
  }, {});

  return (
    <div className="kanban-board" role="region" aria-label="Task board">
      {COLUMNS.map((col) => (
        <section key={col.key} className={`kanban-column column-${col.key}`} aria-label={col.label}>
          <div className="column-header">
            <h2 className="column-title">{col.label}</h2>
            <span className="column-count">{tasksByStatus[col.key].length}</span>
          </div>
          <div className="column-tasks">
            {tasksByStatus[col.key].length === 0 ? (
              <p className="empty-column">No tasks here</p>
            ) : (
              tasksByStatus[col.key].map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
