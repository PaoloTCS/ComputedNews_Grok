"""
app/api/routes.py
API routes for the ComputedNews_Grok application using MCP.
"""

import os
from flask import Blueprint, jsonify, request, current_app
from app.core.domain_model import DomainStore
from app.core.semantic_processor import SemanticProcessor
# Comment out MCP client import
# from mcp_sdk import MCPClient

# Create blueprint
api_bp = Blueprint('api', __name__)

# Setup domain store and MCP client
domain_store = None
semantic_processor = None
# mcp_client = None  # Comment out MCP client

def get_domain_store():
    """Get or initialize domain store."""
    global domain_store
    if domain_store is None:
        storage_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'data')
        os.makedirs(storage_dir, exist_ok=True)
        domain_store = DomainStore(storage_dir)
    return domain_store

def get_semantic_processor():
    """Get or initialize semantic processor."""
    global semantic_processor
    if semantic_processor is None:
        semantic_processor = SemanticProcessor(current_app.config['UPLOAD_FOLDER'])
    return semantic_processor

# Comment out MCP client function
"""
def get_mcp_client():
    global mcp_client
    if mcp_client is None:
        mcp_port = os.getenv('MCP_SERVER_PORT', '8080')
        mcp_client = MCPClient(host="localhost", port=int(mcp_port))
    return mcp_client
"""

@api_bp.route('/domains', methods=['GET'])
def get_domains():
    """Get news topics at a specific level."""
    try:
        parent_id = request.args.get('parentId')
        
        # Get domains (news topics)
        domain_store = get_domain_store()
        domains = domain_store.get_domains(parent_id)
        
        # Compute semantic distances if needed
        if domains and len(domains) > 1:
            semantic_processor = get_semantic_processor()
            distances = semantic_processor.compute_distances(domains)
            
            # Format distances for output
            formatted_distances = {
                f"{k[0]}|{k[1]}": v for k, v in distances.items()
            }
            
            return jsonify({
                "domains": domains,
                "distances": formatted_distances
            })
        
        return jsonify({
            "domains": domains,
            "distances": {}
        })
    except Exception as e:
        current_app.logger.error(f"Error getting domains: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Add endpoint for updating domain positions
@api_bp.route('/domains/positions', methods=['POST', 'OPTIONS'])
def update_domain_positions():
    """Update positions of news topics."""
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        positions = request.json.get('positions', {})
        if not positions:
            return jsonify({"error": "No positions provided"}), 400
            
        # In a real implementation, we would save these positions
        # For our mock implementation, just acknowledge the update
        current_app.logger.info(f"Received positions update for {len(positions)} domains")
        
        return jsonify({
            "success": True,
            "message": f"Updated positions for {len(positions)} domains"
        })
    except Exception as e:
        current_app.logger.error(f"Error updating domain positions: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Add mock implementation for X posts endpoint
@api_bp.route('/domains/<domain_id>/x-posts', methods=['GET'])
def get_x_posts(domain_id):
    """Get mock X posts for a domain."""
    try:
        domain_store = get_domain_store()
        domain = domain_store.get_domain(domain_id)
        
        if not domain:
            return jsonify({"error": "Domain not found"}), 404
            
        # Generate mock X posts based on the domain name
        mock_posts = [
            {
                "id": f"{domain_id}_1",
                "text": f"This is a mock X post about {domain['name']}. #news",
                "author": {"username": "mock_user1", "name": "Mock User"},
                "created_at": "2023-03-21T12:34:56Z"
            },
            {
                "id": f"{domain_id}_2",
                "text": f"Breaking news on {domain['name']}! Check out this important update. #trending",
                "author": {"username": "news_account", "name": "News Update"},
                "created_at": "2023-03-21T10:22:33Z"
            },
            {
                "id": f"{domain_id}_3",
                "text": f"Interesting development in {domain['name']} topic. What do you think? #discussion",
                "author": {"username": "tech_insider", "name": "Tech Insider"},
                "created_at": "2023-03-21T09:11:22Z"
            }
        ]
        
        return jsonify({"posts": mock_posts})
    except Exception as e:
        current_app.logger.error(f"Error getting X posts: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Add mock implementation for summarization endpoint
@api_bp.route('/domains/<domain_id>/x-posts/summarize', methods=['POST'])
def summarize_posts(domain_id):
    """Get mock summary for X posts in a domain."""
    try:
        domain_store = get_domain_store()
        domain = domain_store.get_domain(domain_id)
        
        if not domain:
            return jsonify({"error": "Domain not found"}), 404
            
        # Generate mock summary based on the domain name
        mock_summary = f"Summary of recent posts about {domain['name']}: There have been several discussions about key developments in this topic. Experts are noting significant trends and potential future implications. Users are showing increased engagement with content related to {domain['name']}."
        
        return jsonify({
            "summary": mock_summary,
            "domain_id": domain_id,
            "domain_name": domain['name']
        })
    except Exception as e:
        current_app.logger.error(f"Error generating summary: {str(e)}")
        return jsonify({"error": str(e)}), 500

@api_bp.route('/domains/<domain_id>/path', methods=['GET'])
def get_domain_path(domain_id):
    """Get the path (ancestors) for a domain."""
    try:
        domain_store = get_domain_store()
        
        # Use the existing method that's already in the DomainStore class
        path = domain_store.get_domain_path(domain_id)
        
        if not path:
            # If no path was found, the domain might not exist
            if not domain_store.get_domain(domain_id):
                return jsonify({"error": "Domain not found"}), 404
        
        return jsonify({"path": path})
    except Exception as e:
        current_app.logger.error(f"Error getting domain path: {str(e)}")
        return jsonify({"error": str(e)}), 500