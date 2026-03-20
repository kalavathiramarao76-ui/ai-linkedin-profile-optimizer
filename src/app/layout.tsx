import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/ui/toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProfileAI - AI-Powered LinkedIn Profile Optimizer',
  description:
    'Get a comprehensive AI analysis of your LinkedIn profile. Optimize your headline, summary, experience, and keywords to land more interviews and attract recruiters.',
  keywords: ['LinkedIn', 'profile optimization', 'AI', 'career', 'job search', 'resume', 'headline generator'],
  openGraph: {
    title: 'ProfileAI - AI-Powered LinkedIn Profile Optimizer',
    description: 'Optimize your LinkedIn profile with AI. Get a score, personalized recommendations, and optimized content.',
    type: 'website',
    url: 'https://profileai.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProfileAI - AI-Powered LinkedIn Profile Optimizer',
    description: 'Optimize your LinkedIn profile with AI.',
  },
  robots: { index: true, follow: true },
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
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
