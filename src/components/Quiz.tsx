import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { generateQuestion } from '../utils/mathGenerator';
import { CheckCircle, XCircle, ArrowRight, Trophy, Zap } from 'lucide-react';

interface QuizProps {
  topic: string;
  onComplete: () => void;
}

interface Question {
  question: string;
  answer: number;
  options?: number[];
  type: 'input' | 'multiple-choice';
}

export function Quiz({ topic, onComplete }: QuizProps) {
  const { stats, addXP, addBadge, updateTopicProgress } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions] = useState(10);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    generateNewQuestion();
  }, [topic]);

  const generateNewQuestion = () => {
    const question = generateQuestion(topic);
    setCurrentQuestion(question);
    setUserAnswer('');
    setSelectedOption(null);
    setShowResult(false);
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;

    let userResponse: number;
    if (currentQuestion.type === 'input') {
      userResponse = parseFloat(userAnswer);
    } else {
      userResponse = selectedOption!;
    }

    const correct = Math.abs(userResponse - currentQuestion.answer) < 0.01;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const xpGain = getXPForTopic(topic);
      setXpEarned(prev => prev + xpGain);
      addXP(xpGain);
      setCorrectAnswers(prev => prev + 1);
      
      // Check for badges
      checkForBadges(correctAnswers + 1, stats.totalXP + xpGain);
    }
  };

  const nextQuestion = () => {
    if (questionNumber >= totalQuestions) {
      completeQuiz();
    } else {
      setQuestionNumber(prev => prev + 1);
      generateNewQuestion();
    }
  };

  const completeQuiz = () => {
    const progress = Math.round((correctAnswers / totalQuestions) * 100);
    updateTopicProgress(topic, Math.max(stats.topicProgress[topic] || 0, progress));
    onComplete();
  };

  const checkForBadges = (correct: number, totalXP: number) => {
    if (correct === 1) addBadge('First Blood');
    if (correct === 5) addBadge('Quick Learner');
    if (correct === 10) addBadge('Math Warrior');
    if (totalXP >= 100) addBadge('Century Club');
    if (totalXP >= 500) addBadge('Math Master');
  };

  const getXPForTopic = (topic: string): number => {
    const xpMap: Record<string, number> = {
      algebra: 10,
      geometry: 12,
      trigonometry: 15,
      calculus: 20
    };
    return xpMap[topic] || 10;
  };

  const getTopicDisplayName = (topic: string): string => {
    const nameMap: Record<string, string> = {
      algebra: 'Algebra Island',
      geometry: 'Geometry Grove',
      trigonometry: 'Trigonometry Territory',
      calculus: 'Calculus Castle'
    };
    return nameMap[topic] || topic;
  };

  if (!currentQuestion) {
    return <div className="text-center">Loading question...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{getTopicDisplayName(topic)}</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>+{xpEarned} XP</span>
              </div>
              <div className="text-sm">
                Question {questionNumber} of {totalQuestions}
              </div>
            </div>
          </div>
          
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="h-2 bg-white rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {currentQuestion.question}
            </h3>

            {!showResult && (
              <div className="space-y-4">
                {currentQuestion.type === 'input' ? (
                  <div>
                    <input
                      type="number"
                      step="any"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full text-2xl p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                      placeholder="Enter your answer..."
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {currentQuestion.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedOption(option)}
                        className={`p-4 text-xl border-2 rounded-lg transition-all ${
                          selectedOption === option
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={checkAnswer}
                  disabled={
                    currentQuestion.type === 'input' 
                      ? !userAnswer.trim() 
                      : selectedOption === null
                  }
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg font-semibold text-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Submit Answer
                </button>
              </div>
            )}

            {showResult && (
              <div className="text-center space-y-6">
                <div className={`inline-flex items-center space-x-3 text-2xl font-bold ${
                  isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-8 h-8" />
                      <span>Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-8 h-8" />
                      <span>Incorrect</span>
                    </>
                  )}
                </div>

                <div className="text-lg text-gray-600">
                  The correct answer is: <span className="font-bold text-gray-800">{currentQuestion.answer}</span>
                </div>

                {isCorrect && (
                  <div className="flex items-center justify-center space-x-2 text-yellow-600">
                    <Trophy className="w-6 h-6" />
                    <span className="text-xl font-semibold">+{getXPForTopic(topic)} XP</span>
                  </div>
                )}

                <button
                  onClick={nextQuestion}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <span>{questionNumber >= totalQuestions ? 'Complete Quiz' : 'Next Question'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
            <div>Score: {correctAnswers}/{questionNumber - (showResult ? 0 : 1)}</div>
            <div>Accuracy: {questionNumber > 1 ? Math.round((correctAnswers / (questionNumber - 1)) * 100) : 0}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}