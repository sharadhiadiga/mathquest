import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface GameStats {
  totalXP: number;
  level: number;
  badges: string[];
  topicProgress: Record<string, number>;
  streak: number;
  questionsAnswered: number;
  correctAnswers: number;
  lastPlayDate: string;
}

interface GameContextType {
  stats: GameStats;
  updateStats: (updates: Partial<GameStats>) => void;
  addXP: (amount: number) => void;
  addBadge: (badge: string) => void;
  updateTopicProgress: (topic: string, progress: number) => void;
}

const initialStats: GameStats = {
  totalXP: 0,
  level: 1,
  badges: [],
  topicProgress: {},
  streak: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  lastPlayDate: new Date().toISOString().split('T')[0]
};

const GameContext = createContext<GameContextType | undefined>(undefined);

type GameAction = 
  | { type: 'UPDATE_STATS'; payload: Partial<GameStats> }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'ADD_BADGE'; payload: string }
  | { type: 'UPDATE_TOPIC_PROGRESS'; payload: { topic: string; progress: number } }
  | { type: 'LOAD_STATS'; payload: GameStats };

function gameReducer(state: GameStats, action: GameAction): GameStats {
  switch (action.type) {
    case 'UPDATE_STATS':
      return { ...state, ...action.payload };
    
    case 'ADD_XP': {
      const newXP = state.totalXP + action.payload;
      const newLevel = Math.floor(newXP / 100) + 1;
      return {
        ...state,
        totalXP: newXP,
        level: newLevel
      };
    }
    
    case 'ADD_BADGE':
      if (state.badges.includes(action.payload)) return state;
      return {
        ...state,
        badges: [...state.badges, action.payload]
      };
    
    case 'UPDATE_TOPIC_PROGRESS':
      return {
        ...state,
        topicProgress: {
          ...state.topicProgress,
          [action.payload.topic]: action.payload.progress
        }
      };
    
    case 'LOAD_STATS':
      return action.payload;
    
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [stats, dispatch] = useReducer(gameReducer, initialStats);

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('mathQuestStats');
    if (savedStats) {
      dispatch({ type: 'LOAD_STATS', payload: JSON.parse(savedStats) });
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mathQuestStats', JSON.stringify(stats));
  }, [stats]);

  const updateStats = (updates: Partial<GameStats>) => {
    dispatch({ type: 'UPDATE_STATS', payload: updates });
  };

  const addXP = (amount: number) => {
    dispatch({ type: 'ADD_XP', payload: amount });
  };

  const addBadge = (badge: string) => {
    dispatch({ type: 'ADD_BADGE', payload: badge });
  };

  const updateTopicProgress = (topic: string, progress: number) => {
    dispatch({ type: 'UPDATE_TOPIC_PROGRESS', payload: { topic, progress } });
  };

  return (
    <GameContext.Provider value={{
      stats,
      updateStats,
      addXP,
      addBadge,
      updateTopicProgress
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}