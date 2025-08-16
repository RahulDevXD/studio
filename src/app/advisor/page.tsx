import { AdvisorForm } from "@/components/AdvisorForm";
import { translations } from "@/lib/translations";
import { Bot } from "lucide-react";

export default function AdvisorPage() {
  const t = translations['en']; 

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <Bot className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-2">
                AI-Powered Scheme Advisor
            </h1>
            <p className="text-lg text-foreground/80">
                Get personalized scheme recommendations. Just fill in your details below, and our AI will find the best schemes for you.
            </p>
        </div>

        <AdvisorForm />
      </div>
    </div>
  );
}
