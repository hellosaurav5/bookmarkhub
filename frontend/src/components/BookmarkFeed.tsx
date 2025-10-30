'use client';

import React, { useEffect } from 'react';
import { useBookmarksStore } from '@/stores/bookmarksStore';
import { BookmarkCard } from './BookmarkCard';

export const BookmarkFeed: React.FC = () => {
  const { bookmarks, loading, error, fetchBookmarks } = useBookmarksStore();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6 animate-pulse">
            <div className="flex space-x-4">
              <div className="flex flex-col space-y-3 items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-200 to-purple-200 rounded-xl"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded-lg w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-red-700 shadow-lg">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">Error: {error}</span>
        </div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center shadow-lg">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No bookmarks yet!</h3>
        <p className="text-gray-600 mb-4">Be the first to share an amazing link with the community</p>
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg text-sm text-gray-700 font-medium">
          Click "Create Bookmark" above to get started ✨
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
};

