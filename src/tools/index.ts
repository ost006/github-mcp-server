import { contextTools } from './context.js';
import { reposTools } from './repos.js';
import { issuesTools } from './issues.js';
import { pullRequestsTools } from './pull-requests.js';
import { usersTools } from './users.js';

export const toolsByToolset = {
  context: contextTools,
  repos: reposTools,
  issues: issuesTools,
  pull_requests: pullRequestsTools,
  users: usersTools
};

export type ToolConfig = {
  description: string;
  inputSchema: any;
  handler: (clients: any, args: any) => Promise<any>;
};
