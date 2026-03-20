import { BarChart3, FileText, Heading, KeyRound, Search, Target } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Profile Analyzer',
    description: 'Get a comprehensive score across headline, summary, experience, skills, and keywords.',
  },
  {
    icon: Heading,
    title: 'Headline Generator',
    description: 'Generate 10 compelling, keyword-rich headlines tailored to your target role.',
  },
  {
    icon: FileText,
    title: 'Summary Writer',
    description: 'Professional summaries in multiple tones: professional, creative, and executive.',
  },
  {
    icon: KeyRound,
    title: 'Keyword Optimizer',
    description: 'Discover missing keywords and optimize for recruiter searches in your industry.',
  },
  {
    icon: Target,
    title: 'AI Rewriter',
    description: 'Get 3 optimized alternatives for each profile section, tailored to your goals.',
  },
  {
    icon: BarChart3,
    title: 'Score Dashboard',
    description: 'Visual radar chart showing your strengths and areas for improvement.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to
            <span className="text-indigo-400"> Stand Out</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Our AI analyzes your profile like a top career coach, then gives you exactly what you need to improve.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all duration-300"
            >
              <div className="h-10 w-10 rounded-lg bg-indigo-600/20 flex items-center justify-center mb-4 group-hover:bg-indigo-600/30 transition-colors">
                <feature.icon className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
