import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Zap, Trophy, BarChart3, Map } from 'lucide-react';
import { GameState } from '../App';

interface HeaderProps {
  gameState: GameState;
  onStateChange: (state: GameState) => void;
}

export function Header({ gameState, onStateChange }: HeaderProps) {
  const { stats } = useGame();
  const playerName = localStorage.getItem('mathQuestPlayer') || 'Explorer';

  if (gameState === 'landing') return null;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => onStateChange('topics')}
            >
              Math Quest
            </h1>
            <div className="text-lg font-semibold text-gray-700">
              Welcome, {playerName}!
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="font-semibold text-yellow-800">{stats.totalXP} XP</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
                <Trophy className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-purple-800">Level {stats.level}</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <Trophy className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-800">{stats.badges.length} Badges</span>
              </div>
            </div>

            <nav className="flex items-center space-x-4">
              <button
                onClick={() => onStateChange('topics')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  gameState === 'topics' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Topics</span>
              </button>
              
              <button
                onClick={() => onStateChange('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  gameState === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Progress</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}