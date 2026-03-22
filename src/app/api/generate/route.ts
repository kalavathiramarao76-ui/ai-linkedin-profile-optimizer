import { NextRequest, NextResponse } from 'next/server';
import { callAI, PROMPTS } from '@/lib/ai';
import { checkAndIncrementUsage, isAuthenticated } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Server-side IP rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    const authed = await isAuthenticated(ip);

    if (!authed) {
      const { allowed, count, remaining } = await checkAndIncrementUsage(ip);
      if (!allowed) {
        return NextResponse.json(
          {
            error: 'FREE_LIMIT_REACHED',
            message: `Free trial complete. You've used ${count} of 3 free generations. Sign in with Google to continue.`,
            count,
            remaining: 0,
          },
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const body = await request.json();
    const { type, role, experience, achievements } = body;

    if (!type || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: type and role.' },
        { status: 400 }
      );
    }

    let systemPrompt: string;
    let userMessage: string;

    switch (type) {
      case 'headlines':
        systemPrompt = PROMPTS.generateHeadlines;
        userMessage = `Role: ${role}\n${experience ? `Experience: ${experience}` : ''}\n\nGenerate 10 compelling LinkedIn headlines for this professional.`;
        break;

      case 'summary':
        systemPrompt = PROMPTS.generateSummary;
        userMessage = `Role: ${role}\n${experience ? `Experience: ${experience}` : ''}\n${achievements ? `Key Achievements: ${achievements}` : ''}\n\nWrite 3 LinkedIn summaries in different tones.`;
        break;

      case 'keywords':
        systemPrompt = PROMPTS.optimizeKeywords;
        userMessage = `Role: ${role}\n${experience ? `Profile Text: ${experience}` : ''}\n\nAnalyze keyword optimization for this target role.`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid type. Use: headlines, summary, or keywords.' }, { status: 400 });
    }

    const aiResponse = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ]);

    // Parse JSON from response
    let result;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');
      result = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);

      // Return fallback data
      if (type === 'headlines') {
        result = {
          headlines: [
            { text: `${role} | Driving Innovation & Growth Through Technology`, style: 'professional', tip: 'Combines role with value proposition' },
            { text: `Transforming Ideas into Impact | ${role}`, style: 'creative', tip: 'Leads with impact, shows creativity' },
            { text: `${role} | Building Scalable Solutions for Tomorrow's Challenges`, style: 'keyword-rich', tip: 'Includes searchable keywords' },
            { text: `Results-Driven ${role} | 10+ Years Building World-Class Products`, style: 'achievement-based', tip: 'Highlights experience and track record' },
            { text: `${role} | Passionate About Solving Complex Problems at Scale`, style: 'professional', tip: 'Shows passion and capability' },
            { text: `Strategic ${role} | From Concept to Launch to Scale`, style: 'executive', tip: 'Shows end-to-end ownership' },
            { text: `${role} Helping Teams Ship Faster and Smarter`, style: 'creative', tip: 'Action-oriented and team-focused' },
            { text: `Data-Driven ${role} | Making Decisions That Move Metrics`, style: 'keyword-rich', tip: 'Emphasizes data-driven approach' },
            { text: `${role} | Expert in Cross-Functional Leadership & Product Strategy`, style: 'executive', tip: 'Highlights leadership and strategy' },
            { text: `Building the Future as a ${role} | Open to New Opportunities`, style: 'professional', tip: 'Shows openness to recruiters' },
          ],
        };
      } else if (type === 'summary') {
        result = {
          summaries: [
            { tone: 'professional', text: `As a dedicated ${role}, I bring a track record of delivering impactful results through strategic thinking and hands-on execution. With extensive experience in the field, I have consistently driven growth, optimized processes, and led cross-functional initiatives.\n\nMy approach combines analytical rigor with creative problem-solving, enabling me to tackle complex challenges and deliver measurable outcomes. I thrive in fast-paced environments where innovation meets execution.\n\nI am passionate about leveraging technology and collaboration to create value for users and organizations alike. Let's connect if you're looking for someone who can make an immediate impact.`, wordCount: 95 },
            { tone: 'creative', text: `What if every project could exceed expectations? That's the question I wake up asking as a ${role}.\n\nI've spent my career turning "impossible" into "shipped." From building products used by millions to leading teams that deliver under pressure, I believe the best work happens at the intersection of ambition and empathy.\n\nWhen I'm not architecting solutions or mentoring the next generation of leaders, you'll find me exploring new technologies and challenging the status quo. Because the best way to predict the future is to build it.\n\nCurious about collaborating? Let's talk.`, wordCount: 98 },
            { tone: 'executive', text: `Senior ${role} with a proven track record of driving organizational growth and operational excellence. I specialize in translating business strategy into scalable technical solutions that deliver measurable ROI.\n\nThroughout my career, I have led multi-million dollar initiatives, built and scaled high-performing teams, and established best practices that have become industry standards. My leadership philosophy centers on empowering teams, making data-driven decisions, and maintaining an unwavering focus on outcomes.\n\nI am currently open to board advisory roles and executive leadership opportunities where I can leverage my experience to drive transformation at scale.`, wordCount: 97 },
          ],
        };
      } else {
        result = {
          targetKeywords: ['leadership', 'strategy', 'innovation'],
          presentKeywords: [],
          missingKeywords: ['leadership', 'strategy', 'innovation'],
          keywordDensityScore: 50,
          recommendations: ['Add more industry-specific keywords'],
          topKeywordsForRole: [
            { keyword: 'leadership', importance: 'high', present: false },
          ],
        };
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during generation.' },
      { status: 500 }
    );
  }
}
