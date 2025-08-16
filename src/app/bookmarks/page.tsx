'use client';

import { useBookmarkContext } from '@/contexts/BookmarkContext';
import { schemes } from '@/lib/schemes';
import { SchemeCard } from '@/components/SchemeCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  const { bookmarkedSchemes } = useBookmarkContext();
  const { language } = useLanguage();
  const t = translations[language];

  const bookmarked = schemes.filter(scheme => bookmarkedSchemes.includes(scheme.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold font-headline text-primary">{t.bookmarkedSchemes as string}</h1>
      </motion.div>

      {bookmarked.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {bookmarked.map((scheme, index) => (
            <motion.div
              key={scheme.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <SchemeCard scheme={scheme} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-16 border-2 border-dashed rounded-lg"
        >
          <Bookmark className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">{t.noBookmarks as string}</h2>
          <p className="text-muted-foreground mb-6">{t.noBookmarksSubtitle as string}</p>
          <Button asChild>
            <Link href="/">{t.exploreSchemes as string}</Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
