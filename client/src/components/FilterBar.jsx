import React from 'react';

export default function FilterBar({ filters, onChange }) {
  return (
    <div className="filter-bar" role="search" aria-label="Filter tasks">
      <div className="filter-group">
        <label htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        >
          <option value="">All</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-priority">Priority</label>
        <select
          id="filter-priority"
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {(filters.status || filters.priority) && (
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onChange({ status: '', priority: '' })}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
