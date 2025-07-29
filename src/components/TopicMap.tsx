import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Calculator, Shapes, TrendingUp, Zap, Lock } from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  requiredLevel: number;
  xpReward: number;
}

const topics: Topic[] = [
  {
    id: 'algebra',
    name: 'Algebra Island',
    description: 'Master variables, equations, and expressions',
    icon: <Calculator className="w-8 h-8" />,
    color: 'from-blue-500 to-blue-600',
    requiredLevel: 1,
    xpReward: 10
  },
  {
    id: 'geometry',
    name: 'Geometry Grove',
    description: 'Explore shapes, angles, and spatial reasoning',
    icon: <Shapes className="w-8 h-8" />,
    color: 'from-green-500 to-green-600',
    requiredLevel: 1,
    xpReward: 12
  },
  {
    id: 'trigonometry',
    name: 'Trigonometry Territory',
    description: 'Conquer sine, cosine, and tangent functions',
    icon: <TrendingUp className="w-8 h-8" />,
    color: 'from-purple-500 to-purple-600',
    requiredLevel: 3,
    xpReward: 15
  },
  {
    id: 'calculus',
    name: 'Calculus Castle',
    description: 'Master derivatives and integrals',
    icon: <Zap className="w-8 h-8" />,
    color: 'from-red-500 to-red-600',
    requiredLevel: 5,
    xpReward: 20
  }
];

interface TopicMapProps {
  onTopicSelect: (topicId: string) => void;
}

export function TopicMap({ onTopicSelect }: TopicMapProps) {
  const { stats } = useGame();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Mathematical Adventure</h2>
        <p className="text-xl text-gray-600">
          Select a topic to begin your quest. Complete problems to earn XP and unlock new areas!
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {topics.map((topic) => {
          const isUnlocked = stats.level >= topic.requiredLevel;
          const progress = stats.topicProgress[topic.id] || 0;
          
          return (
            <div
              key={topic.id}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
                isUnlocked 
                  ? 'hover:shadow-2xl hover:scale-105 cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => isUnlocked && onTopicSelect(topic.id)}
            >
              <div className={`h-32 bg-gradient-to-br ${topic.color} flex items-center justify-center text-white relative`}>
                {topic.icon}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm">Level {topic.requiredLevel} Required</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{topic.name}</h3>
                <p className="text-gray-600 mb-4">{topic.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">
                    Reward: +{topic.xpReward} XP per correct answer
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    {progress}% Complete
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${topic.color} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                {isUnlocked && (
                  <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
                    Start Quest
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}