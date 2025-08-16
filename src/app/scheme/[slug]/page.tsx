'use client';

import { schemes } from '@/lib/schemes';
import { notFound, useParams } from 'next/navigation';
import { useBookmarkContext } from '@/contexts/BookmarkContext';
import { Button } from '@/components/ui/button';
import { Bookmark, Share2, Printer, Building, Briefcase, User, Target, CheckCircle, FileText, ListChecks, Info, ChevronRight, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { motion } from 'framer-motion';

const SchemeDetailSection = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-3 text-lg font-headline">
            <Icon className="h-6 w-6 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-foreground/90">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function SchemePage() {
  const params = useParams();
  const slug = params.slug as string;
  const scheme = schemes.find((s) => s.slug === slug);
  
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkContext();
  const { language } = useLanguage();
  const t = translations[language];

  if (!scheme) {
    notFound();
  }
  
  const bookmarked = isBookmarked(scheme.id);

  const handleBookmarkClick = () => {
    if (bookmarked) {
      removeBookmark(scheme.id);
    } else {
      addBookmark(scheme.id);
    }
  };

  const handleShare = () => {
    if(typeof window !== "undefined"){
        const text = `Check out the ${scheme.name} on Andhra Welfare Navigator: ${window.location.href}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
  };

  const handlePrint = () => {
    if(typeof window !== "undefined"){
        window.print();
    }
  };

  const renderContentList = (items: string[]) => (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <ChevronRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="printable-area">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-headline text-primary mb-2">{scheme.name}</h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
                <span className="flex items-center gap-2"><Building className="h-4 w-4" />{scheme.governingBody}</span>
                <span className="flex items-center gap-2"><Briefcase className="h-4 w-4" />{scheme.sector}</span>
                <span className="flex items-center gap-2"><User className="h-4 w-4" />{scheme.targetBeneficiary}</span>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-2 no-print">
            <Button onClick={handleBookmarkClick} variant={bookmarked ? "default" : "outline"} className={bookmarked ? "bg-accent text-accent-foreground" : ""}>
              <Bookmark className="mr-2 h-4 w-4" />
              {bookmarked ? t.removeBookmark : t.bookmark}
            </Button>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              {t.share as string}
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              {t.downloadPDF as string}
            </Button>
          </div>
        </motion.div>

        <div className="space-y-6">
          <SchemeDetailSection title={t.overview as string} icon={Target}>
            <p>{scheme.content.overview}</p>
          </SchemeDetailSection>

          <SchemeDetailSection title={t.status as string} icon={AlertCircle}>
            <p>{scheme.content.status}</p>
          </SchemeDetailSection>

          <SchemeDetailSection title={t.benefits as string} icon={CheckCircle}>
            {renderContentList(scheme.content.benefits)}
          </SchemeDetailSection>

          <SchemeDetailSection title={t.eligibility as string} icon={User}>
            {renderContentList(scheme.content.eligibility)}
          </SchemeDetailSection>

          <SchemeDetailSection title={t.applicationProcess as string} icon={FileText}>
            {renderContentList(scheme.content.applicationProcess)}
          </SchemeDetailSection>
          
          {scheme.content.documents && scheme.content.documents.length > 0 && (
            <SchemeDetailSection title={t.documents as string} icon={ListChecks}>
              {renderContentList(scheme.content.documents)}
            </SchemeDetailSection>
          )}

          {scheme.content.checkStatus && (
            <SchemeDetailSection title={t.checkStatus as string} icon={Info}>
               <p>{scheme.content.checkStatus}</p>
            </SchemeDetailSection>
          )}

          <div className="pt-4">
            <h3 className="font-headline text-lg mb-2">Caste Eligibility</h3>
            <div className="flex flex-wrap gap-2">
              {scheme.casteEligibility.map((caste) => (
                <Badge key={caste} variant="default">{caste}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
