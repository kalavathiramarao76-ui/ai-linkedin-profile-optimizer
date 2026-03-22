'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { incrementUsage } from '@/lib/usage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { Loader2, Search, Sparkles } from 'lucide-react';
import { trackEvent } from '@/lib/audit';
import { LanguageSelector, LanguageBadge, useAnalysisLanguage } from '@/components/LanguageSelector';

export default function AnalyzePage() {
  const [profileText, setProfileText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();
  const { language, setLanguage } = useAnalysisLanguage();

  const handleAnalyze = async () => {
    if (!profileText.trim()) {
      addToast({ title: 'Please paste your LinkedIn profile text', variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileText, targetRole, industry, language: language.code }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Analysis failed');
      }

      const data = await response.json();
      data.language = language;
      // Store in session storage for the results page
      sessionStorage.setItem(`analysis-${data.id}`, JSON.stringify(data));
      incrementUsage();
      trackEvent('analyze', 'You', 'You analyzed a profile', targetRole ? `Target role: ${targetRole}` : undefined);
      router.push(`/app/results/${data.id}`);
    } catch (error: any) {
      addToast({ title: 'Analysis Failed', description: error.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Analyze Your Profile</h1>
        <p className="text-zinc-400">
          Paste your LinkedIn profile text below and get a comprehensive AI analysis with scores and recommendations.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-zinc-400">Analysis language:</span>
        <LanguageSelector value={language} onChange={setLanguage} />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-indigo-400" />
              Profile Text
            </CardTitle>
            <CardDescription>
              Go to your LinkedIn profile, copy all the text (headline, summary, experience, skills, etc.), and paste it here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your LinkedIn profile text here...

Example:
John Smith | Senior Software Engineer at Google

About:
Passionate software engineer with 8+ years of experience building scalable systems...

Experience:
Senior Software Engineer at Google (2020 - Present)
- Led the development of...

Skills:
Python, JavaScript, React, AWS, System Design..."
              value={profileText}
              onChange={(e) => setProfileText(e.target.value)}
              className="min-h-[250px]"
            />
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Target Role (Optional)</CardTitle>
              <CardDescription>The role you are targeting or want to optimize for</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., Senior Product Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Industry (Optional)</CardTitle>
              <CardDescription>Your target industry for keyword optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., FinTech, Healthcare, SaaS"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        <Button onClick={handleAnalyze} disabled={loading} size="lg" className="gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing Profile...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze My Profile
            </>
          )}
        </Button>

        {loading && (
          <div className="space-y-6">
            {[0, 1, 2].map((group) => (
              <Card key={group}>
                <CardContent className="p-6 space-y-3">
                  {[
                    { width: '100%', delay: `${group * 200}ms` },
                    { width: '80%', delay: `${group * 200 + 100}ms` },
                    { width: '60%', delay: `${group * 200 + 200}ms` },
                  ].map((line, i) => (
                    <div
                      key={i}
                      className="h-4 rounded-full bg-zinc-800/60 shimmer-line"
                      style={{
                        width: line.width,
                        animationDelay: line.delay,
                      }}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
