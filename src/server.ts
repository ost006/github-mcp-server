import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import { createGitHubClients } from './github-client.js';
import { toolsByToolset, type ToolConfig } from './tools/index.js';
import type { ServerConfig, GitHubClients } from './types.js';
import { DEFAULT_TOOLSETS } from './types.js';

export class GitHubMCPServer {
  private server: Server;
  private clients: GitHubClients;
  private enabledToolsets: string[];
  private tools: Map<string, ToolConfig>;

  constructor(config: ServerConfig) {
    this.server = new Server(
      {
        name: 'github-mcp-server',
        version: config.version
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.clients = createGitHubClients(config);
    this.enabledToolsets = config.enabledToolsets || DEFAULT_TOOLSETS;
    this.tools = new Map();

    this.registerTools();
    this.setupHandlers();
  }

  private registerTools(): void {
    for (const toolset of this.enabledToolsets) {
      const toolsetTools = toolsByToolset[toolset as keyof typeof toolsByToolset];
      if (toolsetTools) {
        for (const [name, config] of Object.entries(toolsetTools)) {
          this.tools.set(name, config);
        }
      }
    }
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = Array.from(this.tools.entries()).map(([name, config]) => ({
        name,
        description: config.description,
        inputSchema: config.inputSchema.shape || config.inputSchema
      }));

      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const toolName = request.params.name;
      const tool = this.tools.get(toolName);

      if (!tool) {
        throw new Error(`Unknown tool: ${toolName}`);
      }

      try {
        const result = await tool.handler(this.clients, request.params.arguments || {});
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error: ${errorMessage}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GitHub MCP Server running on stdio');
  }
}
