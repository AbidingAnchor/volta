import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function Navbar() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!isMounted) return;

      setSession(currentSession);

      if (currentSession?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, plan')
          .eq('id', currentSession.user.id)
          .single();

        if (isMounted) {
          setProfile(data || null);
        }
      } else {
        setProfile(null);
      }
    };

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (!currentSession) {
        setProfile(null);
      } else {
        loadSession();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    navigate('/auth');
  };

  const plan = (profile?.plan || 'free').toLowerCase();
  const displayName = profile?.full_name || session?.user?.user_metadata?.full_name || session?.user?.email || 'User';

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to={session ? '/dashboard' : '/'}>
          <span className="nav-logo-icon">⚡</span>
          <span className="nav-logo-text">Volta</span>
        </Link>
      </div>

      <div className="nav-links">
        {session ? (
          <>
            <div className="user-info">
              <span className="user-name">{displayName}</span>
              <span className={`user-plan ${plan}`}>{plan}</span>
            </div>
            <Link to="/calendar" className="nav-link">Calendar</Link>
            <Link to="/history" className="nav-link">History</Link>
            <Link to="/analytics" className="nav-link">Analytics</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <button onClick={handleSignOut} className="nav-link">Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <Link to="/auth" className="nav-link">Sign In</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
