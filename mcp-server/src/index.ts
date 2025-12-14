#!/usr/bin/env node
/**
 * TeamBalance MCP Server
 * Provides AI-powered team balancing with ELO ratings
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { storage } from './services/storage.js';
import { eloService } from './services/elo.js';
import { comparisonService } from './services/comparison.js';
import { TeamOptimizer } from './services/team-optimizer.js';
import { activities, listActivities, getActivity } from './config/activities.js';
import type { ActivityConfig } from './types.js';

// Initialize MCP server
const server = new McpServer({
  name: 'team-balance',
  version: '1.0.0'
});

// ============================================================================
// TOOLS: Activities
// ============================================================================

server.tool(
  'list_activities',
  'List all available activities (sports, esports, work projects)',
  {},
  async () => {
    const activityList = listActivities();
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(activityList, null, 2)
      }]
    };
  }
);

server.tool(
  'get_activity',
  'Get detailed configuration for a specific activity',
  {
    activity: z.string().describe('Activity ID (e.g., "volleyball", "basketball", "leagueOfLegends")')
  },
  async ({ activity }) => {
    const config = getActivity(activity);
    if (!config) {
      return {
        content: [{
          type: 'text',
          text: `Activity "${activity}" not found. Use list_activities to see available options.`
        }],
        isError: true
      };
    }
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(config, null, 2)
      }]
    };
  }
);

// ============================================================================
// TOOLS: Sessions
// ============================================================================

server.tool(
  'create_session',
  'Create a new session for team balancing',
  {
    activity: z.string().describe('Activity ID (e.g., "volleyball", "basketball")'),
    name: z.string().optional().describe('Optional session name')
  },
  async ({ activity, name }) => {
    const config = getActivity(activity);
    if (!config) {
      return {
        content: [{
          type: 'text',
          text: `Activity "${activity}" not found. Use list_activities to see available options.`
        }],
        isError: true
      };
    }

    const session = storage.createSession(activity, name);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          message: 'Session created successfully',
          session: {
            id: session.id,
            activity: session.activity,
            name: session.name,
            positions: config.positionOrder
          }
        }, null, 2)
      }]
    };
  }
);

server.tool(
  'list_sessions',
  'List all sessions',
  {},
  async () => {
    const sessions = storage.listSessions();
    const activeSession = storage.getActiveSession();

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          activeSessionId: activeSession?.id || null,
          sessions: sessions.map(s => ({
            id: s.id,
            activity: s.activity,
            name: s.name,
            playerCount: s.players.length,
            comparisonCount: s.comparisons.length,
            createdAt: s.createdAt
          }))
        }, null, 2)
      }]
    };
  }
);

server.tool(
  'get_session',
  'Get detailed information about a session',
  {
    sessionId: z.string().optional().describe('Session ID (uses active session if not provided)')
  },
  async ({ sessionId }) => {
    const session = sessionId
      ? storage.getSession(sessionId)
      : storage.getActiveSession();

    if (!session) {
      return {
        content: [{
          type: 'text',
          text: sessionId
            ? `Session "${sessionId}" not found`
            : 'No active session. Create one with create_session or specify sessionId.'
        }],
        isError: true
      };
    }

    const stats = comparisonService.getComparisonStats(session.id);
    const config = getActivity(session.activity);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          id: session.id,
          activity: session.activity,
          activityName: config?.name || session.activity,
          name: session.name,
          playerCount: session.players.length,
          positions: config?.positionOrder || [],
          comparisonStats: stats,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt
        }, null, 2)
      }]
    };
  }
);

server.tool(
  'set_active_session',
  'Set the active session for subsequent operations',
  {
    sessionId: z.string().describe('Session ID to set as active')
  },
  async ({ sessionId }) => {
    const session = storage.setActiveSession(sessionId);
    if (!session) {
      return {
        content: [{
          type: 'text',
          text: `Session "${sessionId}" not found`
        }],
        isError: true
      };
    }

    return {
      content: [{
        type: 'text',
        text: `Active session set to: ${session.name} (${session.id})`
      }]
    };
  }
);

server.tool(
  'delete_session',
  'Delete a session',
  {
    sessionId: z.string().describe('Session ID to delete')
  },
  async ({ sessionId }) => {
    const success = storage.deleteSession(sessionId);
    return {
      content: [{
        type: 'text',
        text: success
          ? `Session "${sessionId}" deleted successfully`
          : `Session "${sessionId}" not found`
      }],
      isError: !success
    };
  }
);

// ============================================================================
// TOOLS: Players
// ============================================================================

server.tool(
  'add_player',
  'Add a player to the session',
  {
    name: z.string().describe('Player name'),
    positions: z.array(z.string()).describe('Array of position codes the player can play (e.g., ["OH", "MB"] for volleyball)'),
    sessionId: z.string().optional().describe('Session ID (uses active session if not provided)')
  },
  async ({ name, positions, sessionId }) => {
    const session = sessionId
      ? storage.getSession(sessionId)
      : storage.getActiveSession();

    if (!session) {
      return {
        content: [{
          type: 'text',
          text: 'No session found. Create one with create_session first.'
        }],
        isError: true
      };
    }

    const config = getActivity(session.activity);
    if (config) {
      const validPositions = Object.keys(config.positions);
      const invalidPositions = positions.filter(p => !validPositions.includes(p));
      if (invalidPositions.length > 0) {
        return {
          content: [{
            type: 'text',
            text: `Invalid positions: ${invalidPositions.join(', ')}. Valid positions: ${validPositions.join(', ')}`
          }],
          isError: true
        };
      }
    }

    try {
      const player = storage.addPlayer(session.id, name, positions);
      if (!player) {
        return {
          content: [{ type: 'text', text: 'Failed to add player' }],
          isError: true
        };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            message: 'Player added successfully',
            player: {
              id: player.id,
              name: player.name,
              positions: player.positions,
              ratings: player.ratings
            }
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: error instanceof Error ? error.message : 'Failed to add player'
        }],
        isError: true
      };
    }
  }
);

server.tool(
  'add_players_bulk',
  'Add multiple players at once',
  {
    players: z.array(z.object({
      name: z.string(),
      positions: z.array(z.string())
    })).describe('Array of players to add'),
    sessionId: z.string().optional().describe('Session ID (uses active session if not provided)')
  },
  async ({ players, sessionId }) => {
    const session = sessionId
      ? storage.getSession(sessionId)
      : storage.getActiveSession();

    if (!session) {
      return {
        content: [{
          type: 'text',
          text: 'No session found. Create one with create_session first.'
        }],
        isError: true
      };
    }

    const results: { success: string[]; errors: string[] } = {
      success: [],
      errors: []
    };

    for (const p of players) {
      try {
        const player = storage.addPlayer(session.id, p.name, p.positions);
        if (player) {
          results.success.push(p.name);
        } else {
          results.errors.push(`${p.name}: Failed to add`);
        }
      } catch (error) {
        results.errors.push(`${p.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          added: results.success.length,
          failed: results.errors.length,
          successNames: results.success,
          errors: results.errors
        }, null, 2)
      }]
    };
  }
);

server.tool(
  'list_players',
  'List all players in a session',
  {
    sessionId: z.string().optional().describe('Session ID (uses active session if not provided)')
  },
  async ({ sessionId }) => {
    const session = sessionId
      ? storage.getSession(sessionId)
      : storage.getActiveSession();

    if (!session) {
      return {
        content: [{
          type: 'text',
          text: 'No session found.'
        }],
        isError: true
      };
    }

    const players = session.players.map(p => ({
      id: p.id,
      name: p.name,
      positions: p.positions,
      ratings: p.ratings,
      totalComparisons: Object.values(p.comparisons || {}).reduce((a, b) => a + b, 0)
    }));

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          sessionId: session.id,
          playerCount: players.length,
          players
        }, null, 2)
      }]
    };
  }
);

server.tool(
  'remove_player',
  'Remove a player from a session',
  {
    playerName: z.string().describe('Player name to remove'),
    sessionId: z.string().optional().describe('Session ID (uses active session if not provided)')
  },
  async ({ playerName, sessionId }) => {
    const session = sessionId
      ? storage.getSession(sessionId)
      : storage.getActiveSession();

    if (!session) {
      return {
        content: [{ type: 'text', text: 'No session found.' }],
        isError: true
      };
    }

    const player = storage.getPlayerByName(session.id, playerName);
    if (!player) {
      return {
        content: [{ type: 'text', text: `Player "${playerName}" not found` }],
        isError: true
      };
    }

    const success = storage.removePlayer(session.id, player.id);
    return {
      content: [{
        type: 'text',
        text: success
          ? `Player "${playerName}" removed successfully`
          : `Failed to remove player "${playerName}"`
      }],
      isError: !success
    };
  }
);

// ============================================================================
// TOOLS: Comparisons
// ============================================================================

server.tool(
  'get_next_comparison',
  'Get the next recommended comparison pair',
  {
    position: z.string().optional().describe('Specific position to compare (optional)'),
    sessionId: z.string().optional().describe('Session ID (uses active session if not provided)')
  },
  async ({ position, sessionId }) => {
    const session = sessionId
      ? storage.getSession(sessionId)
      : storage.getActiveSession();

    if (!session) {
      return {
        content: [{ type: 'text', text: 'No session found.' }],
        isError: true
      };
    }

    const next = comparisonService.getNextComparison(session.id, position);
    if (!next) {
      return {
        content: [{
          type: 'text',
          text: 'No more comparisons needed or not enough players.'
        }]
      };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          player1: {
            id: next.player1.id,
            name: next.player1.name,
            rating: next.player1.ratings?.[next.position] || 1500
          },
          player2: {
            id: next.player2.id,
            name: next.player2.name,
            rating: next.player2.ratings?.[next.position] || 1500
          },
          position: next.position,
          priority: next.priority,
          reason: next.reason
        }, null, 2)
      }]
    };
  }
);

server.tool(
  'record_comparison',
  'Record the result of a comparison between two players',
  {
    player1Name: z.string().describe('First player name'),
    player2Name: z.string().describe('Second player name'),
    winnerName: z.string().nullable().describe('Winner name (null for draw)'),
    position: z.string().describe('Position being compared'),
    sessionId: z.string().optional().describe('Session ID (uses active session if not provided)')
  },
  async ({ player1Name, player2Name, winnerName, position, sessionId }) => {
    const session = sessionId
      ? storage.getSession(sessionId)
      : storage.getActiveSession();

    if (!session) {
      return {
        content: [{ type: 'text', text: 'No session found.' }],
        isError: true
      };
    }

    const player1 = storage.getPlayerByName(session.id, player1Name);
    const player2 = storage.getPlayerByName(session.id, player2Name);

    if (!player1) {
      return {
        content: [{ type: 'text', text: `Player "${player1Name}" not found` }],
        isError: true
      };
    }
    if (!player2) {
      return {
        content: [{ type: 'text', text: `Player "${player2Name}" not found` }],
        isError: true
      };
    }

    let winnerId: string | null = null;
    if (winnerName) {
      const winner = storage.getPlayerByName(session.id, winnerName);
      if (!winner || (winner.id !== player1.id && winner.id !== player2.id)) {
        return {
          content: [{ type: 'text', text: `Winner "${winnerName}" is not one of the compared players` }],
          isError: true
        };
      }
      winnerId = winner.id;
    }

    const result = comparisonService.recordComparison(
      session.id,
      player1.id,
      player2.id,
      winnerId,
      position
    );

    if (!result.success) {
      return {
        content: [{ type: 'text', text: result.error || 'Failed to record comparison' }],
        isError: true
      };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          message: 'Comparison recorded',
          result: winnerName ? `${winnerName} won` : 'Draw',
          ratingChanges: {
            [player1Name]: {
              oldRating: Math.round(result.ratingChanges.player1.oldRating),
              newRating: Math.round(result.ratingChanges.player1.newRating),
              change: Math.round(result.ratingChanges.player1.change)
            },
            [player2Name]: {
              oldRating: Math.round(result.ratingChanges.player2.oldRating),
              newRating: Math.round(result.ratingChanges.player2.newRating),
              change: Math.round(result.ratingChanges.player2.change)
            }
          }
        }, null, 2)
      }]
    };
  }
);

// ============================================================================
// TOOLS: Rankings
// ============================================================================

server.tool(
  'get_rankings',
  'Get player rankings for a session',
  {
    position: z.string().optional().describe('Specific position (optional, shows all if not provided)'),
    sessionId: z.string().optional().describe('Session ID (uses active session if not provided)')
  },
  async ({ position, sessionId }) => {
    const session = sessionId
      ? storage.getSession(sessionId)
      : storage.getActiveSession();

    if (!session) {
      return {
        content: [{ type: 'text', text: 'No session found.' }],
        isError: true
      };
    }

    const rankings = comparisonService.getRankings(session.id, position);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          sessionId: session.id,
          rankings
        }, null, 2)
      }]
    };
  }
);

// ============================================================================
// TOOLS: Teams
// ============================================================================

server.tool(
  'generate_teams',
  'Generate balanced teams from the current player pool',
  {
    teamCount: z.number().min(2).describe('Number of teams to generate'),
    composition: z.record(z.string(), z.number()).optional().describe('Position composition per team (e.g., {"S": 1, "OH": 2, "MB": 2}). Uses default if not provided.'),
    sessionId: z.string().optional().describe('Session ID (uses active session if not provided)')
  },
  async ({ teamCount, composition, sessionId }) => {
    const session = sessionId
      ? storage.getSession(sessionId)
      : storage.getActiveSession();

    if (!session) {
      return {
        content: [{ type: 'text', text: 'No session found.' }],
        isError: true
      };
    }

    const config = getActivity(session.activity);
    if (!config) {
      return {
        content: [{ type: 'text', text: 'Activity configuration not found.' }],
        isError: true
      };
    }

    const teamComposition = composition || config.defaultComposition;

    // Validate composition
    const validPositions = Object.keys(config.positions);
    const invalidPositions = Object.keys(teamComposition).filter(p => !validPositions.includes(p));
    if (invalidPositions.length > 0) {
      return {
        content: [{
          type: 'text',
          text: `Invalid positions in composition: ${invalidPositions.join(', ')}. Valid: ${validPositions.join(', ')}`
        }],
        isError: true
      };
    }

    const optimizer = new TeamOptimizer(config);
    const result = optimizer.optimize(teamComposition, teamCount, session.players);

    // Format result
    const formattedTeams = result.teams.map((team, index) => ({
      teamNumber: index + 1,
      totalRating: team.totalRating,
      averageRating: team.averageRating,
      players: team.players.map(p => ({
        name: p.name,
        position: p.assignedPosition,
        rating: Math.round(p.ratings?.[p.assignedPosition] || 1500)
      }))
    }));

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          teamCount,
          composition: teamComposition,
          quality: {
            balance: Math.round(result.quality.balance * 100) + '%',
            maxDifference: result.quality.maxDifference,
            isBalanced: result.quality.isBalanced
          },
          teams: formattedTeams,
          unassigned: result.unassigned.map(p => ({
            name: p.name,
            positions: p.positions
          }))
        }, null, 2)
      }]
    };
  }
);

// ============================================================================
// TOOLS: Export/Import
// ============================================================================

server.tool(
  'export_session',
  'Export session data as JSON',
  {
    sessionId: z.string().optional().describe('Session ID (uses active session if not provided)')
  },
  async ({ sessionId }) => {
    const session = sessionId
      ? storage.getSession(sessionId)
      : storage.getActiveSession();

    if (!session) {
      return {
        content: [{ type: 'text', text: 'No session found.' }],
        isError: true
      };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(session, null, 2)
      }]
    };
  }
);

server.tool(
  'import_session',
  'Import session data from JSON',
  {
    sessionData: z.string().describe('JSON string of session data to import')
  },
  async ({ sessionData }) => {
    try {
      const data = JSON.parse(sessionData);
      const session = storage.importSession(data);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            message: 'Session imported successfully',
            newSessionId: session.id,
            playerCount: session.players.length,
            comparisonCount: session.comparisons.length
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Failed to import: ${error instanceof Error ? error.message : 'Invalid JSON'}`
        }],
        isError: true
      };
    }
  }
);

// ============================================================================
// RESOURCES
// ============================================================================

server.resource(
  'session://current',
  'Current active session information',
  async () => {
    const session = storage.getActiveSession();
    if (!session) {
      return {
        contents: [{
          uri: 'session://current',
          mimeType: 'application/json',
          text: JSON.stringify({ error: 'No active session' })
        }]
      };
    }

    const stats = comparisonService.getComparisonStats(session.id);
    const config = getActivity(session.activity);

    return {
      contents: [{
        uri: 'session://current',
        mimeType: 'application/json',
        text: JSON.stringify({
          id: session.id,
          activity: session.activity,
          activityName: config?.name,
          name: session.name,
          playerCount: session.players.length,
          comparisonStats: stats
        }, null, 2)
      }]
    };
  }
);

server.resource(
  'players://current',
  'Players in the current session',
  async () => {
    const session = storage.getActiveSession();
    if (!session) {
      return {
        contents: [{
          uri: 'players://current',
          mimeType: 'application/json',
          text: JSON.stringify({ error: 'No active session' })
        }]
      };
    }

    return {
      contents: [{
        uri: 'players://current',
        mimeType: 'application/json',
        text: JSON.stringify(session.players.map(p => ({
          id: p.id,
          name: p.name,
          positions: p.positions,
          ratings: p.ratings
        })), null, 2)
      }]
    };
  }
);

server.resource(
  'activities://list',
  'List of all available activities',
  async () => {
    return {
      contents: [{
        uri: 'activities://list',
        mimeType: 'application/json',
        text: JSON.stringify(listActivities(), null, 2)
      }]
    };
  }
);

// ============================================================================
// PROMPTS
// ============================================================================

server.prompt(
  'setup-session',
  'Guide for setting up a new team balancing session',
  {
    activity: z.string().optional().describe('Activity type (e.g., volleyball)')
  },
  async ({ activity }) => {
    const activityList = listActivities();
    const selectedActivity = activity ? getActivity(activity) : null;

    let promptText = `# Setting up a Team Balancing Session\n\n`;

    if (selectedActivity) {
      promptText += `## Selected Activity: ${selectedActivity.name}\n\n`;
      promptText += `Positions: ${selectedActivity.positionOrder.join(', ')}\n\n`;
      promptText += `Steps:\n`;
      promptText += `1. Create session: create_session with activity="${activity}"\n`;
      promptText += `2. Add players: add_player with name and positions (${selectedActivity.positionOrder.join(', ')})\n`;
      promptText += `3. Run comparisons: get_next_comparison, then record_comparison\n`;
      promptText += `4. Generate teams: generate_teams with teamCount\n`;
    } else {
      promptText += `## Available Activities:\n\n`;
      activityList.forEach(a => {
        promptText += `- **${a.id}**: ${a.name} (${a.positions.join(', ')})\n`;
      });
      promptText += `\nUse this prompt with activity parameter for specific setup instructions.`;
    }

    return {
      messages: [{
        role: 'user',
        content: { type: 'text', text: promptText }
      }]
    };
  }
);

// ============================================================================
// START SERVER
// ============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('TeamBalance MCP Server started');
}

main().catch(console.error);
