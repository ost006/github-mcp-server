import { z } from 'zod';
import type { GitHubClients } from '../types.js';

export const usersTools = {
  search_users: {
    description: 'Search for users on GitHub',
    inputSchema: z.object({
      query: z.string().describe('User search query'),
      sort: z.enum(['followers', 'repositories', 'joined']).optional().describe('Sort field'),
      order: z.enum(['asc', 'desc']).optional().describe('Sort order'),
      page: z.number().min(1).optional().describe('Page number for pagination'),
      perPage: z.number().min(1).max(100).optional().describe('Results per page')
    }),
    handler: async (clients: GitHubClients, args: { query: string; sort?: 'followers' | 'repositories' | 'joined'; order?: 'asc' | 'desc'; page?: number; perPage?: number }) => {
      const { data } = await clients.rest.search.users({
        q: args.query,
        sort: args.sort,
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
