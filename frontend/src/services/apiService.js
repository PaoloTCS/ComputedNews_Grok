import axios from 'axios';

// Use an environment variable for the base URL in production
const baseURL = process.env.REACT_APP_BACKEND_URL
  ? `${process.env.REACT_APP_BACKEND_URL}/api`
  : '/api';

// Create an axios instance with timeout
const api = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds timeout
});

/**
 * Fetch news topics at a specific level
 * @param {string|null} parentId - Parent news topic ID or null for root level
 * @returns {Promise<Object>} - News topics and semantic distances
 */
export const fetchDomains = async (parentId = null) => {
  try {
    const url = parentId 
      ? `/domains?parentId=${parentId}`
      : '/domains';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching news topics:', error);
    throw error;
  }
};

/**
 * Fetch a single news topic by ID
 * @param {string} domainId - News topic ID
 * @returns {Promise<Object>} - News topic data
 */
export const fetchDomain = async (domainId) => {
  try {
    const response = await api.get(`/domains/${domainId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news topic:', error);
    throw error;
  }
};

/**
 * Fetch the path to a news topic
 * @param {string} domainId - News topic ID
 * @returns {Promise<Array>} - Path to the news topic
 */
export const fetchDomainPath = async (domainId) => {
  try {
    const response = await api.get(`/domains/${domainId}/path`);
    return response.data.path;
  } catch (error) {
    console.error('Error fetching news topic path:', error);
    throw error;
  }
};

/**
 * Add a new news topic
 * @param {string} name - News topic name
 * @param {string|null} parentId - Parent news topic ID or null for root level
 * @param {string} description - News topic description
 * @returns {Promise<Object>} - New news topic data
 */
export const addDomain = async (name, parentId = null, description = '') => {
  try {
    const response = await api.post(`/domains`, {
      name,
      parentId,
      description
    });
    return response.data;
  } catch (error) {
    console.error('Error adding news topic:', error);
    throw error;
  }
};

/**
 * Update a news topic
 * @param {string} domainId - News topic ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} - Updated news topic data
 */
export const updateDomain = async (domainId, updates) => {
  try {
    const response = await api.put(`/domains/${domainId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating news topic:', error);
    throw error;
  }
};

/**
 * Delete a news topic
 * @param {string} domainId - News topic ID
 * @returns {Promise<Object>} - Success status
 */
export const deleteDomain = async (domainId) => {
  try {
    const response = await api.delete(`/domains/${domainId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting news topic:', error);
    throw error;
  }
};

/**
 * Update news topic positions
 * @param {Object} positions - Dictionary of domain_id -> {x, y}
 * @returns {Promise<Object>} - Success status
 */
export const updateDomainPositions = async (positions) => {
  try {
    const response = await api.post(`/domains/positions`, {
      positions
    });
    return response.data;
  } catch (error) {
    console.error('Error updating news topic positions:', error);
    throw error;
  }
};

/**
 * Fetch X posts for a news topic
 * @param {string} domainId - News topic ID
 * @returns {Promise<Object>} - X posts data
 */
export const fetchXPosts = async (domainId) => {
  try {
    const response = await api.get(`/domains/${domainId}/x-posts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching X posts:', error);
    throw error;
  }
};

/**
 * Summarize X posts for a news topic
 * @param {string} domainId - News topic ID
 * @param {Array} posts - List of X posts
 * @returns {Promise<Object>} - Summary data
 */
export const summarizeXPosts = async (domainId, posts) => {
  try {
    const response = await api.post(`/domains/${domainId}/x-posts/summarize`, { posts });
    return response.data;
  } catch (error) {
    console.error('Error summarizing X posts:', error);
    throw error;
  }
};
