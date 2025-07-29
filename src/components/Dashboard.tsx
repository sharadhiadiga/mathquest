import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Trophy, Target, Zap, TrendingUp, Award, Calendar } from 'lucide-react';

export function Dashboard() {
  const { stats } = useGame();
  const playerName = localStorage.getItem('mathQuestPlayer') || 'Explorer';

  const completedTopics = Object.values(stats.topicProgress).filter(progress => progress >= 80).length;
  const averageProgress = Object.values(stats.topicProgress).length > 0 
    ? Math.round(Object.values(stats.topicProgress).reduce((a, b) => a + b, 0) / Object.values(stats.topicProgress).length)
    : 0;

  const badgeDescriptions: Record<string, string> = {
    'First Blood': 'Answered your first question correctly',
    'Quick Learner': 'Got 5 questions right in a row',
    'Math Warrior': 'Completed 10 questions correctly',
    'Century Club': 'Earned 100+ XP',
    'Math Master': 'Reached 500+ XP'
  };

  const getNextLevelXP = () => {
    return stats.level * 100;
  };

  const getCurrentLevelProgress = () => {
    const currentLevelXP = (stats.level - 1) * 100;
    const progressInLevel = stats.totalXP - currentLevelXP;
    return Math.max(0, Math.min(100, (progressInLevel / 100) * 100));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Your Math Quest Progress</h2>
        <p className="text-xl text-gray-600">Keep up the great work, {playerName}!</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-yellow-500" />
            <span className="text-3xl font-bold text-gray-800">{stats.totalXP}</span>
          </div>
          <h3 className="font-semibold text-gray-600">Total XP</h3>
          <p className="text-sm text-gray-500 mt-1">
            {getNextLevelXP() - stats.totalXP} XP to next level
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8 text-purple-500" />
            <span className="text-3xl font-bold text-gray-800">{stats.level}</span>
          </div>
          <h3 className="font-semibold text-gray-600">Current Level</h3>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${getCurrentLevelProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-blue-500" />
            <span className="text-3xl font-bold text-gray-800">{stats.badges.length}</span>
          </div>
          <h3 className="font-semibold text-gray-600">Badges Earned</h3>
          <p className="text-sm text-gray-500 mt-1">
            {5 - stats.badges.length} more to collect
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-green-500" />
            <span className="text-3xl font-bold text-gray-800">{completedTopics}</span>
          </div>
          <h3 className="font-semibold text-gray-600">Topics Mastered</h3>
          <p className="text-sm text-gray-500 mt-1">
            80%+ completion rate
          </p>
        </div>
      </div>

      {/* Progress by Topic */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2" />
          Topic Progress
        </h3>
        
        <div className="space-y-6">
          {Object.entries(stats.topicProgress).map(([topic, progress]) => {
            const topicNames: Record<string, string> = {
              algebra: 'Algebra Island',
              geometry: 'Geometry Grove',
              trigonometry: 'Trigonometry Territory',
              calculus: 'Calculus Castle'
            };
            
            return (
              <div key={topic} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">
                    {topicNames[topic] || topic}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      progress >= 80 ? 'bg-green-500' :
                      progress >= 60 ? 'bg-yellow-500' :
                      progress >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
          
          {Object.keys(stats.topicProgress).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Start solving problems to see your progress here!</p>
            </div>
          )}
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Award className="w-6 h-6 mr-2" />
          Badge Collection
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(badgeDescriptions).map(([badge, description]) => {
            const hasEarned = stats.badges.includes(badge);
            
            return (
              <div 
                key={badge}
                className={`p-4 rounded-lg border-2 transition-all ${
                  hasEarned 
                    ? 'border-yellow-300 bg-yellow-50' 
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Trophy className={`w-6 h-6 ${hasEarned ? 'text-yellow-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${hasEarned ? 'text-gray-800' : 'text-gray-500'}`}>
                    {badge}
                  </span>
                </div>
                <p className={`text-sm ${hasEarned ? 'text-gray-600' : 'text-gray-400'}`}>
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2" />
          Statistics
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.questionsAnswered}
            </div>
            <div className="text-gray-600">Questions Attempted</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.correctAnswers}
            </div>
            <div className="text-gray-600">Correct Answers</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.questionsAnswered > 0 ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100) : 0}%
            </div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}