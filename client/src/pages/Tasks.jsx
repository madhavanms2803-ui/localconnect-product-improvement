import React from 'react';
import { Link } from 'react-router-dom';

export default function Tasks() {
  return (
    <div className="page">
      <h1 className="page-title">Community first</h1>
      <p className="page-intro">
        LocalConnect focuses on neighborhood updates and local issue
        reporting rather than workplace-style task management.
      </p>
      <p>
        Visit the <Link to="/feed">neighborhood feed</Link> or{' '}
        <Link to="/issues">report a local issue</Link>.
      </p>
    </div>
  );
}
