import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../App.css';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheduledPosts = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        
        const { data, error } = await supabase
          .from('scheduled_posts')
          .select('*')
          .eq('user_id', user.id)
          .gte('scheduled_date', startOfMonth.toISOString())
          .lt('scheduled_date', startOfNextMonth.toISOString())
          .order('scheduled_date', { ascending: true });
        
        if (error) {
          console.error('Error fetching scheduled posts:', error);
        } else if (data) {
          console.log('Fetched scheduled posts:', data);
          setScheduledPosts(data);
        }
      }
      setLoading(false);
    };

    fetchScheduledPosts();
  }, [currentDate]);

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
      const postDate = new Date(post.scheduled_date);
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
      twitter: '𝕏',
      linkedin: 'in',
      instagram: '📷',
      facebook: '📘',
      email: '✉️'
    };
    return icons[platform] || '📝';
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
      <header className="header">
        <div className="header-content">
          <Link to="/dashboard" className="logo">
            ⚡ Volta
          </Link>
          <nav className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/calendar" className="nav-link active">Calendar</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
          </nav>
        </div>
      </header>

      <main className="calendar-main">
        <div className="calendar-container">
          <div className="calendar-header">
            <button onClick={() => navigateMonth(-1)} className="calendar-nav-button">
              ← Previous
            </button>
            <h1 className="calendar-title">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
            <button onClick={() => navigateMonth(1)} className="calendar-nav-button">
              Next →
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
              
              return (
                <div
                  key={index}
                  className={`calendar-day ${!day ? 'empty' : ''} ${isToday ? 'today' : ''}`}
                >
                  {day && (
                    <>
                      <span className="calendar-day-number">{day.getDate()}</span>
                      <div className="calendar-posts">
                        {posts.map(post => (
                          <div key={post.id} className="calendar-post">
                            <span className="calendar-post-icon">{getPlatformIcon(post.platform)}</span>
                            <span className="calendar-post-preview">
                              {post.content.substring(0, 30)}...
                            </span>
                          </div>
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
      </main>
    </div>
  );
}

export default Calendar;
