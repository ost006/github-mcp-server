import { z } from 'zod';
import type { GitHubClients } from '../types.js';

export const reposTools = {
  get_file_contents: {
    description: 'Get file or directory contents from a repository',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner (username or organization)'),
      repo: z.string().describe('Repository name'),
      path: z.string().optional().describe('Path to file/directory'),
      ref: z.string().optional().describe('Git reference (branch, tag, or commit SHA)')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; path?: string; ref?: string }) => {
      const { owner, repo, path = '', ref } = args;
      const { data } = await clients.rest.repos.getContent({
        owner,
        repo,
        path,
        ref
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

  search_repositories: {
    description: 'Search for repositories on GitHub',
    inputSchema: z.object({
      query: z.string().describe('Search query using GitHub repository search syntax'),
      sort: z.string().optional().describe('Sort field (stars, forks, updated)'),
      order: z.enum(['asc', 'desc']).optional().describe('Sort order'),
      page: z.number().min(1).optional().describe('Page number for pagination'),
      perPage: z.number().min(1).max(100).optional().describe('Results per page')
    }),
    handler: async (clients: GitHubClients, args: { query: string; sort?: string; order?: 'asc' | 'desc'; page?: number; perPage?: number }) => {
      const { data } = await clients.rest.search.repos({
        q: args.query,
        sort: args.sort as 'stars' | 'forks' | 'updated' | undefined,
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
  },

  list_commits: {
    description: 'List commits in a repository',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      sha: z.string().optional().describe('SHA or branch to start listing commits from'),
      page: z.number().min(1).optional().describe('Page number for pagination'),
      perPage: z.number().min(1).max(100).optional().describe('Results per page')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; sha?: string; page?: number; perPage?: number }) => {
      const { data } = await clients.rest.repos.listCommits({
        owner: args.owner,
        repo: args.repo,
        sha: args.sha,
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

  get_commit: {
    description: 'Get commit details',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      sha: z.string().describe('Commit SHA, branch name, or tag name')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; sha: string }) => {
      const { data } = await clients.rest.repos.getCommit({
        owner: args.owner,
        repo: args.repo,
        ref: args.sha
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

  list_branches: {
    description: 'List branches in a repository',
    inputSchema: z.object({
      owner: z.string().describe('Repository owner'),
      repo: z.string().describe('Repository name'),
      page: z.number().min(1).optional().describe('Page number for pagination'),
      perPage: z.number().min(1).max(100).optional().describe('Results per page')
    }),
    handler: async (clients: GitHubClients, args: { owner: string; repo: string; page?: number; perPage?: number }) => {
      const { data } = await clients.rest.repos.listBranches({
        owner: args.owner,
        repo: args.repo,
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

  create_repository: {
    description: 'Create a new repository',
    inputSchema: z.object({
      name: z.string().describe('Repository name'),
      description: z.string().optional().describe('Repository description'),
      private: z.boolean().optional().describe('Whether the repository should be private'),
      autoInit: z.boolean().optional().describe('Initialize with README')
    }),
    handler: async (clients: GitHubClients, args: { name: string; description?: string; private?: boolean; autoInit?: boolean }) => {
      const { data } = await clients.rest.repos.createForAuthenticatedUser({
        name: args.name,
        description: args.description,
        private: args.private,
        auto_init: args.autoInit
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
