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
import { FileText, Loader2, Sparkles } from 'lucide-react';

interface Summary {
  tone: string;
  text: string;
  wordCount: number;
}

export default function SummaryPage() {
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [achievements, setAchievements] = useState('');
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleGenerate = async () => {
    if (!role.trim()) {
      addToast({ title: 'Please enter your role', variant: 'error' });
      return;
    }

    setLoading(true);
    setSummaries([]);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'summary', role, experience, achievements }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Generation failed');
      }

      const data = await response.json();
      setSummaries(data.summaries || []);
      addToast({ title: 'Summaries generated!', variant: 'success' });
    } catch (error: any) {
      addToast({ title: 'Generation Failed', description: error.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const toneEmoji: Record<string, string> = {
    professional: 'Professional',
    creative: 'Creative',
    executive: 'Executive',
  };

  const toneVariant = (tone: string) => {
    switch (tone) {
      case 'professional': return 'default' as const;
      case 'creative': return 'warning' as const;
      case 'executive': return 'success' as const;
      default: return 'secondary' as const;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <FileText className="h-6 w-6 text-emerald-400" />
          Summary Writer
        </h1>
        <p className="text-zinc-400">
          Generate professional LinkedIn summaries in different tones: professional, creative, and executive.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Your Details</CardTitle>
          <CardDescription>The more details you provide, the better your summaries will be</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Current/Target Role *</label>
            <Input
              placeholder="e.g., Senior Software Engineer at Google"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Experience Overview</label>
            <Textarea
              placeholder="Describe your career journey, years of experience, key technologies or domains..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Key Achievements</label>
            <Textarea
              placeholder="List your top achievements with metrics if possible (e.g., 'Grew revenue 3x', 'Led team of 15')..."
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <Button onClick={handleGenerate} disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Writing Summaries...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate 3 Summaries
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      )}

      {summaries.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Your Summaries</h2>
          {summaries.map((summary, i) => (
            <Card key={i} className="group hover:border-zinc-700 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={toneVariant(summary.tone)}>
                      {toneEmoji[summary.tone] || summary.tone}
                    </Badge>
                    <span className="text-xs text-zinc-500">{summary.wordCount} words</span>
                  </div>
                  <CopyButton text={summary.text} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{summary.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
