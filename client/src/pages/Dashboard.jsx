import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMetrics } from '../services/api';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ totalPosts: 0, totalIssues: 0 });

  useEffect(() => {
    let active = true;
    getMetrics()
      .then(({ data }) => {
        if (active) {
          setMetrics({
            totalPosts: data.totalPosts ?? 0,
            totalIssues: data.totalIssues ?? 0,
          });
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <div>
      <section className="hero-section">
        <h1 className="page-title">A better neighborhood starts together.</h1>
        <p className="card-description">
          Share local updates, keep neighbors informed, and help solve
          the problems that matter in your community.
        </p>
        <p>
          <Link to="/feed" className="btn-primary">Explore neighborhood feed</Link>
          {' '}
          <Link to="/issues" className="btn-primary">Report a local issue</Link>
        </p>
      </section>

      <section className="card">
        <h2 className="card-title">Your community at a glance</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-value">{metrics.totalPosts}</span>
            <span className="metric-label">Neighborhood updates</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">{metrics.totalIssues}</span>
            <span className="metric-label">Issues reported</span>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Small updates. Real community impact.</h2>
        <p className="card-description">
          Share an announcement, let neighbors know about a local event,
          or report a broken streetlight. Useful information helps everyone.
        </p>
      </section>
    </div>
  );
}
