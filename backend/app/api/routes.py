cat <<EOL > backend/app/api/routes.py
"""
app/api/routes.py
API routes for the ComputedNews_Grok application using MCP.
"""

import os
from flask import Blueprint, jsonify, request, current_app
from app.core.domain_model import DomainStore
from app.core.semantic_processor import SemanticProcessor
# Placeholder for MCP client (replace with actual import when available)
from mcp_sdk import MCPClient

# Create blueprint
api_bp = Blueprint('api', __name__)

# Setup domain store and MCP client
domain_store = None
semantic_processor = None
mcp_client = None

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

def get_mcp_client():
    """Get or initialize MCP client."""
    global mcp_client
    if mcp_client is None:
        mcp_port = os.getenv('MCP_SERVER_PORT', '8080')
        mcp_client = MCPClient(host="localhost", port=int(mcp_port))
    return mcp_client

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