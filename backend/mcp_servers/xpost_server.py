"""
xpost_server.py
MCP server for fetching X posts in ComputedNews_Grok.
"""

import os
import logging
from dotenv import load_dotenv
import requests
# Placeholder for MCP SDK import (replace with actual import when available)
from mcp_sdk import MCPServer, Resource, Tool

# Load .env file from the root directory
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
X_BEARER_TOKEN = os.getenv("X_BEARER_TOKEN")
MCP_SERVER_PORT = os.getenv("MCP_SERVER_PORT", "8080")

class XPostServer(MCPServer):
    """MCP server for fetching X posts."""
    
    def __init__(self):
        super().__init__(port=int(MCP_SERVER_PORT))
        if not X_BEARER_TOKEN:
            logger.error("X_BEARER_TOKEN not set in environment variables.")
            raise ValueError("X_BEARER_TOKEN is required.")
    
    def setup(self):
        """Set up resources and tools for the MCP server."""
        # Define a resource for X post queries
        self.register_resource(Resource(
            name="xpost_query",
            description="Query string for fetching X posts based on a news topic."
        ))
        
        # Define a tool to fetch X posts
        self.register_tool(Tool(
            name="fetch_x_posts",
            description="Fetch recent X posts for a given query.",
            parameters={
                "query": {"type": "string", "description": "The search query (news topic name)."}
            },
            handler=self.fetch_x_posts_handler
        ))
    
    def fetch_x_posts_handler(self, parameters):
        """Handler to fetch X posts using the X API."""
        query = parameters.get("query")
        if not query:
            return {"error": "Query parameter is required."}
        
        try:
            headers = {
                "Authorization": f"Bearer {X_BEARER_TOKEN}"
            }
            params = {
                "query": query,
                "max_results": 10
            }
            response = requests.get(
                "https://api.x.com/2/tweets/search/recent",
                headers=headers,
                params=params
            )
            if response.status_code == 200:
                posts = response.json().get('data', [])
                return {"posts": posts}
            else:
                return {"error": f"Failed to fetch X posts: {response.status_code}"}
        except Exception as e:
            logger.error(f"Error fetching X posts: {str(e)}")
            return {"error": str(e)}

if __name__ == "__main__":
    logger.info("Starting X Post MCP Server...")
    server = XPostServer()
    server.start()
