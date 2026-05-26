import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../App.css';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);

  useEffect(() => {
    const fetchScheduledPosts = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      console.log('User ID:', user?.id);
      console.log('User:', user);
      
      if (user) {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
        
        console.log('=== Calendar Fetch Query ===');
        console.log('Table: scheduled_posts');
        console.log('Filter: user_id =', user.id);
        console.log('Date range:', startOfMonth.toISOString(), 'to', startOfNextMonth.toISOString());
        console.log('Column used: scheduled_at');
        
        const { data, error } = await supabase
          .from('scheduled_posts')
          .select('*')
          .eq('user_id', user.id)
          .gte('scheduled_at', startOfMonth.toISOString())
          .lt('scheduled_at', startOfNextMonth.toISOString())
          .order('scheduled_at', { ascending: true });
        
        console.log('=== Supabase Response ===');
        console.log('Error:', error);
        console.log('Data:', data);
        console.log('Data length:', data?.length || 0);
        
        if (error) {
          console.error('Error fetching scheduled posts:', error);
        } else {
          console.log('Fetched scheduled posts count:', data?.length || 0);
          if (data && data.length > 0) {
            console.log('First post structure:', data[0]);
            console.log('First post scheduled_at:', data[0].scheduled_at);
          }
          setScheduledPosts(data || []);
        }

        // Fetch upcoming posts (next 5)
        console.log('=== Upcoming Posts Query ===');
        const { data: upcomingData, error: upcomingError } = await supabase
          .from('scheduled_posts')
          .select('*')
          .eq('user_id', user.id)
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(5);

        console.log('Upcoming posts response:', { data: upcomingData, error: upcomingError });
        
        if (!upcomingError && upcomingData) {
          console.log('Upcoming posts count:', upcomingData.length);
          setUpcomingPosts(upcomingData);
        }
      } else {
        console.log('No user found');
        setScheduledPosts([]);
        setUpcomingPosts([]);
      }
      setLoading(false);
    };

    fetchScheduledPosts();
  }, [currentDate]);

  const handleDeletePost = async (postId) => {
    const { error } = await supabase
      .from('scheduled_posts')
      .delete()
      .eq('id', postId);

    if (!error) {
      setUpcomingPosts(upcomingPosts.filter(post => post.id !== postId));
      // Refresh calendar posts too
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        
        const { data } = await supabase
          .from('scheduled_posts')
          .select('*')
          .eq('user_id', user.id)
          .gte('scheduled_at', startOfMonth.toISOString())
          .lt('scheduled_at', startOfNextMonth.toISOString())
          .order('scheduled_at', { ascending: true });
        
        if (data) {
          setScheduledPosts(data);
        }
      }
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getPostsForDay = (day) => {
    if (!day) return [];
    const posts = scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduled_at);
      const match = postDate.toDateString() === day.toDateString();
      if (match) {
        console.log('Matched post:', post, 'for day:', day);
      }
      return match;
    });
    console.log('Posts for day', day, ':', posts);
    return posts;
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      twitter: '🐦',
      linkedin: '💼',
      instagram: '�',
      facebook: '📘',
      email: '✉️'
    };
    return icons[platform] || '📝';
  };

  const getPlatformColor = (platform) => {
    const colors = {
      twitter: '#1DA1F2',
      linkedin: '#0077B5',
      instagram: '#8B5CF6',
      facebook: '#1877F2',
      email: '#22C55E'
    };
    return colors[platform] || '#ffffff';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDayClick = (day) => {
    const posts = getPostsForDay(day);
    if (posts.length > 0) {
      setSelectedDay(day);
      setShowDayModal(true);
    }
  };

  const handleCopyContent = (content) => {
    navigator.clipboard.writeText(content);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);

  return (
    <div className="calendar-page">
      <div className="gradient-orb gradient-orb-1"></div>
      <div className="gradient-orb gradient-orb-2"></div>
      <div className="gradient-orb gradient-orb-3"></div>
      <Navbar />

      <main className="calendar-main">
        <div className="calendar-container">
          <div className="calendar-header">
            <button onClick={() => navigateMonth(-1)} className="calendar-nav-pill">
              ←
            </button>
            <h1 className="calendar-title">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
            <button onClick={() => navigateMonth(1)} className="calendar-nav-pill">
              →
            </button>
          </div>

          <div className="calendar-grid">
            {dayNames.map(day => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}
            
            {days.map((day, index) => {
              const posts = getPostsForDay(day);
              const isToday = day && new Date().toDateString() === day.toDateString();
              const hasPosts = posts.length > 0;
              
              return (
                <div
                  key={index}
                  className={`calendar-day ${!day ? 'empty' : ''} ${isToday ? 'today' : ''} ${hasPosts ? 'has-posts' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  {day && (
                    <>
                      <span className="calendar-day-number">{day.getDate()}</span>
                      <div className="calendar-posts">
                        {posts.map(post => (
                          <div 
                            key={post.id} 
                            className="calendar-post-dot"
                            style={{ backgroundColor: getPlatformColor(post.platform) }}
                            title={`${post.platform}: ${post.content.substring(0, 50)}...`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {loading && (
            <div className="calendar-loading">
              <div className="spinner"></div>
            </div>
          )}
        </div>

        {upcomingPosts.length > 0 && (
          <div className="upcoming-posts-section">
            <h2 className="upcoming-posts-title">⚡ Upcoming Posts</h2>
            <div className="upcoming-posts-grid">
              {upcomingPosts.map(post => (
                <div 
                  key={post.id} 
                  className="upcoming-post-card"
                  style={{ borderLeftColor: getPlatformColor(post.platform) }}
                >
                  <div className="upcoming-post-header">
                    <div className="upcoming-post-platform">
                      <span className="upcoming-post-icon">{getPlatformIcon(post.platform)}</span>
                      <span className="upcoming-post-platform-name">{post.platform}</span>
                    </div>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="upcoming-post-delete"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="upcoming-post-date">
                    {formatDate(post.scheduled_at)}
                  </div>
                  <div className="upcoming-post-content">
                    {post.content.substring(0, 100)}{post.content.length > 100 ? '...' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showDayModal && selectedDay && (
          <div className="modal-overlay" onClick={() => setShowDayModal(false)}>
            <div className="modal-content day-detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {selectedDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
                <button 
                  onClick={() => setShowDayModal(false)}
                  className="modal-close"
                >
                  ✕
                </button>
              </div>
              <div className="day-posts-list">
                {getPostsForDay(selectedDay).map(post => (
                  <div key={post.id} className="day-post-card">
                    <div className="day-post-header">
                      <div className="day-post-platform">
                        <span className="day-post-icon">{getPlatformIcon(post.platform)}</span>
                        <span className="day-post-platform-name">{post.platform}</span>
                      </div>
                      <div className="day-post-actions">
                        <button 
                          onClick={() => handleCopyContent(post.content)}
                          className="day-post-copy"
                          title="Copy content"
                        >
                          📋
                        </button>
                        <button 
                          onClick={() => {
                            handleDeletePost(post.id);
                            setShowDayModal(false);
                          }}
                          className="day-post-delete"
                          title="Delete post"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="day-post-time">
                      {formatDate(post.scheduled_at)}
                    </div>
                    <div className="day-post-content">
                      {post.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Calendar;
