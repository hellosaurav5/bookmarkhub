export interface Bookmark {
  id: number;
  title: string;
  url: string;
  createdBy: string;
  createdAt: string;
  voteCount: number;
  userVote?: -1 | 0 | 1 | null;
}

export interface CreateBookmarkData {
  title: string;
  url: string;
}

