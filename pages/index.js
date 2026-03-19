import React, { useState } from 'react';
import Head from 'next/head';
import { Configuration, OpenAIApi } from 'openai';

export default function Home() {
  const [profile, setProfile] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(config);
    const prompt = `Rewrite this LinkedIn profile to be more compelling and keyword‑optimized for job seekers:\n\n${profile}`;
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
      });
      setResult(response.data.choices[0].message.content);
    } catch (err) {
      setResult('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <Head>
        <title>LinkedIn Profile Optimizer</title>
      </Head>
      <main style={{ padding: '2rem' }}>
        <h1>AI‑Powered LinkedIn Profile Optimizer</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            rows={10}
            cols={80}
            placeholder="Paste your LinkedIn profile text here..."
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? 'Optimizing…' : 'Optimize'}
          </button>
        </form>
        {result && (
          <div style={{ marginTop: '1rem' }}>
            <h2>Optimized Profile</h2>
            <pre>{result}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
