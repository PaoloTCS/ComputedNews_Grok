# ComputedNews_Grok

A news aggregation and visualization system that organizes news topics using recursive tessellation and Voronoi diagrams, fetches X posts via Anthropic's Model Context Protocol (MCP), and prepares for AI-powered summarization with Grok.

## Features

- Create hierarchical news topics (e.g., "news/tech/ai") with semantic relationships
- Fetch and display X posts for each news topic using MCP
- Visualize news topics using Voronoi diagrams
- (Future) Summarize X posts using Grok by xAI via MCP
- Modular architecture with MCP for standardized data and tool integration

## Technology Stack

- **Frontend**: React.js with D3.js for visualizations, Redux for state management
- **Backend**: Flask REST API with MCP integration
- **AI/ML**: Sentence Transformers for semantic processing, MCP for X post fetching, preparing for Grok integration

## Getting Started

### Prerequisites

- Python 3.11.8
- Node.js 16+
- X API Bearer Token
- Anthropic MCP Python SDK

### Installation

1. Clone the repository
   ```
   git clone https://github.com/PaoloTCS/ComputedNews_Grok.git
   cd ComputedNews_Grok
   ```

2. Set up the backend
   ```
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. Configure environment variables
   Create a `.env` file in the root directory with:
   ```
   X_BEARER_TOKEN=your_x_bearer_token
   SECRET_KEY=your_secret_key
   FLASK_ENV=development
   MCP_SERVER_PORT=8080
   ```

4. Install frontend dependencies
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the MCP server for X posts  comes LATER
   ```
   cd backend/mcp_servers
   python xpost_server.py
   ```

2. Start the backend server
   ```
   cd backend
   python run.py
   ```

3. Start the frontend application
   ```
   cd frontend
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Create your first news topic (e.g., "Tech")
2. Navigate through the Voronoi diagram to explore subtopics
3. View X posts related to each topic (fetched via MCP)
4. (Future) Summarize X posts with Grok

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- xAI for Grok (future integration)
- Anthropic for the Model Context Protocol (MCP)
- D3.js for visualization capabilities 


#### NEW INSTRUCTIONS ####


Step 5: Test the Application
Test the application to ensure everything works as expected:
Start the MCP Servers:
bash

cd backend/mcp_servers
python xpost_server.py

In a new terminal:
bash

cd backend/mcp_servers
python summarize_server.py

Start the Backend:
bash

cd backend
python run.py

Start the Frontend:
bash

cd frontend
npm start

Test the App:
Open http://localhost:3000.

Add a news topic (e.g., “Tech”).

Click on the topic to view subtopics and X posts (fetched via MCP).

Test the summarize button (should show a mock summary via MCP).

Note: The MCP servers (xpost_server.py, summarize_server.py) will fail to run because the mcp-sdk package is a placeholder. You’ll need to either:
Implement a fallback (e.g., direct X API calls in xpost_server.py and a mock summarization in summarize_server.py).

Skip the MCP-related functionality for now and test the rest of the app (e.g., adding news topics, viewing the Voronoi diagram).


