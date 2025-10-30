'use client';

import React from 'react';
import { Bookmark } from '@/types/bookmark';
import { VoteControls } from './VoteControls';
import { getRelativeTime } from '@/lib/utils';

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark }) => {
  return (
    <div className="group flex bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1">
      <VoteControls
        bookmarkId={bookmark.id}
        voteCount={bookmark.voteCount}
        userVote={bookmark.userVote}
      />

      <div className="ml-5 flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {bookmark.title}
        </h3>

        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm break-all group-hover:underline decoration-2 underline-offset-2"
        >
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {bookmark.url}
        </a>

        <div className="mt-3 flex items-center space-x-3 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{bookmark.createdBy}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{getRelativeTime(bookmark.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

