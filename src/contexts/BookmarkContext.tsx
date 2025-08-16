'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';

interface BookmarkContextType {
  bookmarkedSchemes: number[];
  addBookmark: (id: number) => void;
  removeBookmark: (id: number) => void;
  isBookmarked: (id: number) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const bookmarks = useBookmarks();

  return (
    <BookmarkContext.Provider value={bookmarks}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarkContext = () => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarkContext must be used within a BookmarkProvider');
  }
  return context;
};
