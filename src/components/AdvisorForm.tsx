'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { getSchemeAdvice } from '@/app/advisor/actions';
import type { SchemeAdvisorOutput } from '@/ai/flows/scheme-advisor';
import { Loader2, Lightbulb, User, BookCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const casteOptions = [
  'SC',
  'ST',
  'BC',
  'EWS',
  'Kapu',
  'Minorities',
  'General',
] as const;

const formSchema = z.object({
  caste: z.enum(casteOptions, {
    required_error: 'Please select a caste.',
  }),
  age: z.coerce.number().min(1, 'Age must be at least 1').max(120, 'Age must be 120 or less'),
  income: z.coerce.number().min(0, 'Income cannot be negative'),
  isRural: z.enum(['true', 'false'], {
    required_error: 'Please select your location type.',
  }),
});

export function AdvisorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SchemeAdvisorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { language } = useLanguage();
  const t = translations[language];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 18,
      income: 100000,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const advice = await getSchemeAdvice({
        ...values,
        isRural: values.isRural === 'true',
      });
      if (advice.reasoning.includes('An error occurred')) {
        setError(advice.reasoning);
      } else {
        setResult(advice);
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="caste"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.caste as string}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t.selectCaste as string} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {casteOptions.map((caste) => (
                            <SelectItem key={caste} value={caste}>
                              {caste}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.age as string}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter your age" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.annualIncome as string}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 150000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isRural"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t.rural as string}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4 pt-2"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="true" />
                            </FormControl>
                            <FormLabel className="font-normal">{t.yes as string}</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="false" />
                            </FormControl>
                            <FormLabel className="font-normal">{t.no as string}</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting advice...
                  </>
                ) : (
                  <>{t.getAdvice as string}</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isLoading && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 text-center"
            >
                <div className="flex justify-center items-center flex-col p-8 bg-muted/50 rounded-lg">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Our AI is analyzing your profile...</p>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-background">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><BookCheck className="text-primary"/>{t.aiRecommendedSchemes as string}</h3>
                  {result.recommendedSchemes.length > 0 ? (
                    <ul className="space-y-2 list-disc pl-5">
                      {result.recommendedSchemes.map((scheme, index) => (
                        <li key={index} className="text-lg">{scheme}</li>
                      ))}
                    </ul>
                   ) : <p>No specific schemes were recommended based on your profile.</p>
                  }
                </div>
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><User className="text-primary"/>{t.aiReasoning as string}</h3>
                  <p className="text-foreground/80 whitespace-pre-wrap">{result.reasoning}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
       <AnimatePresence>
        {error && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
            >
                <Card className="border-destructive">
                    <CardContent className="p-6">
                        <p className="text-destructive text-center">{error}</p>
                    </CardContent>
                </Card>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
