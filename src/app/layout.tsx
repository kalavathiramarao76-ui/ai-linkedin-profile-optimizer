import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/ui/toast';
import { InstallPrompt } from '@/components/InstallPrompt';
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProfilePro AI - LinkedIn Profile Optimizer',
    description: 'Optimize your LinkedIn profile with AI. Get your score and actionable recommendations.',
  },
  robots: { index: true, follow: true },
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
      </head>
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        <ToastProvider>{children}</ToastProvider>
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
