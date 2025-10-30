import { create } from 'zustand';
import { api } from '@/lib/api';
import { Bookmark, CreateBookmarkData } from '@/types/bookmark';

interface BookmarksState {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;

  fetchBookmarks: () => Promise<void>;
  createBookmark: (data: CreateBookmarkData) => Promise<void>;
  vote: (bookmarkId: number, voteType: -1 | 0 | 1) => Promise<void>;
  optimisticVote: (bookmarkId: number, newVoteType: -1 | 0 | 1) => void;
  revertVote: (bookmarkId: number, oldVoteCount: number, oldUserVote: -1 | 0 | 1 | null) => void;
}

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  bookmarks: [],
  loading: false,
  error: null,

  fetchBookmarks: async () => {
    set({ loading: true, error: null });
    try {
      const bookmarks = await api.get<Bookmark[]>('/bookmarks');
      set({ bookmarks, loading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch bookmarks';
      set({ error: message, loading: false });
    }
  },

  createBookmark: async (data) => {
    try {
      const newBookmark = await api.post<Bookmark>('/bookmarks', data);
      set((state) => ({
        bookmarks: [newBookmark, ...state.bookmarks],
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create bookmark';
      set({ error: message });
      throw error;
    }
  },

  optimisticVote: (bookmarkId, newVoteType) => {
    set((state) => ({
      bookmarks: state.bookmarks.map((bookmark) => {
        if (bookmark.id !== bookmarkId) return bookmark;

        const oldVote = bookmark.userVote || 0;
        let voteCountChange = 0;

        if (oldVote === 0) {
          // No previous vote
          voteCountChange = newVoteType;
        } else if (newVoteType === 0) {
          // Removing vote
          voteCountChange = -oldVote;
        } else if (oldVote !== newVoteType) {
          // Switching vote
          voteCountChange = newVoteType - oldVote;
        } else {
          // Same vote (toggling off)
          voteCountChange = -oldVote;
          newVoteType = 0 as any;
        }

        return {
          ...bookmark,
          voteCount: bookmark.voteCount + voteCountChange,
          userVote: newVoteType === 0 ? null : newVoteType,
        };
      }),
    }));
  },

  revertVote: (bookmarkId, oldVoteCount, oldUserVote) => {
    set((state) => ({
      bookmarks: state.bookmarks.map((bookmark) =>
        bookmark.id === bookmarkId
          ? { ...bookmark, voteCount: oldVoteCount, userVote: oldUserVote }
          : bookmark
      ),
    }));
  },

  vote: async (bookmarkId, voteType) => {
    const bookmark = get().bookmarks.find((b) => b.id === bookmarkId);
    if (!bookmark) return;

    const oldVoteCount = bookmark.voteCount;
    const oldUserVote = bookmark.userVote || null;

    // Determine final vote type (toggle logic)
    let finalVoteType = voteType;
    if (bookmark.userVote === voteType) {
      finalVoteType = 0; // Remove vote
    }

    // Optimistically update UI
    get().optimisticVote(bookmarkId, finalVoteType);

    try {
      await api.post('/votes', { bookmarkId, voteType: finalVoteType });
    } catch (error: any) {
      // Revert on error
      get().revertVote(bookmarkId, oldVoteCount, oldUserVote);
      const message = error.response?.data?.message || 'Failed to vote';
      set({ error: message });
      throw error;
    }
  },
}));

