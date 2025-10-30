'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useBookmarksStore } from '@/stores/bookmarksStore';
import { CreateBookmarkModal } from './CreateBookmarkModal';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const fetchBookmarks = useBookmarksStore((state) => state.fetchBookmarks);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // Refetch bookmarks without user context to reset vote highlights
    fetchBookmarks();
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
              📚 BookmarkHub
            </Link>

            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-md hover:shadow-lg">
                    <span className="mr-1">✨</span> Create Bookmark
                  </Button>
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">{user?.email}</span>
                  </div>
                  <Button variant="ghost" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="shadow-md hover:shadow-lg">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CreateBookmarkModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

