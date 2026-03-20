'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/ui/copy-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { Heading, Loader2, Sparkles } from 'lucide-react';

interface Headline {
  text: string;
  style: string;
  tip: string;
}

export default function HeadlinesPage() {
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleGenerate = async () => {
    if (!role.trim()) {
      addToast({ title: 'Please enter your target role', variant: 'error' });
      return;
    }

    setLoading(true);
    setHeadlines([]);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'headlines', role, experience }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Generation failed');
      }

      const data = await response.json();
      setHeadlines(data.headlines || []);
      addToast({ title: 'Headlines generated!', variant: 'success' });
    } catch (error: any) {
      addToast({ title: 'Generation Failed', description: error.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const styleBadgeVariant = (style: string) => {
    switch (style) {
      case 'professional': return 'default' as const;
      case 'creative': return 'warning' as const;
      case 'executive': return 'success' as const;
      case 'keyword-rich': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Heading className="h-6 w-6 text-amber-400" />
          Headline Generator
        </h1>
        <p className="text-zinc-400">
          Generate 10 compelling, keyword-rich LinkedIn headlines tailored to your target role.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Your Details</CardTitle>
          <CardDescription>Tell us about your role and experience for personalized headlines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Target Role *</label>
            <Input
              placeholder="e.g., Senior Product Manager, Staff Software Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Experience Summary (Optional)</label>
            <Textarea
              placeholder="Briefly describe your experience, achievements, and what makes you unique..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button onClick={handleGenerate} disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Headlines...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate 10 Headlines
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {headlines.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Your Headlines</h2>
          {headlines.map((headline, i) => (
            <Card key={i} className="group hover:border-zinc-700 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-zinc-500">#{i + 1}</span>
                      <Badge variant={styleBadgeVariant(headline.style)}>{headline.style}</Badge>
                    </div>
                    <p className="text-base font-medium text-white mb-2">{headline.text}</p>
                    <p className="text-xs text-zinc-500">{headline.tip}</p>
                  </div>
                  <CopyButton text={headline.text} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
