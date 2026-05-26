import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../App.css';

const pageStyles = {
  page: {
    minHeight: '100vh',
    background: '#08080F',
    color: '#F0F0FF',
    position: 'relative',
    overflowX: 'hidden'
  },
  content: {
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '96px 24px 48px',
    position: 'relative',
    zIndex: 1
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '24px'
  },
  title: {
    fontSize: '32px',
    lineHeight: 1.1,
    fontWeight: 800,
    margin: 0,
    color: '#F0F0FF'
  },
  subtitle: {
    margin: '8px 0 0',
    color: 'rgba(240,240,255,0.55)',
    fontSize: '14px'
  },
  addButton: {
    background: 'linear-gradient(135deg, #F5C518, #FF6B35)',
    color: '#000',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 18px',
    fontSize: '14px',
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.32)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
    marginBottom: '22px'
  },
  statCard: {
    padding: '20px'
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: 'rgba(240,240,255,0.5)'
  },
  statValue: {
    marginTop: '8px',
    fontSize: '28px',
    fontWeight: 900,
    color: '#F5C518',
    overflowWrap: 'anywhere'
  },
  section: {
    padding: '22px',
    marginBottom: '22px'
  },
  sectionTitle: {
    margin: '0 0 16px',
    fontSize: '18px',
    fontWeight: 800,
    color: '#F0F0FF'
  },
  platformGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '14px'
  },
  platformCard: {
    background: 'rgba(255,255,255,0.035)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '16px'
  },
  platformTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '12px'
  },
  platformName: {
    fontSize: '15px',
    fontWeight: 800,
    color: '#F0F0FF'
  },
  platformValue: {
    fontSize: '14px',
    fontWeight: 800,
    color: '#F5C518'
  },
  progressTrack: {
    height: '8px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '999px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #F5C518, #FF6B35)',
    borderRadius: '999px'
  },
  tableWrap: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '820px'
  },
  th: {
    textAlign: 'left',
    padding: '13px 14px',
    fontSize: '11px',
    fontWeight: 900,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: 'rgba(240,240,255,0.52)',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  td: {
    padding: '14px',
    fontSize: '14px',
    color: 'rgba(240,240,255,0.82)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    verticalAlign: 'top'
  },
  platformPill: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '999px',
    padding: '5px 10px',
    background: 'rgba(245,197,24,0.1)',
    border: '1px solid rgba(245,197,24,0.22)',
    color: '#F5C518',
    fontSize: '12px',
    fontWeight: 800
  },
  empty: {
    padding: '28px',
    textAlign: 'center',
    color: 'rgba(240,240,255,0.58)'
  },
  modalCard: {
    width: '100%',
    maxWidth: '560px',
    background: '#0f0f1a',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '18px',
    padding: '26px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.65)'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '14px'
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#F0F0FF',
    padding: '11px 12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: 'rgba(240,240,255,0.58)',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase'
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '14px'
  },
  insightCard: {
    background: 'rgba(255,255,255,0.035)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '18px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  insightIcon: {
    color: '#F5C518',
    fontSize: '22px',
    lineHeight: 1,
    filter: 'drop-shadow(0 0 10px rgba(245,197,24,0.35))'
  },
  insightText: {
    margin: 0,
    color: 'rgba(240,240,255,0.82)',
    fontSize: '14px',
    lineHeight: 1.5,
    fontWeight: 700
  }
};

function Analytics() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    platform: 'Twitter',
    tone: 'Professional',
    post_text: '',
    likes: 0,
    comments: 0,
    shares: 0,
    views: 0,
    posted_at: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAnalytics([]);
        return;
      }

      const { data, error } = await supabase
        .from('post_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('posted_at', { ascending: false });

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEngagement = (post) => (
    (post.likes || 0) + (post.comments || 0) + (post.shares || 0) + (post.views || 0)
  );

  const calculateStats = () => {
    const platformStats = {};
    const toneStats = {};
    let totalEngagement = 0;

    analytics.forEach((post) => {
      const engagement = getEngagement(post);
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

    return {
      totalPosts: analytics.length,
      bestPlatform,
      bestTone,
      totalEngagement
    };
  };

  const getPlatformPerformance = () => {
    const platformStats = {};
    let totalEngagement = 0;

    analytics.forEach((post) => {
      const platform = post.platform || 'Unknown';
      const engagement = getEngagement(post);
      platformStats[platform] = (platformStats[platform] || 0) + engagement;
      totalEngagement += engagement;
    });

    const defaultPlatforms = ['Twitter', 'LinkedIn', 'Instagram', 'Facebook', 'Blog'];
    const allPlatforms = Array.from(new Set([...defaultPlatforms, ...Object.keys(platformStats)]));

    return allPlatforms.map((platform) => ({
      name: platform,
      engagement: platformStats[platform] || 0,
      percentage: totalEngagement > 0 ? ((platformStats[platform] || 0) / totalEngagement) * 100 : 0
    }));
  };

  const handleSavePost = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const postData = {
        ...formData,
        user_id: user.id,
        likes: Number(formData.likes) || 0,
        comments: Number(formData.comments) || 0,
        shares: Number(formData.shares) || 0,
        views: Number(formData.views) || 0,
        posted_at: new Date(formData.posted_at).toISOString()
      };

      const { error } = await supabase
        .from('post_analytics')
        .insert(postData);

      if (error) throw error;

      setShowAddModal(false);
      setFormData({
        platform: 'Twitter',
        tone: 'Professional',
        post_text: '',
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        posted_at: new Date().toISOString().split('T')[0]
      });
      fetchAnalytics();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post data');
    }
  };

  const stats = calculateStats();
  const platformPerformance = getPlatformPerformance();

  const renderShell = (children) => (
    <div style={pageStyles.page}>
      <div className="gradient-orb gradient-orb-1"></div>
      <div className="gradient-orb gradient-orb-2"></div>
      <div className="gradient-orb gradient-orb-3"></div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );

  if (loading) {
    return renderShell(
      <main style={pageStyles.content}>
        <div style={{ ...pageStyles.card, ...pageStyles.empty }}>
          <div style={{ color: '#F5C518', fontWeight: 800 }}>Loading analytics...</div>
        </div>
      </main>
    );
  }

  return renderShell(
    <>
      <main style={pageStyles.content}>
        <div style={pageStyles.header}>
          <div>
            <h1 style={pageStyles.title}>Analytics</h1>
            <p style={pageStyles.subtitle}>Track content performance across every platform.</p>
          </div>
          <button
            type="button"
            style={pageStyles.addButton}
            onClick={() => setShowAddModal(true)}
          >
            Add Post Performance
          </button>
        </div>

        <section style={pageStyles.statsGrid}>
          {[
            ['Total Posts', stats.totalPosts.toLocaleString()],
            ['Best Platform', stats.bestPlatform],
            ['Best Tone', stats.bestTone],
            ['Total Engagement', stats.totalEngagement.toLocaleString()]
          ].map(([label, value]) => (
            <div key={label} style={{ ...pageStyles.card, ...pageStyles.statCard }}>
              <div style={pageStyles.statLabel}>{label}</div>
              <div style={pageStyles.statValue}>{value}</div>
            </div>
          ))}
        </section>

        <section style={{ ...pageStyles.card, ...pageStyles.section }}>
          <h2 style={pageStyles.sectionTitle}>Platform Performance</h2>
          <div style={pageStyles.platformGrid}>
            {platformPerformance.map((platform) => (
              <div key={platform.name} style={pageStyles.platformCard}>
                <div style={pageStyles.platformTop}>
                  <span style={pageStyles.platformName}>{platform.name}</span>
                  <span style={pageStyles.platformValue}>{platform.engagement.toLocaleString()}</span>
                </div>
                <div style={pageStyles.progressTrack}>
                  <div
                    style={{
                      ...pageStyles.progressFill,
                      width: `${Math.max(platform.percentage, platform.engagement > 0 ? 4 : 0)}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ ...pageStyles.card, ...pageStyles.section }}>
          <h2 style={pageStyles.sectionTitle}>Recent Posts</h2>
          {analytics.length === 0 ? (
            <div style={pageStyles.empty}>No posts tracked yet. Add your first post performance to see insights.</div>
          ) : (
            <div style={pageStyles.tableWrap}>
              <table style={pageStyles.table}>
                <thead>
                  <tr>
                    <th style={pageStyles.th}>Platform</th>
                    <th style={pageStyles.th}>Post Preview</th>
                    <th style={pageStyles.th}>Likes</th>
                    <th style={pageStyles.th}>Comments</th>
                    <th style={pageStyles.th}>Shares</th>
                    <th style={pageStyles.th}>Views</th>
                    <th style={pageStyles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((post) => (
                    <tr key={post.id}>
                      <td style={pageStyles.td}>
                        <span style={pageStyles.platformPill}>{post.platform || 'Unknown'}</span>
                      </td>
                      <td style={{ ...pageStyles.td, maxWidth: '340px' }}>
                        {post.post_text
                          ? `${post.post_text.substring(0, 90)}${post.post_text.length > 90 ? '...' : ''}`
                          : 'No text'}
                      </td>
                      <td style={pageStyles.td}>{post.likes || 0}</td>
                      <td style={pageStyles.td}>{post.comments || 0}</td>
                      <td style={pageStyles.td}>{post.shares || 0}</td>
                      <td style={pageStyles.td}>{post.views || 0}</td>
                      <td style={pageStyles.td}>
                        {post.posted_at ? new Date(post.posted_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section style={{ ...pageStyles.card, ...pageStyles.section }}>
          <h2 style={pageStyles.sectionTitle}>Content Insights</h2>
          <div style={pageStyles.insightsGrid}>
            {[
              `Post more on ${stats.bestPlatform !== 'N/A' ? stats.bestPlatform : 'Twitter'} — it's your best platform.`,
              'Try posting in the morning for better engagement.',
              `${stats.bestTone !== 'N/A' ? stats.bestTone : 'Inspirational'} tone gets you the most engagement.`
            ].map((tip) => (
              <div key={tip} style={pageStyles.insightCard}>
                <span style={pageStyles.insightIcon}>💡</span>
                <p style={pageStyles.insightText}>{tip}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div style={pageStyles.modalCard} onClick={(event) => event.stopPropagation()}>
            <h2 style={{ ...pageStyles.sectionTitle, marginBottom: '20px' }}>Add Post Performance</h2>

            <div style={pageStyles.formGrid}>
              <div>
                <label style={pageStyles.label}>Platform</label>
                <select
                  value={formData.platform}
                  onChange={(event) => setFormData({ ...formData, platform: event.target.value })}
                  style={pageStyles.input}
                >
                  <option value="Twitter">Twitter</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Blog">Blog</option>
                </select>
              </div>
              <div>
                <label style={pageStyles.label}>Tone</label>
                <select
                  value={formData.tone}
                  onChange={(event) => setFormData({ ...formData, tone: event.target.value })}
                  style={pageStyles.input}
                >
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Funny">Funny</option>
                  <option value="Inspirational">Inspirational</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <label style={pageStyles.label}>Post Text</label>
              <textarea
                value={formData.post_text}
                onChange={(event) => setFormData({ ...formData, post_text: event.target.value })}
                rows={4}
                placeholder="Paste your post content here..."
                style={{ ...pageStyles.input, resize: 'vertical' }}
              />
            </div>

            <div style={{ ...pageStyles.formGrid, marginTop: '14px' }}>
              {['likes', 'comments', 'shares', 'views'].map((field) => (
                <div key={field}>
                  <label style={pageStyles.label}>{field}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData[field]}
                    onChange={(event) => setFormData({ ...formData, [field]: event.target.value })}
                    style={pageStyles.input}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: '14px' }}>
              <label style={pageStyles.label}>Date Posted</label>
              <input
                type="date"
                value={formData.posted_at}
                onChange={(event) => setFormData({ ...formData, posted_at: event.target.value })}
                style={pageStyles.input}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#F0F0FF',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button type="button" onClick={handleSavePost} style={pageStyles.addButton}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Analytics;
