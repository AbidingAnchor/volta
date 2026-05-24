export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { inputText, tone, brandVoice } = req.body;

  if (!inputText || !inputText.trim()) {
    return res.status(400).json({ error: 'Input text is required' });
  }

  let systemPrompt = `You are an expert content repurposing AI. Given a blog post or article, generate 5 different social media formats:

1. Twitter/X thread: Exactly 5 tweets, each under 280 characters. Format as "Tweet 1: [content]\\nTweet 2: [content]\\nTweet 3: [content]\\nTweet 4: [content]\\nTweet 5: [content]"
2. LinkedIn post: Professional, engaging post with 2-3 paragraphs, include relevant hashtags
3. Instagram caption: Engaging caption with emojis, 1-2 paragraphs, include relevant hashtags
4. Facebook post: Conversational, slightly longer than Twitter, with a hook opener, the main message, and a call to action at the end
5. Email newsletter intro: Compelling introduction paragraph that hooks readers`;

  if (tone) {
    systemPrompt += `\\n\\nWrite all content in a ${tone} tone.`;
  }

  if (brandVoice && brandVoice.trim()) {
    systemPrompt += `\\n\\nHere are examples of the user's writing style to match their brand voice:\\n${brandVoice}\\n\\nUse these examples to match their writing style, voice, and personality.`;
  }

  systemPrompt += `\\n\\nReturn the response in this exact JSON format:
{
  "twitter": "Tweet 1: ...\\nTweet 2: ...\\nTweet 3: ...\\nTweet 4: ...\\nTweet 5: ...",
  "linkedin": "...",
  "instagram": "...",
  "facebook": "...",
  "email": "..."
}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: inputText
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'Failed to generate content' });
    }

    if (data.choices && data.choices[0]) {
      const content = data.choices[0].message.content;
      try {
        const parsed = JSON.parse(content);
        return res.status(200).json(parsed);
      } catch (e) {
        const fallback = {
          twitter: content.split('linkedin:')[0]?.replace('twitter:', '').trim() || content,
          linkedin: content.split('instagram:')[0]?.split('linkedin:')[1]?.trim() || '',
          instagram: content.split('facebook:')[0]?.split('instagram:')[1]?.trim() || '',
          facebook: content.split('email:')[0]?.split('facebook:')[1]?.trim() || '',
          email: content.split('email:')[1]?.trim() || ''
        };
        return res.status(200).json(fallback);
      }
    }

    return res.status(500).json({ error: 'Failed to generate content' });
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
