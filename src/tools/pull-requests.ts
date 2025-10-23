import { z } from 'zod';
import type { GitHubClients } from '../types.js';

export const pullRequestsTools = {
  list_pull_requests: {
    description: 'List pull requests in a repository',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      state: z.enum(['open', 'closed', 'all']).optional().describe('Filter by state'),
      head: z.string().optional().describe('Filter by head user/org and branch'),
      base: z.string().optional().describe('Filter by base branch'),
      sort: z.enum(['created', 'updated', 'popularity', 'long-running']).optional().describe('Sort by'),
      direction: z.enum(['asc', 'desc']).optional().describe('Sort direction'),
      page: z.number().min(1).optional().describe('Page number for pagination'),
      perPage: z.number().min(1).max(100).optional().describe('Results per page')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; state?: 'open' | 'closed' | 'all'; head?: string; base?: string; sort?: 'created' | 'updated' | 'popularity' | 'long-running'; direction?: 'asc' | 'desc'; page?: number; perPage?: number }) => {
      const { data } = await clients.rest.pulls.list({
        owner: args.owner,
        repo: args.repo,
        state: args.state,
        head: args.head,
        base: args.base,
        sort: args.sort,
        direction: args.direction,
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

  get_pull_request: {
    description: 'Get pull request details',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      pullNumber: z.number().describe('Pull request number')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; pullNumber: number }) => {
      const { data } = await clients.rest.pulls.get({
        owner: args.owner,
        repo: args.repo,
        pull_number: args.pullNumber
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

  create_pull_request: {
    description: 'Create a new pull request',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      title: z.string().describe('Pull request title'),
      head: z.string().describe('Branch containing changes'),
      base: z.string().describe('Branch to merge into'),
      body: z.string().optional().describe('Pull request description'),
      draft: z.boolean().optional().describe('Create as draft PR')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; title: string; head: string; base: string; body?: string; draft?: boolean }) => {
      const { data } = await clients.rest.pulls.create({
        owner: args.owner,
        repo: args.repo,
        title: args.title,
        head: args.head,
        base: args.base,
        body: args.body,
        draft: args.draft
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

  update_pull_request: {
    description: 'Update a pull request',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      pullNumber: z.number().describe('Pull request number'),
      title: z.string().optional().describe('New title'),
      body: z.string().optional().describe('New body'),
      state: z.enum(['open', 'closed']).optional().describe('New state'),
      base: z.string().optional().describe('New base branch')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; pullNumber: number; title?: string; body?: string; state?: 'open' | 'closed'; base?: string }) => {
      const { data } = await clients.rest.pulls.update({
        owner: args.owner,
        repo: args.repo,
        pull_number: args.pullNumber,
        title: args.title,
        body: args.body,
        state: args.state,
        base: args.base
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

  merge_pull_request: {
    description: 'Merge a pull request',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      pullNumber: z.number().describe('Pull request number'),
      commit_title: z.string().optional().describe('Title for merge commit'),
      commit_message: z.string().optional().describe('Extra detail for merge commit'),
      merge_method: z.enum(['merge', 'squash', 'rebase']).optional().describe('Merge method')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; pullNumber: number; commit_title?: string; commit_message?: string; merge_method?: 'merge' | 'squash' | 'rebase' }) => {
      const { data } = await clients.rest.pulls.merge({
        owner: args.owner,
        repo: args.repo,
        pull_number: args.pullNumber,
        commit_title: args.commit_title,
        commit_message: args.commit_message,
        merge_method: args.merge_method
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

  get_pull_request_files: {
    description: 'Get files changed in a pull request',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      pullNumber: z.number().describe('Pull request number'),
      page: z.number().min(1).optional().describe('Page number for pagination'),
      perPage: z.number().min(1).max(100).optional().describe('Results per page')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; pullNumber: number; page?: number; perPage?: number }) => {
      const { data } = await clients.rest.pulls.listFiles({
        owner: args.owner,
        repo: args.repo,
        pull_number: args.pullNumber,
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
