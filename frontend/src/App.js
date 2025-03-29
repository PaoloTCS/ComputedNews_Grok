import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDomains, setCurrentDomainId, addDomain, deleteDomain } from './store/domainSlice';
import { fetchXPosts } from './store/xpostSlice';
import BreadcrumbNav from './components/BreadcrumbNav';
import DomainForm from './components/DomainForm';
import VoronoiDiagram from './components/VoronoiDiagram';
import XPosts from './components/XPosts';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/App.css';

const App = () => {
  const dispatch = useDispatch();
  const { domains, semanticDistances, currentDomainId, path, loading, error } = useSelector((state) => state.domains);
  const { posts, loading: xpostLoading, error: xpostError } = useSelector((state) => state.xposts);

  useEffect(() => {
    dispatch(fetchDomains({ parentId: currentDomainId }));
  }, [dispatch, currentDomainId]);

  useEffect(() => {
    if (currentDomainId) {
      dispatch(fetchXPosts(currentDomainId));
    }
  }, [dispatch, currentDomainId]);

  const handleAddDomain = (name, description) => {
    dispatch(addDomain({ name, parentId: currentDomainId, description }));
  };

  const handleDomainClick = (domain) => {
    dispatch(setCurrentDomainId(domain.id));
  };

  const handleDeleteDomain = (domainId) => {
    dispatch(deleteDomain(domainId));
  };

  const handleBreadcrumbClick = (domainId) => {
    dispatch(setCurrentDomainId(domainId));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">ComputedNews_Grok</h1>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {currentDomainId && (
            <BreadcrumbNav
              path={path}
              onNavigate={handleBreadcrumbClick}
            />
          )}
          {error && <div className="error-message">{error}</div>}
          <DomainForm onAdd={handleAddDomain} />
          {loading ? (
            <div className="loading-indicator">Loading news topics...</div>
          ) : domains.length === 0 ? (
            <div className="empty-diagram">
              <p>No news topics found. Add a new topic to get started!</p>
            </div>
          ) : (
            <ErrorBoundary
              fallback={<div className="error-message">Error rendering diagram. Please try again.</div>}
            >
              <VoronoiDiagram
                domains={domains}
                semanticDistances={semanticDistances}
                width={800}
                height={600}
                onDomainClick={handleDomainClick}
                onDeleteDomain={handleDeleteDomain}
              />
            </ErrorBoundary>
          )}
          {currentDomainId && (
            <XPosts
              domainId={currentDomainId}
              posts={posts}
              loading={xpostLoading}
              error={xpostError}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
