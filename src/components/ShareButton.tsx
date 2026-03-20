'use client';

import { useState } from 'react';
import { Share2, Link2, Linkedin, Twitter, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
  data: {
    overallScore: number;
    headlineScore: number;
    summaryScore: number;
    experienceScore: number;
    skillsScore: number;
    keywordsScore: number;
    recommendations: Record<string, unknown>;
  };
}

function compressData(data: ShareButtonProps['data']): string {
  try {
    const payload = JSON.stringify(data);
    return btoa(unescape(encodeURIComponent(payload)));
  } catch {
    return '';
  }
}

export function ShareButton({ data }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const encoded = compressData(data);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${baseUrl}/shared?d=${encoded}`;

  const shareTitle = `My LinkedIn Profile Score: ${data.overallScore}/100`;
  const shareText = `I scored ${data.overallScore}/100 on my LinkedIn profile analysis! Headline: ${data.headlineScore}, Summary: ${data.summaryScore}, Experience: ${data.experienceScore}, Skills: ${data.skillsScore}, Keywords: ${data.keywordsScore}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=500'
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=500'
    );
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 p-3 space-y-1 animate-in fade-in slide-in-from-top-2">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-2 pb-1">
              Share Results
            </p>

            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Link2 className="h-4 w-4 text-zinc-400" />
              )}
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>

            <button
              onClick={shareToLinkedIn}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <Linkedin className="h-4 w-4 text-[#0a66c2]" />
              Share to LinkedIn
            </button>

            <button
              onClick={shareToTwitter}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <Twitter className="h-4 w-4 text-[#1da1f2]" />
              Share to X / Twitter
            </button>
          </div>
        </>
      )}
    </div>
  );
}
