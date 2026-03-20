'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { ScoreCircle } from '@/components/ui/score-circle';
import { RadarChart } from '@/components/ui/radar-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { formatScore, scoreColor } from '@/lib/utils';
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Lightbulb } from 'lucide-react';

interface AnalysisData {
  id: string;
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

export default function ResultsPage() {
  const params = useParams();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(`analysis-${params.id}`);
    if (stored) {
      setData(JSON.parse(stored));
      setLoading(false);
    } else {
      // Could fetch from API if we had DB
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-white mb-2">Analysis Not Found</h2>
        <p className="text-zinc-400 mb-6">This analysis may have expired. Please run a new analysis.</p>
        <Link href="/app/analyze">
          <Button>Analyze Profile</Button>
        </Link>
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
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/app/analyze">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Profile Analysis</h1>
          <p className="text-zinc-400 text-sm">Your comprehensive LinkedIn profile score</p>
        </div>
      </div>

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
            <CardDescription>How each section of your profile performs</CardDescription>
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
                    className={`h-full rounded-full transition-all duration-1000 ${
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
          const rec = data.recommendations[section.key];
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
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 group">
                        <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs">
                          {i + 1}
                        </span>
                        <p className="text-sm text-zinc-300 flex-1">{suggestion}</p>
                        <CopyButton text={suggestion} className="opacity-0 group-hover:opacity-100 transition-opacity" />
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

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link href="/app/headlines">
          <Button variant="outline" className="w-full sm:w-auto">Generate Better Headlines</Button>
        </Link>
        <Link href="/app/summary">
          <Button variant="outline" className="w-full sm:w-auto">Write Better Summary</Button>
        </Link>
        <Link href="/app/analyze">
          <Button variant="secondary" className="w-full sm:w-auto">Analyze Again</Button>
        </Link>
      </div>
    </div>
  );
}
