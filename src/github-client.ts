import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';
import type { GitHubClients, ServerConfig } from './types.js';

export function createGitHubClients(config: ServerConfig): GitHubClients {
  const baseUrl = getBaseUrl(config.host);

  const rest = new Octokit({
    auth: config.token,
    baseUrl: baseUrl.rest,
    userAgent: `github-mcp-server-ts/${config.version}`
  });

  const graphqlWithAuth = graphql.defaults({
    baseUrl: baseUrl.graphql,
    headers: {
      authorization: `token ${config.token}`,
      'user-agent': `github-mcp-server-ts/${config.version}`
    }
  });

  return {
    rest,
    graphql: graphqlWithAuth
  };
}

function getBaseUrl(host?: string): { rest: string; graphql: string } {
  if (!host || host === 'github.com') {
    return {
      rest: 'https://api.github.com',
      graphql: 'https://api.github.com/graphql'
    };
  }

  // Handle GitHub Enterprise Server
  if (host.startsWith('http://') || host.startsWith('https://')) {
    const url = new URL(host);
    if (url.hostname.endsWith('.ghe.com')) {
      // GitHub Enterprise Cloud with data residency
      return {
        rest: `https://api.${url.hostname}`,
        graphql: `https://api.${url.hostname}/graphql`
      };
    }
    // GitHub Enterprise Server
    return {
      rest: `${url.protocol}//${url.hostname}/api/v3`,
      graphql: `${url.protocol}//${url.hostname}/api/graphql`
    };
  }

  return {
    rest: 'https://api.github.com',
    graphql: 'https://api.github.com/graphql'
  };
}
