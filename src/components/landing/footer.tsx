import { Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Linkedin className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-white">ProfileAI</span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              AI-powered LinkedIn profile optimization. Stand out, get noticed, land interviews.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/app/analyze" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Analyzer</Link></li>
              <li><Link href="/app/headlines" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Headlines</Link></li>
              <li><Link href="/app/summary" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Summary</Link></li>
              <li><Link href="/pricing" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">About</Link></li>
              <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-8 pt-8 text-center">
          <p className="text-sm text-zinc-600">&copy; {new Date().getFullYear()} ProfileAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
