'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScoreCircle } from '@/components/ui/score-circle';
import { RadarChart } from '@/components/ui/radar-chart';
import { formatScore, scoreColor } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle, Lightbulb, Linkedin, ExternalLink } from 'lucide-react';

interface AnalysisData {
  overallScore: number;
  headlineScore: number;
  summaryScore: number;
  experienceScore: number;
  skillsScore: number;
  keywordsScore: number;
  recommendations: {
    headline: { score: number; feedback: string; suggestions: string[] };
    summary: { score: number; feedback: string; suggestions: string[] };
    experience: { score: number; feedback: string; suggestions: string[] };
    skills: { score: number; feedback: string; suggestions: string[] };
    keywords: { score: number; feedback: string; missingKeywords: string[]; presentKeywords: string[] };
  };
}

function ScoreIcon({ score }: { score: number }) {
  if (score >= 80) return <CheckCircle className="h-5 w-5 text-emerald-400" />;
  if (score >= 60) return <AlertTriangle className="h-5 w-5 text-amber-400" />;
  return <XCircle className="h-5 w-5 text-red-400" />;
}

function SharedResultsContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const encoded = searchParams.get('d');
    if (!encoded) {
      setError(true);
      return;
    }
    try {
      const decoded = decodeURIComponent(escape(atob(encoded)));
      const parsed = JSON.parse(decoded) as AnalysisData;
      if (typeof parsed.overallScore !== 'number') throw new Error('Invalid data');
      setData(parsed);
    } catch {
      setError(true);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="h-8 w-8 text-zinc-500" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Invalid or Expired Link</h1>
          <p className="text-zinc-400 mb-6">
            This shared results link is no longer valid. Ask the sender to share a new link.
          </p>
          <Link href="/">
            <Button>Try ProfilePro AI</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse text-zinc-400">Loading shared results...</div>
      </div>
    );
  }

  const radarData = [
    { label: 'Headline', value: data.headlineScore },
    { label: 'Summary', value: data.summaryScore },
    { label: 'Experience', value: data.experienceScore },
    { label: 'Skills', value: data.skillsScore },
    { label: 'Keywords', value: data.keywordsScore },
  ];

  const sections = [
    { key: 'headline' as const, title: 'Headline' },
    { key: 'summary' as const, title: 'Summary' },
    { key: 'experience' as const, title: 'Experience' },
    { key: 'skills' as const, title: 'Skills' },
    { key: 'keywords' as const, title: 'Keywords' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top bar */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Linkedin className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white">ProfilePro AI</span>
          </Link>
          <Link href="/app/analyze">
            <Button size="sm" className="gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              Analyze Your Profile
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Shared badge */}
        <div className="mb-6 flex items-center gap-3">
          <Badge variant="default" className="bg-indigo-600/20 text-indigo-400 border-indigo-500/30">
            Shared Results
          </Badge>
          <span className="text-sm text-zinc-500">Read-only view</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">LinkedIn Profile Analysis</h1>
        <p className="text-zinc-400 text-sm mb-8">Shared profile analysis results</p>

        {/* Score overview */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <ScoreCircle score={data.overallScore} size={180} />
              <div className="mt-4 text-center">
                <Badge
                  variant={
                    data.overallScore >= 80 ? 'success' : data.overallScore >= 60 ? 'default' : 'warning'
                  }
                  className="text-sm px-3 py-1"
                >
                  {formatScore(data.overallScore)}
                </Badge>
                <p className="text-sm text-zinc-400 mt-2">Overall Profile Score</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
              <CardDescription>How each section of the profile performs</CardDescription>
            </CardHeader>
            <CardContent>
              <RadarChart data={radarData} size={260} />
            </CardContent>
          </Card>
        </div>

        {/* Section scores bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {radarData.map((item) => (
                <div key={item.label} className="text-center">
                  <div className={`text-2xl font-bold ${scoreColor(item.value)}`}>{item.value}</div>
                  <div className="text-xs text-zinc-500 mt-1">{item.label}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.value >= 80
                          ? 'bg-emerald-500'
                          : item.value >= 60
                          ? 'bg-indigo-500'
                          : item.value >= 40
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed recommendations */}
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          Detailed Recommendations
        </h2>
        <div className="space-y-4">
          {sections.map((section) => {
            const rec = data.recommendations?.[section.key];
            if (!rec) return null;

            return (
              <Card key={section.key}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ScoreIcon score={rec.score} />
                      <CardTitle>{section.title}</CardTitle>
                    </div>
                    <Badge
                      variant={
                        rec.score >= 80 ? 'success' : rec.score >= 60 ? 'default' : rec.score >= 40 ? 'warning' : 'destructive'
                      }
                    >
                      {rec.score}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-300 mb-4">{rec.feedback}</p>
                  {'suggestions' in rec && rec.suggestions && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Suggestions</p>
                      {rec.suggestions.map((suggestion: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50">
                          <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs">
                            {i + 1}
                          </span>
                          <p className="text-sm text-zinc-300 flex-1">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.key === 'keywords' && 'missingKeywords' in rec && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Missing Keywords</p>
                        <div className="flex flex-wrap gap-2">
                          {(rec.missingKeywords || []).map((kw: string) => (
                            <Badge key={kw} variant="destructive">{kw}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Present Keywords</p>
                        <div className="flex flex-wrap gap-2">
                          {(rec.presentKeywords || []).map((kw: string) => (
                            <Badge key={kw} variant="success">{kw}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center py-8 border-t border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-2">Want to optimize your profile too?</h3>
          <p className="text-zinc-400 text-sm mb-4">Get your own AI-powered LinkedIn profile analysis for free.</p>
          <Link href="/app/analyze">
            <Button size="lg" className="gap-2">
              <Linkedin className="h-4 w-4" />
              Analyze My Profile
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function SharedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse text-zinc-400">Loading shared results...</div>
      </div>
    }>
      <SharedResultsContent />
    </Suspense>
  );
}
