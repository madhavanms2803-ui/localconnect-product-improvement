import React, { useEffect, useMemo, useState } from 'react';
import PostCard from '../components/PostCard';
import { getPosts, createPost } from '../services/api';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchPosts = async () => {
    setError('');
    try {
      const { data } = await getPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setError('Could not load neighborhood updates. Check that the API is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return posts;

    return posts.filter((post) =>
      (post.content || '').toLowerCase().includes(query)
    );
  }, [posts, search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = content.trim();

    if (!trimmed) {
      setError('Write an update before posting.');
      return;
    }

    setSubmitting(true);
    setError('');
    setNotice('');

    try {
      await createPost(trimmed);
      setContent('');
      setNotice('Your neighborhood update has been shared.');
      await fetchPosts();
    } catch {
      setError('Your update could not be posted. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Neighborhood Feed</h1>
      <p className="card-description">
        Share local announcements, useful information, and community news.
      </p>

      <section className="card">
        <h2 className="card-title">Share an update</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="field-label" htmlFor="post-content">
              Your neighborhood update
            </label>
            <textarea
              id="post-content"
              className="input-field"
              placeholder="What would you like your neighbors to know?"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={3}
              maxLength={500}
              required
            />
            <p className="character-count">{content.length}/500</p>
          </div>
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Sharing…' : 'Share update'}
          </button>
        </form>
      </section>

      {error && <p className="inline-message error-message" role="alert">{error}</p>}
      {notice && <p className="inline-message success-message" role="status">{notice}</p>}

      <section className="feed-results">
        <h2 className="card-title">Community updates</h2>
        <label className="field-label" htmlFor="post-search">
          Search neighborhood updates
        </label>
        <input
          id="post-search"
          className="input-field"
          type="search"
          placeholder="Search announcements and posts…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <p className="muted-text">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'update' : 'updates'} found
        </p>

        {loading ? (
          <p className="empty-state">Loading neighborhood updates…</p>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="empty-state">
            <h3>{search ? 'No matching updates' : 'Be the first to share'}</h3>
            <p>
              {search
                ? 'Try another search term.'
                : 'Share a useful announcement to get the conversation started.'}
            </p>
            {search && (
              <button
                className="btn-secondary"
                type="button"
                onClick={() => setSearch('')}
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
