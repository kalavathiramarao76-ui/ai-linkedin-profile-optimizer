const AI_ENDPOINT = 'https://sai.sharedllm.com/v1/chat/completions';
const AI_MODEL = 'gpt-oss:120b';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callAI(messages: AIMessage[], stream = false): Promise<string> {
  const response = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: AI_MODEL,
      messages,
      stream,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function callAIStream(messages: AIMessage[]): Promise<ReadableStream> {
  const response = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: AI_MODEL,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  return response.body!;
}

export const PROMPTS = {
  analyzeProfile: `You are an expert LinkedIn profile consultant with 15+ years of experience in personal branding and career coaching. Analyze the following LinkedIn profile and provide a detailed assessment.

Return your analysis as valid JSON with this exact structure:
{
  "overallScore": <number 0-100>,
  "headlineScore": <number 0-100>,
  "summaryScore": <number 0-100>,
  "experienceScore": <number 0-100>,
  "skillsScore": <number 0-100>,
  "keywordsScore": <number 0-100>,
  "recommendations": {
    "headline": { "score": <number>, "feedback": "<string>", "suggestions": ["<string>", "<string>", "<string>"] },
    "summary": { "score": <number>, "feedback": "<string>", "suggestions": ["<string>", "<string>", "<string>"] },
    "experience": { "score": <number>, "feedback": "<string>", "suggestions": ["<string>", "<string>", "<string>"] },
    "skills": { "score": <number>, "feedback": "<string>", "suggestions": ["<string>", "<string>", "<string>"] },
    "keywords": { "score": <number>, "feedback": "<string>", "missingKeywords": ["<string>", "<string>", "<string>"], "presentKeywords": ["<string>", "<string>", "<string>"] }
  }
}

Be specific, actionable, and data-driven in your feedback. Score strictly but fairly.`,

  generateHeadlines: `You are a LinkedIn headline optimization expert. Generate 10 compelling, keyword-rich LinkedIn headlines for the given role and experience.

Each headline should:
- Be under 220 characters
- Include relevant keywords for SEO
- Show unique value proposition
- Be specific, not generic

Return valid JSON:
{
  "headlines": [
    { "text": "<headline>", "style": "<professional|creative|executive|keyword-rich|achievement-based>", "tip": "<why this works>" }
  ]
}`,

  generateSummary: `You are a LinkedIn summary writing expert. Write 3 professional LinkedIn summaries in different tones for the given profile.

Each summary should:
- Be 200-300 words
- Include a compelling hook in the first line
- Highlight key achievements with metrics
- Include relevant keywords naturally
- End with a call to action

Return valid JSON:
{
  "summaries": [
    { "tone": "professional", "text": "<summary>", "wordCount": <number> },
    { "tone": "creative", "text": "<summary>", "wordCount": <number> },
    { "tone": "executive", "text": "<summary>", "wordCount": <number> }
  ]
}`,

  optimizeKeywords: `You are a LinkedIn SEO and keyword optimization expert. Analyze the profile for keyword optimization in the context of the target role.

Return valid JSON:
{
  "targetKeywords": ["<keyword>"],
  "presentKeywords": ["<keyword>"],
  "missingKeywords": ["<keyword>"],
  "keywordDensityScore": <number 0-100>,
  "recommendations": ["<string>"],
  "topKeywordsForRole": [
    { "keyword": "<string>", "importance": "high|medium|low", "present": true|false }
  ]
}`,
};
