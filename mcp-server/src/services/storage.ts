/**
 * Storage Service - JSON file-based storage for MCP server
 * Replaces browser localStorage with file-based storage
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { StorageState, Session, Player, Comparison } from '../types.js';
import { RATING_CONSTANTS } from '../config/rating.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_STATE: StorageState = {
  sessions: {},
  activeSessionId: null,
  version: '1.0.0'
};

export class StorageService {
  private storagePath: string;
  private state: StorageState;

  constructor(storagePath?: string) {
    // Default to data.json in the mcp-server directory
    this.storagePath = storagePath || path.join(__dirname, '../../data.json');
    this.state = this.loadState();
  }

  private loadState(): StorageState {
    try {
      if (fs.existsSync(this.storagePath)) {
        const data = fs.readFileSync(this.storagePath, 'utf-8');
        return { ...DEFAULT_STATE, ...JSON.parse(data) };
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
    return { ...DEFAULT_STATE };
  }

  private saveState(): void {
    try {
      const dir = path.dirname(this.storagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.storagePath, JSON.stringify(this.state, null, 2));
    } catch (error) {
      console.error('Error saving state:', error);
      throw new Error(`Failed to save state: ${error}`);
    }
  }

  // Session management
  createSession(activity: string, name?: string): Session {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: Session = {
      id,
      activity,
      name: name || `${activity} Session`,
      players: [],
      comparisons: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.state.sessions[id] = session;
    this.state.activeSessionId = id;
    this.saveState();

    return session;
  }

  getSession(sessionId: string): Session | null {
    return this.state.sessions[sessionId] || null;
  }

  getActiveSession(): Session | null {
    if (!this.state.activeSessionId) return null;
    return this.state.sessions[this.state.activeSessionId] || null;
  }

  setActiveSession(sessionId: string): Session | null {
    if (this.state.sessions[sessionId]) {
      this.state.activeSessionId = sessionId;
      this.saveState();
      return this.state.sessions[sessionId];
    }
    return null;
  }

  listSessions(): Session[] {
    return Object.values(this.state.sessions);
  }

  deleteSession(sessionId: string): boolean {
    if (this.state.sessions[sessionId]) {
      delete this.state.sessions[sessionId];
      if (this.state.activeSessionId === sessionId) {
        this.state.activeSessionId = null;
      }
      this.saveState();
      return true;
    }
    return false;
  }

  // Player management
  addPlayer(
    sessionId: string,
    name: string,
    positions: string[]
  ): Player | null {
    const session = this.state.sessions[sessionId];
    if (!session) return null;

    // Check for duplicate name
    if (session.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      throw new Error(`Player "${name}" already exists in this session`);
    }

    const id = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ratings: Record<string, number> = {};
    const comparisons: Record<string, number> = {};
    const comparedWith: Record<string, string[]> = {};

    positions.forEach(pos => {
      ratings[pos] = RATING_CONSTANTS.DEFAULT;
      comparisons[pos] = 0;
      comparedWith[pos] = [];
    });

    const player: Player = {
      id,
      name,
      positions,
      ratings,
      comparisons,
      comparedWith,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    session.players.push(player);
    session.updatedAt = new Date().toISOString();
    this.saveState();

    return player;
  }

  getPlayer(sessionId: string, playerId: string): Player | null {
    const session = this.state.sessions[sessionId];
    if (!session) return null;
    return session.players.find(p => p.id === playerId) || null;
  }

  getPlayerByName(sessionId: string, name: string): Player | null {
    const session = this.state.sessions[sessionId];
    if (!session) return null;
    return session.players.find(p => p.name.toLowerCase() === name.toLowerCase()) || null;
  }

  updatePlayer(sessionId: string, playerId: string, updates: Partial<Player>): Player | null {
    const session = this.state.sessions[sessionId];
    if (!session) return null;

    const playerIndex = session.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return null;

    session.players[playerIndex] = {
      ...session.players[playerIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    session.updatedAt = new Date().toISOString();
    this.saveState();

    return session.players[playerIndex];
  }

  removePlayer(sessionId: string, playerId: string): boolean {
    const session = this.state.sessions[sessionId];
    if (!session) return false;

    const playerIndex = session.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return false;

    session.players.splice(playerIndex, 1);
    session.updatedAt = new Date().toISOString();
    this.saveState();

    return true;
  }

  listPlayers(sessionId: string): Player[] {
    const session = this.state.sessions[sessionId];
    return session ? session.players : [];
  }

  // Comparison management
  addComparison(
    sessionId: string,
    comparison: Omit<Comparison, 'id' | 'timestamp'>
  ): Comparison | null {
    const session = this.state.sessions[sessionId];
    if (!session) return null;

    const fullComparison: Comparison = {
      ...comparison,
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    session.comparisons.push(fullComparison);
    session.updatedAt = new Date().toISOString();
    this.saveState();

    return fullComparison;
  }

  listComparisons(sessionId: string): Comparison[] {
    const session = this.state.sessions[sessionId];
    return session ? session.comparisons : [];
  }

  // Export/Import
  exportSession(sessionId: string): Session | null {
    return this.state.sessions[sessionId] || null;
  }

  exportAllData(): StorageState {
    return { ...this.state };
  }

  importSession(sessionData: Session): Session {
    // Generate new ID to avoid conflicts
    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const importedSession: Session = {
      ...sessionData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.state.sessions[newId] = importedSession;
    this.state.activeSessionId = newId;
    this.saveState();

    return importedSession;
  }

  importData(data: StorageState): void {
    this.state = { ...DEFAULT_STATE, ...data };
    this.saveState();
  }

  // Utility
  getStoragePath(): string {
    return this.storagePath;
  }

  clear(): void {
    this.state = { ...DEFAULT_STATE };
    this.saveState();
  }
}

export const storage = new StorageService();
export default storage;
