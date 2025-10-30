'use client';

import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useBookmarksStore } from '@/stores/bookmarksStore';
import { validateUrl } from '@/lib/utils';

interface CreateBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBookmarkModal: React.FC<CreateBookmarkModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});
  const [loading, setLoading] = useState(false);

  const createBookmark = useBookmarksStore((state) => state.createBookmark);

  const validate = () => {
    const newErrors: { title?: string; url?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }

    if (!url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!validateUrl(url)) {
      newErrors.url = 'Must be a valid URL starting with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await createBookmark({ title, url });
      setTitle('');
      setUrl('');
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to create bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Bookmark">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            placeholder="Enter bookmark title"
            maxLength={200}
          />
          <div className="flex items-center justify-between mt-1 px-1">
            <p className="text-xs text-gray-500 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Maximum 200 characters
            </p>
            <span className={`text-xs font-medium ${
              title.length > 180 
                ? 'text-red-600' 
                : title.length > 150 
                ? 'text-orange-600' 
                : 'text-gray-500'
            }`}>
              {title.length}/200
            </span>
          </div>
        </div>

        <Input
          label="URL"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={errors.url}
          placeholder="https://example.com"
        />

        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

