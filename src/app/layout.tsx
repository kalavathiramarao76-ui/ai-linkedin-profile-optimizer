import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/ui/toast';
import { InstallPrompt } from '@/components/InstallPrompt';
import { AuthGate } from '@/components/AuthGate';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProfilePro AI - AI-Powered LinkedIn Profile Optimizer',
  description:
    'Get a comprehensive AI analysis of your LinkedIn profile. Optimize your headline, summary, experience, and keywords to land more interviews and attract recruiters.',
  keywords: ['LinkedIn', 'profile optimization', 'AI', 'career', 'job search', 'resume', 'headline generator'],
  manifest: '/manifest.json',
  themeColor: '#4f46e5',
  openGraph: {
    title: 'ProfilePro AI - LinkedIn Profile Optimizer',
    description: 'Optimize your LinkedIn profile with AI. Get a score, personalized recommendations, and optimized content.',
    type: 'website',
    url: 'https://ai-linkedin-profile-optimizer.vercel.app',
    siteName: 'ProfilePro AI',
    images: [
      {
        url: 'https://ai-linkedin-profile-optimizer.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ProfilePro AI - AI-Powered LinkedIn Profile Optimizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProfilePro AI - LinkedIn Profile Optimizer',
    description: 'Optimize your LinkedIn profile with AI. Get your score and actionable recommendations.',
    images: ['https://ai-linkedin-profile-optimizer.vercel.app/og-image.png'],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://ai-linkedin-profile-optimizer.vercel.app',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ProfilePro AI',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const themeScript = `
    (function() {
      try {
        var t = localStorage.getItem('profileai-theme') || 'dark';
        var r = t === 'system'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : t;
        document.documentElement.classList.add(r);
        document.documentElement.style.colorScheme = r;
      } catch(e) { document.documentElement.classList.add('dark'); }
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'ProfilePro AI',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              description:
                'AI-powered LinkedIn profile optimizer. Get a score, personalized recommendations, and optimized content to land more interviews.',
              url: 'https://ai-linkedin-profile-optimizer.vercel.app',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '120',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        <AuthGate><ToastProvider>{children}</ToastProvider></AuthGate>
        <InstallPrompt />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
