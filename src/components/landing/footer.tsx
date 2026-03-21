import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <span className="text-sm font-medium text-white tracking-tight">ProfileForge</span>
            <p className="text-xs text-gray-600 mt-1">AI-powered LinkedIn optimization.</p>
          </div>
          <div className="flex gap-8">
            <Link href="/app/analyze" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Analyzer
            </Link>
            <Link href="/app/headlines" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Headlines
            </Link>
            <Link href="/app/summary" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Summary
            </Link>
            <Link href="/pricing" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Pricing
            </Link>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/[0.04]">
          <p className="text-xs text-gray-700">&copy; {new Date().getFullYear()} ProfileForge AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
