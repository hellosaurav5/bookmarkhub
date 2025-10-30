import { BookmarkFeed } from '@/components/BookmarkFeed';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Discover Amazing Links
        </h1>
        <p className="text-gray-600 text-lg">
          The best bookmarks from around the web, curated by the community
        </p>
      </div>
      <BookmarkFeed />
    </div>
  );
}

