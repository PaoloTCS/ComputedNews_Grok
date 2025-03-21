import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { summarizeXPosts } from '../store/summarizeSlice';
import '../styles/XPosts.css';

const XPosts = ({ domainId, posts, loading, error }) => {
  const dispatch = useDispatch();
  const { summary, loading: loadingSummary, error: errorSummary } = useSelector((state) => state.summaries);

  const handleSummarize = () => {
    dispatch(summarizeXPosts({ domainId, posts }));
  };

  return (
    <div className="x-posts-container">
      <h3>X Posts</h3>
      {loading && <p>Loading X posts...</p>}
      {error && <p className="error-message">{error}</p>}
      {posts.length > 0 ? (
        <>
          <button
            onClick={handleSummarize}
            disabled={loadingSummary}
            className="summarize-button"
          >
            {loadingSummary ? 'Summarizing...' : 'Summarize Posts'}
          </button>
          {errorSummary && <p className="error-message">{errorSummary}</p>}
          {summary && (
            <div className="summary">
              <h4>Summary</h4>
              <p>{summary}</p>
            </div>
          )}
          <ul className="x-posts-list">
            {posts.map((post) => (
              <li key={post.id} className="x-post-item">
                {post.text}
              </li>
            ))}
          </ul>
        </>
      ) : (
        !loading && <p>No X posts found for this news topic.</p>
      )}
    </div>
  );
};

export default XPosts;