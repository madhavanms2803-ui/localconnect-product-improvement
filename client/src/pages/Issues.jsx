import React, { useEffect, useMemo, useState } from 'react';
import IssueCard from '../components/IssueCard';
import { getIssues, createIssue, updateIssue } from '../services/api';

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchIssues = async () => {
    setError('');
    try {
      const { data } = await getIssues();
      setIssues(Array.isArray(data) ? data : []);
    } catch {
      setError('Could not load local issues. Check that the API is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const filteredIssues = useMemo(() => {
    const query = search.trim().toLowerCase();

    return issues.filter((issue) => {
      const matchesSearch = !query ||
        `${issue.title || ''} ${issue.description || ''}`
          .toLowerCase()
          .includes(query);

      const matchesStatus = statusFilter === 'ALL' ||
        issue.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [issues, search, statusFilter]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedDescription) {
      setError('Add both a title and description for the issue.');
      return;
    }

    setSubmitting(true);
    setError('');
    setNotice('');

    try {
      await createIssue(trimmedTitle, trimmedDescription);
      setTitle('');
      setDescription('');
      setSearch('');
      setStatusFilter('ALL');
      setNotice('Your local issue has been reported.');
      await fetchIssues();
    } catch {
      setError('Your issue could not be submitted. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setError('');
    setNotice('');

    try {
      await updateIssue(id, status);
      setIssues((current) => current.map((issue) =>
        issue.id === id ? { ...issue, status } : issue
      ));
      setNotice('Issue status updated.');
    } catch {
      setError('The issue status could not be updated. Please try again.');
    }
  };

  const openCount = issues.filter((issue) => issue.status === 'OPEN').length;
  const progressCount = issues.filter((issue) => issue.status === 'IN_PROGRESS').length;
  const resolvedCount = issues.filter((issue) => issue.status === 'RESOLVED').length;

  return (
    <div>
      <h1 className="page-title">Local Issues</h1>
      <p className="card-description">
        Report neighborhood problems and follow their progress.
      </p>

      <div className="issue-summary">
        <div className="metric-card">
          <span className="metric-value">{openCount}</span>
          <span className="metric-label">Open</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{progressCount}</span>
          <span className="metric-label">In progress</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{resolvedCount}</span>
          <span className="metric-label">Resolved</span>
        </div>
      </div>

      <section className="card">
        <h2 className="card-title">Report a neighborhood issue</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="field-label" htmlFor="issue-title">Issue title</label>
            <input
              id="issue-title"
              className="input-field"
              placeholder="e.g. Streetlight not working"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              required
            />
          </div>
          <div className="form-group">
            <label className="field-label" htmlFor="issue-description">
              Description
            </label>
            <textarea
              id="issue-description"
              className="input-field"
              placeholder="Describe the location and what needs attention…"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={1000}
              required
            />
            <p className="character-count">{description.length}/1000</p>
          </div>
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Report issue'}
          </button>
        </form>
      </section>

      {error && <p className="inline-message error-message" role="alert">{error}</p>}
      {notice && <p className="inline-message success-message" role="status">{notice}</p>}

      <section className="feed-results">
        <h2 className="card-title">Reported issues</h2>
        <div className="issue-filters">
          <div>
            <label className="field-label" htmlFor="issue-search">
              Search issues
            </label>
            <input
              id="issue-search"
              className="input-field"
              type="search"
              placeholder="Search title or description…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="issue-status">
              Filter by status
            </label>
            <select
              id="issue-status"
              className="input-field"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        <p className="muted-text">
          Showing {filteredIssues.length} of {issues.length} issues
        </p>

        {loading ? (
          <p className="empty-state">Loading reported issues…</p>
        ) : filteredIssues.length > 0 ? (
          <div className="grid">
            {filteredIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>{search || statusFilter !== 'ALL' ? 'No matching issues' : 'No issues reported yet'}</h3>
            <p>
              {search || statusFilter !== 'ALL'
                ? 'Try another search or status filter.'
                : 'Report a local problem that needs attention.'}
            </p>
            {(search || statusFilter !== 'ALL') && (
              <button
                className="btn-secondary"
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('ALL');
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
