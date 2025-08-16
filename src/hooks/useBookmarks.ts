'use client';

import { useState, useEffect, useCallback } from 'react';

const BOOKMARKS_KEY = 'bookmarked-schemes';

export const useBookmarks = () => {
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side
    try {
      const storedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
      if (storedBookmarks) {
        setBookmarkedSchemes(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error('Error reading bookmarks from localStorage', error);
      setBookmarkedSchemes([]);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkedSchemes));
      } catch (error) {
        console.error('Error writing bookmarks to localStorage', error);
      }
    }
  }, [bookmarkedSchemes, isLoaded]);

  const addBookmark = useCallback((id: number) => {
    setBookmarkedSchemes((prev) => {
      if (prev.includes(id)) {
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const removeBookmark = useCallback((id: number) => {
    setBookmarkedSchemes((prev) => prev.filter((schemeId) => schemeId !== id));
  }, []);

  const isBookmarked = useCallback((id: number) => {
    return bookmarkedSchemes.includes(id);
  }, [bookmarkedSchemes]);

  return { bookmarkedSchemes, addBookmark, removeBookmark, isBookmarked };
};
