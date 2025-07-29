import React, { useState, useEffect } from 'react';
import { GameProvider } from './contexts/GameContext';
import { Header } from './components/Header';
import { TopicMap } from './components/TopicMap';
import { Quiz } from './components/Quiz';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';

export type GameState = 'landing' | 'topics' | 'quiz' | 'dashboard';

function App() {
  const [gameState, setGameState] = useState<GameState>('landing');
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header 
          gameState={gameState} 
          onStateChange={setGameState}
        />
        
        <main className="container mx-auto px-4 py-8">
          {gameState === 'landing' && (
            <LandingPage onStart={() => setGameState('topics')} />
          )}
          
          {gameState === 'topics' && (
            <TopicMap 
              onTopicSelect={(topic) => {
                setSelectedTopic(topic);
                setGameState('quiz');
              }}
            />
          )}
          
          {gameState === 'quiz' && (
            <Quiz 
              topic={selectedTopic}
              onComplete={() => setGameState('topics')}
            />
          )}
          
          {gameState === 'dashboard' && (
            <Dashboard />
          )}
        </main>
      </div>
    </GameProvider>
  );
}

export default App;