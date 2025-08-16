'use client';

import Link from 'next/link';
import type { Scheme } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, User, Building, Briefcase } from 'lucide-react';
import { useBookmarkContext } from '@/contexts/BookmarkContext';
import { motion } from 'framer-motion';

interface SchemeCardProps {
  scheme: Scheme;
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkContext();
  const bookmarked = isBookmarked(scheme.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(scheme.id);
    } else {
      addBookmark(scheme.id);
    }
  };

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Link href={`/scheme/${scheme.slug}`} className="block h-full">
        <Card className="h-full flex flex-col transition-all border-2 border-transparent hover:border-primary hover:shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="font-headline text-xl leading-tight pr-4">{scheme.name}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmarkClick}
                aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark scheme'}
                className="flex-shrink-0"
              >
                <Bookmark className={`h-6 w-6 transition-colors ${bookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
              </Button>
            </div>
            <CardDescription className="flex items-center gap-2 pt-2">
                <Building className="h-4 w-4" /> {scheme.governingBody}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                    <Briefcase className="h-4 w-4 mt-0.5 text-primary"/>
                    <span><strong>Sector:</strong> {scheme.sector}</span>
                </div>
                <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-0.5 text-primary"/>
                    <span><strong>Beneficiary:</strong> {scheme.targetBeneficiary}</span>
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-wrap gap-2">
              {scheme.casteEligibility.map((caste) => (
                <Badge key={caste} variant="secondary">{caste}</Badge>
              ))}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
