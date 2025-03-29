"""
run.py
Entry point for the ComputedNews_Grok application.
"""

import os
import sys
import logging
import requests
from app import create_app
from dotenv import load_dotenv

# Load .env file from the root directory
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Configure basic logging with timestamp
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def get_port():
    """Get and validate port number from environment."""
    try:
        port = int(os.getenv('PORT', 5001))
        if not (1024 <= port <= 65535):
            logger.warning(f"Port {port} out of range, using default 5001")
            return 5001
        return port
    except ValueError:
        logger.error("Invalid PORT environment variable")
        return 5001

def get_environment():
    """Get and validate environment configuration."""
    env = os.getenv('FLASK_ENV', 'development')
    valid_environments = ['development', 'testing', 'production']
    if env not in valid_environments:
        logger.warning(f"Invalid environment '{env}' specified, defaulting to development")
        return 'development'
    return env

def check_prerequisites():
    """Check if all prerequisites are met to run the application."""
    if not os.getenv('X_BEARER_TOKEN'):
        logger.warning("X_BEARER_TOKEN not found in environment variables. "
                      "Using mock X post data instead.")
    
    # Comment out MCP server check as we're using mock data
    """
    # Check if MCP server is running
    mcp_port = os.getenv('MCP_SERVER_PORT', '8080')
    try:
        response = requests.get(f"http://localhost:{mcp_port}/status")
        if response.status_code != 200:
            logger.warning("MCP server not running or not responding on port {mcp_port}.")
    except requests.ConnectionError:
        logger.warning(f"MCP server not running on port {mcp_port}. Start the MCP server to enable X post fetching.")
    """
    logger.info("Skipping MCP server check as we're using mock data.")

if __name__ == '__main__':
    try:
        check_prerequisites()
        env = get_environment()
        port = get_port()
        
        # Create and configure the application instance
        app = create_app(env)
        app.run(host='0.0.0.0', port=port, debug=(env == 'development'))
        
    except Exception as e:
        logger.error(f"Failed to start application: {str(e)}")
        sys.exit(1)
