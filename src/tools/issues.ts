import { z } from 'zod';
import type { GitHubClients } from '../types.js';

export const issuesTools = {
  list_issues: {
    description: 'List issues in a repository',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      state: z.enum(['open', 'closed', 'all']).optional().describe('Filter by state'),
      labels: z.array(z.string()).optional().describe('Filter by labels'),
      page: z.number().min(1).optional().describe('Page number for pagination'),
      perPage: z.number().min(1).max(100).optional().describe('Results per page')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; state?: 'open' | 'closed' | 'all'; labels?: string[]; page?: number; perPage?: number }) => {
      const { data } = await clients.rest.issues.listForRepo({
        owner: args.owner,
        repo: args.repo,
        state: args.state,
        labels: args.labels?.join(','),
        page: args.page,
        per_page: args.perPage
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(data, null, 2)
          }
        ]
      };
    }
  },

  get_issue: {
    description: 'Get issue details',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      issue_number: z.number().describe('Issue number')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; issue_number: number }) => {
      const { data } = await clients.rest.issues.get({
        owner: args.owner,
        repo: args.repo,
        issue_number: args.issue_number
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(data, null, 2)
          }
        ]
      };
    }
  },

  create_issue: {
    description: 'Create a new issue',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      title: z.string().describe('Issue title'),
      body: z.string().optional().describe('Issue body content'),
      labels: z.array(z.string()).optional().describe('Labels to apply'),
      assignees: z.array(z.string()).optional().describe('Usernames to assign')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; title: string; body?: string; labels?: string[]; assignees?: string[] }) => {
      const { data } = await clients.rest.issues.create({
        owner: args.owner,
        repo: args.repo,
        title: args.title,
        body: args.body,
        labels: args.labels,
        assignees: args.assignees
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(data, null, 2)
          }
        ]
      };
    }
  },

  update_issue: {
    description: 'Update an existing issue',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      issue_number: z.number().describe('Issue number'),
      title: z.string().optional().describe('New title'),
      body: z.string().optional().describe('New body'),
      state: z.enum(['open', 'closed']).optional().describe('New state'),
      labels: z.array(z.string()).optional().describe('New labels'),
      assignees: z.array(z.string()).optional().describe('New assignees')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; issue_number: number; title?: string; body?: string; state?: 'open' | 'closed'; labels?: string[]; assignees?: string[] }) => {
      const { data } = await clients.rest.issues.update({
        owner: args.owner,
        repo: args.repo,
        issue_number: args.issue_number,
        title: args.title,
        body: args.body,
        state: args.state,
        labels: args.labels,
        assignees: args.assignees
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(data, null, 2)
          }
        ]
      };
    }
  },

  add_issue_comment: {
    description: 'Add a comment to an issue',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      issue_number: z.number().describe('Issue number'),
      body: z.string().describe('Comment content')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; issue_number: number; body: string }) => {
      const { data } = await clients.rest.issues.createComment({
        owner: args.owner,
        repo: args.repo,
        issue_number: args.issue_number,
        body: args.body
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(data, null, 2)
          }
        ]
      };
    }
  },

  search_issues: {
    description: 'Search for issues and pull requests',
    inputSchema: z.object({
      query: z.string().describe('Search query using GitHub issues search syntax'),
      sort: z.string().optional().describe('Sort field'),
      order: z.enum(['asc', 'desc']).optional().describe('Sort order'),
      page: z.number().min(1).optional().describe('Page number for pagination'),
      perPage: z.number().min(1).max(100).optional().describe('Results per page')
    }),
    handler: async (clients: GitHubClients, args: { query: string; sort?: string; order?: 'asc' | 'desc'; page?: number; perPage?: number }) => {
      const { data } = await clients.rest.search.issuesAndPullRequests({
        q: args.query,
        sort: args.sort as 'comments' | 'created' | 'updated' | undefined,
        order: args.order,
        page: args.page,
        per_page: args.perPage
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(data, null, 2)
          }
        ]
      };
    }
  }
};
