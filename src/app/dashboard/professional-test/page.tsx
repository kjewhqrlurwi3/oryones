'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is the primary purpose of version control systems?",
    options: [
      "To make backup copies of files",
      "To track changes and collaborate on code",
      "To compress files for storage",
      "To encrypt sensitive data"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which principle is NOT part of SOLID principles?",
    options: [
      "Single Responsibility",
      "Open/Closed",
      "Quick Response",
      "Dependency Inversion"
    ],
    correctAnswer: 2
  },
  // Add more questions as needed
];

export default function ProfessionalTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = async () => {
    const correctAnswers = answers.reduce((count, answer, index) => {
      return count + (answer === sampleQuestions[index].correctAnswer ? 1 : 0);
    }, 0);

    const finalScore = (correctAnswers / sampleQuestions.length) * 100;
    setScore(finalScore);
    setShowResults(true);

    try {
      const response = await fetch('/api/user/professional-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score: finalScore }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit test results');
      }

      router.refresh();
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Test Results</h2>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="text-center">
            <p className="text-4xl font-bold text-indigo-600 mb-4">
              {score.toFixed(1)}%
            </p>
            <p className="text-gray-600 mb-6">
              You answered {answers.filter((answer, index) => answer === sampleQuestions[index].correctAnswer).length} out of {sampleQuestions.length} questions correctly.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = sampleQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Professional Test</h2>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {sampleQuestions.length}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-indigo-600 rounded"
              style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-3 border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}