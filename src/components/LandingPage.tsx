import React, { useState } from 'react';
import { Zap, Trophy, Target, BookOpen } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [playerName, setPlayerName] = useState('');

  const handleStart = () => {
    if (playerName.trim()) {
      localStorage.setItem('mathQuestPlayer', playerName.trim());
      onStart();
    }
  };

  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Math Quest
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Embark on an epic mathematical adventure! Solve problems, earn XP, unlock badges, and become a Math Master.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Earn XP</h3>
          <p className="text-gray-600 text-sm">Gain experience points for every correct answer</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <Trophy className="w-12 h-12 text-gold-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Unlock Badges</h3>
          <p className="text-gray-600 text-sm">Collect achievements as you master topics</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <Target className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Level Up</h3>
          <p className="text-gray-600 text-sm">Progress through levels and unlock new challenges</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Master Topics</h3>
          <p className="text-gray-600 text-sm">Explore algebra, geometry, calculus and more</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Ready to Begin?</h2>
        <div className="mb-6">
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your name
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Math Explorer"
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
          />
        </div>
        <button
          onClick={handleStart}
          disabled={!playerName.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          Start Your Quest!
        </button>
      </div>
    </div>
  );
}