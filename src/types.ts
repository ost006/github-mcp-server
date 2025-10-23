import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';

export interface ServerConfig {
  version: string;
  host?: string;
  token: string;
  enabledToolsets?: string[];
  readOnly?: boolean;
}

export interface GitHubClients {
  rest: Octokit;
  graphql: typeof graphql;
}

export const DEFAULT_TOOLSETS = ['context', 'repos', 'issues', 'pull_requests', 'users'];

export const AVAILABLE_TOOLSETS = [
  'context',
  'repos',
  'issues',
  'pull_requests',
  'actions',
  'code_security',
  'dependabot',
  'discussions',
  'gists',
  'labels',
  'notifications',
  'orgs',
  'projects',
  'secret_protection',
  'security_advisories',
  'stargazers',
  'users'
];
