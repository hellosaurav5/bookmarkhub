'use client';

import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useBookmarksStore } from '@/stores/bookmarksStore';

interface VoteControlsProps {
  bookmarkId: number;
  voteCount: number;
  userVote?: -1 | 0 | 1 | null;
}

export const VoteControls: React.FC<VoteControlsProps> = ({
  bookmarkId,
  voteCount,
  userVote,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const vote = useBookmarksStore((state) => state.vote);
  const [isVoting, setIsVoting] = React.useState(false);

  const handleVote = async (voteType: 1 | -1) => {
    if (!isAuthenticated) {
      // Don't do anything - the title tooltip will show on hover
      return;
    }

    setIsVoting(true);
    try {
      await vote(bookmarkId, voteType);
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 min-w-[60px]">
      <button
        onClick={() => handleVote(1)}
        disabled={!isAuthenticated || isVoting}
        className={`group p-2 rounded-xl transition-all duration-200 ${
          userVote === 1 
            ? 'bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-lg shadow-orange-300 scale-110' 
            : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50 hover:scale-110'
        } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : 'hover:shadow-md'}`}
        title={!isAuthenticated ? '🔒 Please login to vote' : 'Upvote'}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 3l6 7h-4v7H8v-7H4l6-7z" />
        </svg>
      </button>

      <div className={`font-bold text-lg px-3 py-1 rounded-lg ${
        voteCount > 0 
          ? 'text-orange-600 bg-orange-50' 
          : voteCount < 0 
          ? 'text-blue-600 bg-blue-50' 
          : 'text-gray-600 bg-gray-100'
      }`}>
        {voteCount > 0 ? '+' : ''}{voteCount}
      </div>

      <button
        onClick={() => handleVote(-1)}
        disabled={!isAuthenticated || isVoting}
        className={`group p-2 rounded-xl transition-all duration-200 ${
          userVote === -1 
            ? 'bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow-lg shadow-blue-300 scale-110' 
            : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 hover:scale-110'
        } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : 'hover:shadow-md'}`}
        title={!isAuthenticated ? '🔒 Please login to vote' : 'Downvote'}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 17l-6-7h4V3h4v7h4l-6 7z" />
        </svg>
      </button>
    </div>
  );
};

