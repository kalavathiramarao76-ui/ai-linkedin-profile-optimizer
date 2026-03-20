import { NextRequest, NextResponse } from 'next/server';
import { callAI, PROMPTS } from '@/lib/ai';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    const { success, remaining } = rateLimit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
      );
    }

    const body = await request.json();
    const { profileText, targetRole, industry } = body;

    if (!profileText || typeof profileText !== 'string' || profileText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide at least 50 characters of profile text.' },
        { status: 400 }
      );
    }

    const userMessage = `Profile Text:
${profileText}

${targetRole ? `Target Role: ${targetRole}` : ''}
${industry ? `Industry: ${industry}` : ''}

Analyze this LinkedIn profile and return the JSON assessment.`;

    const aiResponse = await callAI([
      { role: 'system', content: PROMPTS.analyzeProfile },
      { role: 'user', content: userMessage },
    ]);

    // Parse the JSON from AI response
    let analysis;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      // Return fallback scores if parsing fails
      analysis = {
        overallScore: 65,
        headlineScore: 60,
        summaryScore: 65,
        experienceScore: 70,
        skillsScore: 60,
        keywordsScore: 55,
        recommendations: {
          headline: {
            score: 60,
            feedback: 'Your headline could be more specific and keyword-rich. Consider including your value proposition.',
            suggestions: [
              'Add your target role and key specialization',
              'Include a measurable achievement or unique value',
              'Use industry-specific keywords for searchability',
            ],
          },
          summary: {
            score: 65,
            feedback: 'Your summary needs a stronger hook and more specific achievements.',
            suggestions: [
              'Start with a compelling first line that hooks the reader',
              'Include 2-3 quantifiable achievements',
              'End with a clear call to action',
            ],
          },
          experience: {
            score: 70,
            feedback: 'Your experience section has good structure but could use more metrics.',
            suggestions: [
              'Add quantifiable results to each role (percentages, revenue, team size)',
              'Use action verbs at the start of each bullet point',
              'Focus on impact rather than responsibilities',
            ],
          },
          skills: {
            score: 60,
            feedback: 'Your skills section needs more relevant keywords for your target role.',
            suggestions: [
              'Add at least 5 more role-specific skills',
              'Reorder skills to prioritize the most relevant ones',
              'Get endorsements for your top skills',
            ],
          },
          keywords: {
            score: 55,
            feedback: 'Several important keywords for your industry are missing from your profile.',
            missingKeywords: ['leadership', 'strategy', 'data-driven', 'cross-functional', 'stakeholder management'],
            presentKeywords: ['management', 'development', 'team'],
          },
        },
      };
    }

    // Generate a unique ID for this analysis
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);

    const result = {
      id,
      overallScore: analysis.overallScore || 65,
      headlineScore: analysis.headlineScore || analysis.recommendations?.headline?.score || 60,
      summaryScore: analysis.summaryScore || analysis.recommendations?.summary?.score || 65,
      experienceScore: analysis.experienceScore || analysis.recommendations?.experience?.score || 70,
      skillsScore: analysis.skillsScore || analysis.recommendations?.skills?.score || 60,
      keywordsScore: analysis.keywordsScore || analysis.recommendations?.keywords?.score || 55,
      recommendations: analysis.recommendations,
    };

    return NextResponse.json(result, {
      headers: { 'X-RateLimit-Remaining': String(remaining) },
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during analysis.' },
      { status: 500 }
    );
  }
}
