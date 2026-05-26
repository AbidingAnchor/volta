import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../App.css';

function Dashboard() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [outputs, setOutputs] = useState({
    twitter: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    email: ''
  });
  const [copied, setCopied] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedTone, setSelectedTone] = useState('Inspirational');
  const [brandVoice, setBrandVoice] = useState('');
  const [brandVoiceCollapsed, setBrandVoiceCollapsed] = useState(true);
  const [monthlyUsage, setMonthlyUsage] = useState(0);
  const [mascotMood, setMascotMood] = useState('neutral');
  const [toneTouched, setToneTouched] = useState(false);
  const typingTimerRef = useRef(null);
  const [analyticsSummary, setAnalyticsSummary] = useState({
    bestPlatform: 'N/A',
    bestTone: 'N/A',
    totalEngagement: 0
  });
  const repurposeLimits = {
    free: 20,
    pro: 500,
    business: 2000
  };
  const currentPlan = (profile?.plan || 'free').toLowerCase();
  const usageLimit = repurposeLimits[currentPlan] || repurposeLimits.free;
  const usagePercent = Math.min((monthlyUsage / usageLimit) * 100, 100);

  useEffect(() => {
    fetchProfile();
    fetchMonthlyUsage();
    fetchAnalyticsSummary();
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
    setMascotMood('typing');

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      setMascotMood('neutral');
    }, 900);
  };

  const handleToneSelect = (tone) => {
    setSelectedTone(tone);
    setToneTouched(true);
    setMascotMood('neutral');
  };

  const getMascotConfig = () => {
    if (loading) {
      return { src: '/VoltThinking.png', animation: 'bounce', alt: 'Volt thinking' };
    }

    if (mascotMood === 'error') {
      return { src: '/VoltSurprised.png', animation: 'float', alt: 'Volt surprised' };
    }

    if (mascotMood === 'success') {
      return { src: '/VoltExcited.png', animation: 'bounce', alt: 'Volt excited' };
    }

    if (mascotMood === 'typing') {
      return { src: '/VoltThinking.png', animation: 'float', alt: 'Volt thinking' };
    }

    if (toneTouched && selectedTone === 'Funny') {
      return { src: '/VoltLaughing.png', animation: 'float', alt: 'Volt laughing' };
    }

    if (toneTouched && (selectedTone === 'Professional' || selectedTone === 'Inspirational')) {
      return { src: '/VoltSerious.png', animation: 'float', alt: 'Volt serious' };
    }

    return { src: '/VoltNeutral.png', animation: 'float', alt: 'Volt mascot' };
  };

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) {
        setProfile(data);
      }
    }
  };

  const fetchMonthlyUsage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const { count, error } = await supabase
        .from('content_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', monthStart.toISOString())
        .lt('created_at', nextMonthStart.toISOString());

      if (error) throw error;

      setMonthlyUsage(count || 0);
    } catch (error) {
      console.error('Error fetching monthly usage:', error);
    }
  };

  const fetchAnalyticsSummary = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('post_analytics')
        .select('platform,tone,likes,comments,shares,views')
        .eq('user_id', user.id);

      if (error) throw error;

      const platformStats = {};
      const toneStats = {};
      let totalEngagement = 0;

      (data || []).forEach(post => {
        const engagement = (post.likes || 0) + (post.comments || 0) + (post.shares || 0) + (post.views || 0);
        totalEngagement += engagement;

        if (post.platform) {
          platformStats[post.platform] = (platformStats[post.platform] || 0) + engagement;
        }

        if (post.tone) {
          toneStats[post.tone] = (toneStats[post.tone] || 0) + engagement;
        }
      });

      const bestPlatform = Object.entries(platformStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
      const bestTone = Object.entries(toneStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      setAnalyticsSummary({
        bestPlatform,
        bestTone,
        totalEngagement
      });
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
    }
  };

  const extractPlatformContent = (content, platform) => {
    // Try to match patterns like "twitter: content" or "twitter": "content"
    const patterns = [
      new RegExp(`${platform}:\\s*([\\s\\S]*?)(?=\\n\\w+:|$)`, 'i'),
      new RegExp(`"${platform}"\\s*:\\s*"([^"]*)"`, 'i'),
      new RegExp(`"${platform}"\\s*:\\s*'([^']*)'`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return '';
  };

  const stringifyOutput = (value) => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) {
      return value.map(stringifyOutput).filter(Boolean).join('\n');
    }
    if (typeof value === 'object') {
      return Object.values(value).map(stringifyOutput).filter(Boolean).join('\n');
    }
    return String(value).trim();
  };

  const getOutputByAliases = (source, aliases) => {
    if (!source || typeof source !== 'object' || Array.isArray(source)) return '';

    const normalizeKey = (key) => key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const entries = Object.entries(source);

    for (const alias of aliases) {
      const normalizedAlias = normalizeKey(alias);
      const entry = entries.find(([key]) => normalizeKey(key) === normalizedAlias);
      if (entry) return stringifyOutput(entry[1]);
    }

    return '';
  };

  const normalizeParsedOutputs = (parsed) => ({
    twitter: getOutputByAliases(parsed, ['twitter', 'x', 'tweets', 'twitterThread', 'twitter_thread']),
    linkedin: getOutputByAliases(parsed, ['linkedin', 'linkedIn', 'linkedinPost', 'linkedin_post']),
    instagram: getOutputByAliases(parsed, ['instagram', 'instagramCaption', 'instagram_caption']),
    facebook: getOutputByAliases(parsed, ['facebook', 'facebookPost', 'facebook_post']),
    email: getOutputByAliases(parsed, ['email', 'newsletter', 'emailIntro', 'email_intro', 'emailNewsletterIntro', 'email_newsletter_intro'])
  });

  const extractJsonObjectText = (content) => {
    const text = stringifyOutput(content);
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const candidate = codeBlockMatch ? codeBlockMatch[1] : text;
    const firstBrace = candidate.indexOf('{');
    const lastBrace = candidate.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return candidate.slice(firstBrace, lastBrace + 1);
    }

    return candidate;
  };

  const cleanTwitterThread = (content) => {
    const text = stringifyOutput(content)
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .trim();
    const tweetStart = text.search(/Tweet\s*1\s*:/i);

    if (tweetStart === -1) return text;

    return text
      .slice(tweetStart)
      .replace(/^Tweet\s*1\s*:/i, 'Tweet 1:')
      .replace(/\n?\s*["',}]*\s*(linkedin|instagram|facebook|email)"?\s*:\s*[\s\S]*$/i, '')
      .replace(/\n\s*["'}\]]+\s*$/g, '')
      .trim();
  };

  const parseRepurposeResponse = (rawResponse) => {
    const rawText = typeof rawResponse === 'string'
      ? rawResponse
      : stringifyOutput(rawResponse);
    const nestedPayload = rawResponse?.data || rawResponse?.payload || rawResponse?.response;
    const textPayload = rawResponse?.content || rawResponse?.result || rawResponse?.output || rawResponse?.message;
    const stringPayload = [textPayload, nestedPayload].find((payload) => typeof payload === 'string');
    let parsed = null;

    if (rawResponse && typeof rawResponse === 'object' && !Array.isArray(rawResponse)) {
      parsed = rawResponse;
    }

    if (nestedPayload && typeof nestedPayload === 'object' && !Array.isArray(nestedPayload)) {
      parsed = nestedPayload;
    }

    if (typeof rawResponse === 'string' || typeof stringPayload === 'string') {
      const jsonSource = typeof stringPayload === 'string' ? stringPayload : rawResponse;
      try {
        parsed = JSON.parse(extractJsonObjectText(jsonSource));
      } catch (error) {
        console.warn('Could not parse AI response as JSON, using platform fallback:', error);
      }
    }

    const normalized = normalizeParsedOutputs(parsed);
    const fallback = {
      twitter: cleanTwitterThread(normalized.twitter || extractPlatformContent(rawText, 'twitter') || extractPlatformContent(rawText, 'x')),
      linkedin: normalized.linkedin || extractPlatformContent(rawText, 'linkedin'),
      instagram: normalized.instagram || extractPlatformContent(rawText, 'instagram'),
      facebook: normalized.facebook || extractPlatformContent(rawText, 'facebook'),
      email: normalized.email || extractPlatformContent(rawText, 'email')
    };

    if (!Object.values(fallback).some(Boolean)) {
      fallback.twitter = cleanTwitterThread(rawText);
    }

    return fallback;
  };

  const handleRepurpose = async () => {
    if (!inputText.trim()) return;

    // Developer/admin override for testing
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.email === 'drewnegron95@gmail.com';

    // Check if user has reached their monthly plan limit (skip for admin)
    if (!isAdmin && monthlyUsage >= usageLimit) {
      setMascotMood('error');
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setMascotMood('typing');
    setOutputs({ twitter: '', linkedin: '', instagram: '', facebook: '', email: '' });

    try {
      const isDev = process.env.NODE_ENV === 'development';
      let data;

      if (isDev) {
        // Development: Call Groq directly
        console.log('API Key:', process.env.REACT_APP_GROQ_API_KEY);
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: `You are an expert content repurposing AI. Given a blog post or article, generate 5 different social media formats. Write all content in a ${selectedTone} tone.${brandVoice ? ` Match the writing style and tone of these examples: ${brandVoice}` : ''}
                
1. Twitter/X thread: Exactly 5 tweets, each under 280 characters. Format as "Tweet 1: [content]\\nTweet 2: [content]\\nTweet 3: [content]\\nTweet 4: [content]\\nTweet 5: [content]"
2. LinkedIn post: Professional, engaging post with 2-3 paragraphs, include relevant hashtags
3. Instagram caption: Engaging caption with emojis, 1-2 paragraphs, include relevant hashtags
4. Facebook post: Conversational, slightly longer than Twitter, with a hook opener, the main message, and a call to action at the end
5. Email newsletter intro: Compelling introduction paragraph that hooks readers

Return the response in this exact JSON format:
{
  "twitter": "Tweet 1: ...\\nTweet 2: ...\\nTweet 3: ...\\nTweet 4: ...\\nTweet 5: ...",
  "linkedin": "...",
  "instagram": "...",
  "facebook": "...",
  "email": "..."
}`
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

        if (!response.ok) {
          throw new Error('Failed to generate content');
        }

        const responseData = await response.json();

        if (responseData.choices && responseData.choices[0]) {
          const content = responseData.choices[0].message.content;
          console.log('Raw AI response:', content);
          const finalOutputs = parseRepurposeResponse(content);
          console.log('Parsed outputs:', finalOutputs);
          setOutputs(finalOutputs);
          setMascotMood('success');
          setShowResults(true);
          
          // Save to content history
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('content_history')
              .insert({
                user_id: user.id,
                input_text: inputText,
                twitter: finalOutputs.twitter,
                linkedin: finalOutputs.linkedin,
                instagram: finalOutputs.instagram,
                facebook: finalOutputs.facebook,
                email: finalOutputs.email,
                tone: selectedTone
              });
          }
        }
      } else {
        // Production: Call serverless function
        const response = await fetch('/api/repurpose', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputText,
            tone: selectedTone,
            brandVoice
          })
        });

        if (!response.ok) {
          throw new Error('Failed to generate content');
        }

        data = await response.json();
        console.log('Serverless response:', data);
        const finalOutputs = parseRepurposeResponse(data);
        console.log('Parsed serverless outputs:', finalOutputs);
        setOutputs(finalOutputs);
        setMascotMood('success');
        setShowResults(true);
        
        // Save to content history
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('content_history')
            .insert({
              user_id: user.id,
              input_text: inputText,
              twitter: finalOutputs.twitter,
              linkedin: finalOutputs.linkedin,
              instagram: finalOutputs.instagram,
              facebook: finalOutputs.facebook,
              email: finalOutputs.email,
              tone: selectedTone
            });
        }
      }
      
      // Increment repurpose count
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ repurpose_count: (profile?.repurpose_count || 0) + 1 })
          .eq('id', user.id);
        fetchProfile();
        fetchMonthlyUsage();
      }
    } catch (error) {
      console.error('Error calling API:', error);
      setMascotMood('error');
      alert('Error generating content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (type, content) => {
    navigator.clipboard.writeText(content);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  const handleSchedule = (platform, content) => {
    setSelectedPost({ platform, content });
    setShowScheduleModal(true);
  };

  const mascotConfig = getMascotConfig();

  const handleSaveSchedule = async () => {
    if (!scheduledDate || !scheduledTime) {
      alert('Please select both date and time');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user && selectedPost) {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      
      await supabase
        .from('scheduled_posts')
        .insert({
          user_id: user.id,
          platform: selectedPost.platform,
          content: selectedPost.content,
          scheduled_at: scheduledDateTime.toISOString()
        });
      
      setShowScheduleModal(false);
      setScheduledDate('');
      setScheduledTime('');
      setSelectedPost(null);
      alert('Post scheduled successfully!');
    }
  };

  return (
    <div className="app" style={{ minHeight: 'auto', paddingBottom: '40px' }}>
      <div className="gradient-orb gradient-orb-1"></div>
      <div className="gradient-orb gradient-orb-2"></div>
      <div className="gradient-orb gradient-orb-3"></div>
      <Navbar />

      <header className="header dashboard-header">
        <div className="dashboard-usage-pill">
          <span>{monthlyUsage}/{usageLimit} repurposes used this month</span>
          <div className="dashboard-usage-bar">
            <div className="dashboard-usage-fill" style={{ width: `${usagePercent}%` }}></div>
          </div>
        </div>
        <h1 className="dashboard-greeting">What are we creating today?</h1>
      </header>

      <div className="frosted-divider"></div>

      <main className="main dashboard-main">
        <div className="input-section">
          <div className="dashboard-input-with-mascot" style={{ alignItems: 'center' }}>
            <div className="input-container">
            <textarea
              className="input-textarea"
              placeholder="Paste your blog post or article here..."
              value={inputText}
              onChange={handleInputChange}
              rows={8}
            />
            <div className="character-count">
              {inputText.length} characters
            </div>
            <div className="collapsible-section">
              <button 
                className="collapsible-toggle"
                onClick={() => setBrandVoiceCollapsed(!brandVoiceCollapsed)}
              >
                <span className="toggle-icon">{brandVoiceCollapsed ? '+' : '−'}</span>
                <span>Brand Voice (Optional)</span>
              </button>
              {!brandVoiceCollapsed && (
                <div className="collapsible-content">
                  <label className="brand-voice-label">
                    Paste examples of your writing style so Volta can match your voice
                  </label>
                  <textarea
                    className="brand-voice-textarea"
                    placeholder="Paste up to 3 examples of your past high-performing posts here..."
                    value={brandVoice}
                    onChange={(e) => setBrandVoice(e.target.value)}
                    rows={6}
                  />
                </div>
              )}
            </div>
            <div className="tone-selector">
              <button
                className={`tone-button ${selectedTone === 'Professional' ? 'active' : ''}`}
                onClick={() => handleToneSelect('Professional')}
              >
                🎯 Professional
              </button>
              <button
                className={`tone-button ${selectedTone === 'Casual' ? 'active' : ''}`}
                onClick={() => handleToneSelect('Casual')}
              >
                😎 Casual
              </button>
              <button
                className={`tone-button ${selectedTone === 'Funny' ? 'active' : ''}`}
                onClick={() => handleToneSelect('Funny')}
              >
                😂 Funny
              </button>
              <button
                className={`tone-button ${selectedTone === 'Inspirational' ? 'active' : ''}`}
                onClick={() => handleToneSelect('Inspirational')}
              >
                🔥 Inspirational
              </button>
            </div>
            <button
              className={`repurpose-button ${loading ? 'loading' : ''}`}
              onClick={handleRepurpose}
              disabled={loading || !inputText.trim()}
            >
              {loading ? (
                <>
                  <span className="lightning-spinner">⚡</span>
                  Generating...
                </>
              ) : (
                '⚡ Repurpose Content'
              )}
            </button>
            </div>
            <img
              className={`dashboard-volt-mascot ${mascotConfig.animation}`}
              src={mascotConfig.src}
              alt={mascotConfig.alt}
              style={{ width: '250px', flexBasis: '250px', marginTop: 0 }}
            />
          </div>
        </div>

        <section className="performance-summary">
          <h2 className="performance-title">Your Performance</h2>
          <div className="performance-grid">
            <div className="performance-stat-card">
              <div className="performance-stat-label">Best Platform</div>
              <div className="performance-stat-value">{analyticsSummary.bestPlatform}</div>
            </div>
            <div className="performance-stat-card">
              <div className="performance-stat-label">Best Tone</div>
              <div className="performance-stat-value">{analyticsSummary.bestTone}</div>
            </div>
            <div className="performance-stat-card">
              <div className="performance-stat-label">Total Engagement</div>
              <div className="performance-stat-value">{analyticsSummary.totalEngagement.toLocaleString()}</div>
            </div>
          </div>
        </section>

        {loading ? (
          <>
            <div className="divider"></div>
            <div className="outputs-section">
              <h2 className="outputs-title">Generated Content</h2>
              <div
                className="outputs-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1.5rem',
                  justifyItems: 'center',
                  justifyContent: 'center',
                  maxWidth: '900px',
                  width: '100%',
                  margin: '0 auto'
                }}
              >
                <SkeletonCard title="Twitter Thread" icon="𝕏" type="twitter" />
                <SkeletonCard title="LinkedIn Post" icon="in" type="linkedin" />
                <SkeletonCard title="Instagram Caption" icon="📷" type="instagram" />
                <SkeletonCard title="Facebook Post" icon="📘" type="facebook" style={{ width: 'calc((100% - 3rem) / 3)' }} />
                <SkeletonCard title="Email Newsletter Intro" icon="✉️" type="email" style={{ width: 'calc((100% - 3rem) / 3)' }} />
              </div>
            </div>
          </>
        ) : showResults && (outputs.twitter || outputs.linkedin || outputs.instagram || outputs.facebook || outputs.email) ? (
          <>
            <div className="divider"></div>
            <div className="outputs-section">
              <h2 className="outputs-title">Generated Content</h2>
            <div
              className="outputs-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                justifyItems: 'center',
                justifyContent: 'center',
                maxWidth: '900px',
                width: '100%',
                margin: '0 auto'
              }}
            >
              <OutputCard
                title="Twitter Thread"
                icon="𝕏"
                content={outputs.twitter}
                type="twitter"
                copied={copied.twitter}
                onCopy={() => handleCopy('twitter', outputs.twitter)}
                onSchedule={handleSchedule}
                delay={0}
              />
              <OutputCard
                title="LinkedIn Post"
                icon="in"
                content={outputs.linkedin}
                type="linkedin"
                copied={copied.linkedin}
                onCopy={() => handleCopy('linkedin', outputs.linkedin)}
                onSchedule={handleSchedule}
                delay={100}
              />
              <OutputCard
                title="Instagram Caption"
                icon="📷"
                content={outputs.instagram}
                type="instagram"
                copied={copied.instagram}
                onCopy={() => handleCopy('instagram', outputs.instagram)}
                onSchedule={handleSchedule}
                delay={200}
              />
              <OutputCard
                title="Facebook Post"
                icon="📘"
                content={outputs.facebook}
                type="facebook"
                copied={copied.facebook}
                onCopy={() => handleCopy('facebook', outputs.facebook)}
                onSchedule={handleSchedule}
                delay={300}
              />
              <OutputCard
                title="Email Newsletter Intro"
                icon="✉️"
                content={outputs.email}
                type="email"
                copied={copied.email}
                onCopy={() => handleCopy('email', outputs.email)}
                onSchedule={handleSchedule}
                delay={400}
              />
              </div>
            </div>
          </>
        ) : null}
      </main>
      <Footer />

      {showUpgradeModal && (
        <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚡ Upgrade Required</h2>
            </div>
            <div className="modal-body">
              <p>You've used all {usageLimit} of your monthly repurposes.</p>
              <p>Upgrade your plan for a higher monthly repurpose limit.</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowUpgradeModal(false)} className="modal-button secondary">
                Maybe Later
              </button>
              <Link to="/pricing" className="modal-button primary">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📅 Schedule Post</h2>
            </div>
            <div className="modal-body">
              <div className="schedule-form">
                <label>
                  Platform:
                  <span className="schedule-platform">{selectedPost?.platform}</span>
                </label>
                <label>
                  Date:
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="schedule-input"
                  />
                </label>
                <label>
                  Time:
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="schedule-input"
                  />
                </label>
                <label>
                  Content Preview:
                  <textarea
                    value={selectedPost?.content || ''}
                    readOnly
                    className="schedule-textarea"
                  />
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowScheduleModal(false)} className="modal-button secondary">
                Cancel
              </button>
              <button onClick={handleSaveSchedule} className="modal-button primary">
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OutputCard({ title, icon, content, type, copied, onCopy, onSchedule, delay }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`output-card ${type} ${visible ? 'visible' : ''}`} style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      <div
        className="card-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div className="card-title" style={{ flex: '1 1 120px', minWidth: 0 }}>
          <span className="card-icon">{icon}</span>
          <h3 style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h3>
        </div>
        <div
          className="card-actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            flex: '0 1 auto',
            maxWidth: '100%',
            minWidth: 0,
            flexWrap: 'wrap'
          }}
        >
          <button
            className={`schedule-button`}
            onClick={() => onSchedule(type, content)}
            style={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}
          >
            📅 Schedule
          </button>
          <button
            className={`copy-button ${copied ? 'copied' : ''}`}
            onClick={onCopy}
            style={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>
      <div className="card-content">
        {content ? content.split('\n').map((line, i) => (
          <div key={i} style={{ marginBottom: line.trim() ? '8px' : '4px' }}>{line}</div>
        )) : 'No content generated yet'}
      </div>
    </div>
  );
}

function SkeletonCard({ title, icon, type }) {
  return (
    <div className={`output-card skeleton ${type}`} style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      <div
        className="card-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div className="card-title" style={{ flex: '1 1 120px', minWidth: 0 }}>
          <span className="card-icon">{icon}</span>
          <h3 style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h3>
        </div>
        <div className="skeleton-button"></div>
      </div>
      <div className="card-content skeleton-content">
        <span className="skeleton-lightning">⚡</span>
      </div>
    </div>
  );
}

export default Dashboard;
