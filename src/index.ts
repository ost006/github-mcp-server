#!/usr/bin/env node

import { config as dotenvConfig } from 'dotenv';
import { GitHubMCPServer } from './server.js';
import type { ServerConfig } from './types.js';

// Load environment variables from .env file
dotenvConfig();

const version = '0.1.0';

function getConfig(): ServerConfig {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('Error: GitHub token not found. Please set GITHUB_PERSONAL_ACCESS_TOKEN or GITHUB_TOKEN environment variable.');
    process.exit(1);
  }

  const host = process.env.GITHUB_HOST;
  const toolsets = process.env.GITHUB_TOOLSETS?.split(',').map(t => t.trim());
  const readOnly = process.env.GITHUB_READ_ONLY === '1' || process.env.GITHUB_READ_ONLY === 'true';
  const transport = (process.env.MCP_TRANSPORT as 'stdio' | 'sse') || 'stdio';
  const port = process.env.MCP_PORT ? parseInt(process.env.MCP_PORT, 10) : 3000;

  return {
    version,
    token,
    host,
    enabledToolsets: toolsets,
    readOnly,
    transport,
    port
  };
}

async function main() {
  try {
    const config = getConfig();
    const server = new GitHubMCPServer(config);
    await server.run();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
