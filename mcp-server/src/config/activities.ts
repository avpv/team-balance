/**
 * Activity configurations for TeamBalance MCP Server
 * Ported from src/config/activities/
 */

import { ActivityConfig } from '../types.js';

export const activities: Record<string, ActivityConfig> = {
  volleyball: {
    name: 'Volleyball',
    positions: {
      'S': 'Setter',
      'OPP': 'Opposite',
      'OH': 'Outside Hitter',
      'MB': 'Middle Blocker',
      'L': 'Libero'
    },
    positionWeights: { 'S': 1.0, 'OPP': 1.0, 'OH': 1.0, 'MB': 1.0, 'L': 1.0 },
    positionOrder: ['S', 'OPP', 'OH', 'MB', 'L'],
    defaultComposition: { 'S': 1, 'OPP': 1, 'OH': 2, 'MB': 2, 'L': 0 }
  },

  basketball: {
    name: 'Basketball',
    positions: {
      'PG': 'Point Guard',
      'SG': 'Shooting Guard',
      'SF': 'Small Forward',
      'PF': 'Power Forward',
      'C': 'Center'
    },
    positionWeights: { 'PG': 1.0, 'SG': 1.0, 'SF': 1.0, 'PF': 1.0, 'C': 1.0 },
    positionOrder: ['PG', 'SG', 'SF', 'PF', 'C'],
    defaultComposition: { 'PG': 1, 'SG': 1, 'SF': 1, 'PF': 1, 'C': 1 }
  },

  soccer: {
    name: '5-a-side Soccer',
    positions: {
      'GK': 'Goalkeeper',
      'D': 'Defender',
      'M': 'Midfielder',
      'F': 'Forward'
    },
    positionWeights: { 'GK': 1.0, 'D': 1.0, 'M': 1.0, 'F': 1.0 },
    positionOrder: ['GK', 'D', 'M', 'F'],
    defaultComposition: { 'GK': 1, 'D': 1, 'M': 2, 'F': 1 }
  },

  workProject: {
    name: 'Work Project',
    positions: {
      'TL': 'Team Lead',
      'PM': 'Project Manager',
      'BE': 'Backend Developer',
      'FE': 'Frontend Developer',
      'UX': 'UX Designer',
      'QA': 'QA Engineer'
    },
    positionWeights: { 'TL': 1.0, 'PM': 1.0, 'BE': 1.0, 'FE': 1.0, 'UX': 1.0, 'QA': 1.0 },
    positionOrder: ['TL', 'PM', 'BE', 'FE', 'UX', 'QA'],
    defaultComposition: { 'TL': 1, 'PM': 0, 'BE': 2, 'FE': 2, 'UX': 1, 'QA': 1 }
  },

  leagueOfLegends: {
    name: 'League of Legends',
    positions: {
      'TOP': 'Top Lane',
      'JG': 'Jungle',
      'MID': 'Mid Lane',
      'ADC': 'Attack Damage Carry',
      'SUP': 'Support'
    },
    positionWeights: { 'TOP': 1.0, 'JG': 1.0, 'MID': 1.0, 'ADC': 1.0, 'SUP': 1.0 },
    positionOrder: ['TOP', 'JG', 'MID', 'ADC', 'SUP'],
    defaultComposition: { 'TOP': 1, 'JG': 1, 'MID': 1, 'ADC': 1, 'SUP': 1 }
  },

  valorant: {
    name: 'Valorant',
    positions: {
      'DUE': 'Duelist',
      'INI': 'Initiator',
      'CON': 'Controller',
      'SEN': 'Sentinel'
    },
    positionWeights: { 'DUE': 1.0, 'INI': 1.0, 'CON': 1.0, 'SEN': 1.0 },
    positionOrder: ['DUE', 'INI', 'CON', 'SEN'],
    defaultComposition: { 'DUE': 2, 'INI': 1, 'CON': 1, 'SEN': 1 }
  },

  counterStrike2: {
    name: 'Counter-Strike 2',
    positions: {
      'IGL': 'In-Game Leader',
      'AWP': 'AWPer',
      'ENT': 'Entry Fragger',
      'SUP': 'Support',
      'LUR': 'Lurker'
    },
    positionWeights: { 'IGL': 1.0, 'AWP': 1.0, 'ENT': 1.0, 'SUP': 1.0, 'LUR': 1.0 },
    positionOrder: ['IGL', 'AWP', 'ENT', 'SUP', 'LUR'],
    defaultComposition: { 'IGL': 1, 'AWP': 1, 'ENT': 1, 'SUP': 1, 'LUR': 1 }
  },

  dota2: {
    name: 'Dota 2',
    positions: {
      'P1': 'Hard Carry',
      'P2': 'Mid Lane',
      'P3': 'Offlane',
      'P4': 'Soft Support',
      'P5': 'Hard Support'
    },
    positionWeights: { 'P1': 1.0, 'P2': 1.0, 'P3': 1.0, 'P4': 1.0, 'P5': 1.0 },
    positionOrder: ['P1', 'P2', 'P3', 'P4', 'P5'],
    defaultComposition: { 'P1': 1, 'P2': 1, 'P3': 1, 'P4': 1, 'P5': 1 }
  },

  // Universal team templates
  team1: {
    name: 'Universal Team (1 position)',
    positions: { 'P': 'Player' },
    positionWeights: { 'P': 1.0 },
    positionOrder: ['P'],
    defaultComposition: { 'P': 5 }
  },

  team2: {
    name: 'Universal Team (2 positions)',
    positions: { 'A': 'Role A', 'B': 'Role B' },
    positionWeights: { 'A': 1.0, 'B': 1.0 },
    positionOrder: ['A', 'B'],
    defaultComposition: { 'A': 3, 'B': 2 }
  },

  team3: {
    name: 'Universal Team (3 positions)',
    positions: { 'A': 'Role A', 'B': 'Role B', 'C': 'Role C' },
    positionWeights: { 'A': 1.0, 'B': 1.0, 'C': 1.0 },
    positionOrder: ['A', 'B', 'C'],
    defaultComposition: { 'A': 2, 'B': 2, 'C': 1 }
  }
};

export function getActivity(name: string): ActivityConfig | null {
  return activities[name] || null;
}

export function listActivities(): { id: string; name: string; positions: string[] }[] {
  return Object.entries(activities).map(([id, config]) => ({
    id,
    name: config.name,
    positions: config.positionOrder
  }));
}

export default activities;
