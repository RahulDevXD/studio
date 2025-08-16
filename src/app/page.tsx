'use client';

import { useState, useMemo, useEffect } from 'react';
import { SchemeCard } from '@/components/SchemeCard';
import { schemes } from '@/lib/schemes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Search } from 'lucide-react';

const casteFilters = ['SC', 'ST', 'BC', 'EWS', 'Kapu', 'Minorities', 'General'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCastes, setSelectedCastes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCasteToggle = (caste: string) => {
    setSelectedCastes((prev) =>
      prev.includes(caste) ? prev.filter((c) => c !== caste) : [...prev, caste]
    );
  };

  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      const searchMatch =
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.targetBeneficiary.toLowerCase().includes(searchQuery.toLowerCase());

      const casteMatch =
        selectedCastes.length === 0 ||
        selectedCastes.some((caste) => scheme.casteEligibility.includes(caste as any));

      return searchMatch && casteMatch;
    });
  }, [searchQuery, selectedCastes]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-2">
          {t.heroTitle as string}
        </h1>
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
          {t.heroSubtitle as string}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6 mb-8"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t.searchPlaceholder as string}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-6 text-lg border-2 focus-visible:ring-primary focus-visible:ring-offset-0"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {casteFilters.map((caste) => (
            <Button
              key={caste}
              variant={selectedCastes.includes(caste) ? 'default' : 'outline'}
              onClick={() => handleCasteToggle(caste)}
              className={`transition-all duration-200 ${
                selectedCastes.includes(caste) ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              {caste}
            </Button>
          ))}
        </div>
      </motion.div>
      
      <AnimatePresence>
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme, index) => (
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
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="md:col-span-2 lg:col-span-3 text-center py-12"
            >
              <p className="text-muted-foreground text-lg">{t.noSchemesFound as string}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
