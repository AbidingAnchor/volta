import React, { useState, useEffect } from 'react';
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
  const [analyticsSummary, setAnalyticsSummary] = useState({
    bestPlatform: 'N/A',
    bestTone: 'N/A',
    totalEngagement: 0
  });

  useEffect(() => {
    fetchProfile();
    fetchMonthlyUsage();
    fetchAnalyticsSummary();
  }, []);

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

  const usageLimit = 10;
  const usagePercent = Math.min((monthlyUsage / usageLimit) * 100, 100);

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

  const handleRepurpose = async () => {
    if (!inputText.trim()) return;

    // Developer/admin override for testing
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.email === 'drewnegron95@gmail.com';

    // Check if free plan user has reached limit (skip for admin)
    if (!isAdmin && profile?.plan === 'free' && profile?.repurpose_count >= 5) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
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
          
          let finalOutputs;
          try {
            // Try to extract JSON from markdown code blocks if present
            let jsonContent = content;
            const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (codeBlockMatch) {
              jsonContent = codeBlockMatch[1];
              console.log('Extracted from code block:', jsonContent);
            }
            
            const parsed = JSON.parse(jsonContent);
            console.log('Parsed outputs:', parsed);
            finalOutputs = parsed;
            setOutputs(parsed);
          } catch (e) {
            console.error('JSON parse error:', e);
            const fallback = {
              twitter: content.split('linkedin:')[0]?.replace('twitter:', '').trim() || content,
              linkedin: content.split('instagram:')[0]?.split('linkedin:')[1]?.trim() || '',
              instagram: content.split('facebook:')[0]?.split('instagram:')[1]?.trim() || '',
              facebook: content.split('email:')[0]?.split('facebook:')[1]?.trim() || '',
              email: content.split('email:')[1]?.trim() || ''
            };
            console.log('Fallback outputs:', fallback);
            finalOutputs = fallback;
            setOutputs(fallback);
          }
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
        setOutputs(data);
        setShowResults(true);
        
        // Save to content history
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('content_history')
            .insert({
              user_id: user.id,
              input_text: inputText,
              twitter: data.twitter,
              linkedin: data.linkedin,
              instagram: data.instagram,
              facebook: data.facebook,
              email: data.email,
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
          <div className="input-container">
            <textarea
              className="input-textarea"
              placeholder="Paste your blog post or article here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
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
                onClick={() => setSelectedTone('Professional')}
              >
                🎯 Professional
              </button>
              <button
                className={`tone-button ${selectedTone === 'Casual' ? 'active' : ''}`}
                onClick={() => setSelectedTone('Casual')}
              >
                😎 Casual
              </button>
              <button
                className={`tone-button ${selectedTone === 'Funny' ? 'active' : ''}`}
                onClick={() => setSelectedTone('Funny')}
              >
                😂 Funny
              </button>
              <button
                className={`tone-button ${selectedTone === 'Inspirational' ? 'active' : ''}`}
                onClick={() => setSelectedTone('Inspirational')}
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
              <div className="outputs-grid">
                <SkeletonCard title="Twitter Thread" icon="𝕏" type="twitter" />
                <SkeletonCard title="LinkedIn Post" icon="in" type="linkedin" />
                <SkeletonCard title="Instagram Caption" icon="📷" type="instagram" />
                <SkeletonCard title="Facebook Post" icon="📘" type="facebook" />
                <SkeletonCard title="Email Newsletter Intro" icon="✉️" type="email" />
              </div>
            </div>
          </>
        ) : showResults && (outputs.twitter || outputs.linkedin || outputs.instagram || outputs.facebook || outputs.email) ? (
          <>
            <div className="divider"></div>
            <div className="outputs-section">
              <h2 className="outputs-title">Generated Content</h2>
            <div className="outputs-grid">
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
              <p>You've used all 5 of your free monthly repurposes.</p>
              <p>Upgrade to Pro for unlimited repurposes and more features!</p>
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
    <div className={`output-card ${type} ${visible ? 'visible' : ''}`}>
      <div className="card-header">
        <div className="card-title">
          <span className="card-icon">{icon}</span>
          <h3>{title}</h3>
        </div>
        <div className="card-actions">
          <button
            className={`schedule-button`}
            onClick={() => onSchedule(type, content)}
          >
            📅 Schedule
          </button>
          <button
            className={`copy-button ${copied ? 'copied' : ''}`}
            onClick={onCopy}
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>
      <div className="card-content">
        <pre>{content || 'No content generated yet'}</pre>
      </div>
    </div>
  );
}

function SkeletonCard({ title, icon, type }) {
  return (
    <div className={`output-card skeleton ${type}`}>
      <div className="card-header">
        <div className="card-title">
          <span className="card-icon">{icon}</span>
          <h3>{title}</h3>
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
