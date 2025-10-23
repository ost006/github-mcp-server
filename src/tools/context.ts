import { z } from 'zod';
import type { GitHubClients } from '../types.js';

export const contextTools = {
  get_me: {
    description: 'Get the authenticated user profile',
    inputSchema: z.object({}).optional(),
    handler: async (clients: GitHubClients, _args: unknown) => {
      const { data } = await clients.rest.users.getAuthenticated();
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

  get_teams: {
    description: 'Get teams for the authenticated user or specified user',
    inputSchema: z.object({
      user: z.string().optional().describe('Username to get teams for. If not provided, uses the authenticated user.')
    }),
    handler: async (clients: GitHubClients, args: { user?: string }) => {
      let teams;
      if (args.user) {
        const { data } = await clients.rest.teams.listForAuthenticatedUser();
        teams = data;
      } else {
        const { data } = await clients.rest.teams.listForAuthenticatedUser();
        teams = data;
      }
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(teams, null, 2)
          }
        ]
      };
    }
  }
};
