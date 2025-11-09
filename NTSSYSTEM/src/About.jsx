import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const fadeElementsRef = useRef([]);
  const timelineItemsRef = useRef([]);

  // Theme functionality
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setIsDarkMode(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    applyTheme(newTheme);
  };

  // Navigation
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Scroll animations
  useEffect(() => {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    fadeElementsRef.current.forEach(el => {
      if (el) fadeObserver.observe(el);
    });

    timelineItemsRef.current.forEach(el => {
      if (el) timelineObserver.observe(el);
    });

    return () => {
      fadeObserver.disconnect();
      timelineObserver.disconnect();
    };
  }, []);

  const addToFadeRefs = (el) => {
    if (el && !fadeElementsRef.current.includes(el)) {
      fadeElementsRef.current.push(el);
    }
  };

  const addToTimelineRefs = (el) => {
    if (el && !timelineItemsRef.current.includes(el)) {
      timelineItemsRef.current.push(el);
    }
  };

  // Inline styles
  const styles = {
    main: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: isDarkMode ? '#111827' : '#ffffff',
      color: isDarkMode ? '#f9fafb' : '#111827',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      minHeight: '100vh'
    },
    header: {
      backdropFilter: 'blur(20px)',
      backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%'
    },
    textPrimary: {
      color: isDarkMode ? '#f9fafb' : '#111827'
    },
    textSecondary: {
      color: isDarkMode ? '#d1d5db' : '#6b7280'
    },
    textHeading: {
      color: isDarkMode ? '#f9fafb' : '#111827'
    },
    textLink: {
      color: isDarkMode ? '#60a5fa' : '#2563eb'
    },
    bgPrimary: {
      backgroundColor: isDarkMode ? '#111827' : '#ffffff'
    },
    bgSecondary: {
      backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb'
    },
    bgCard: {
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff'
    },
    borderSecondary: {
      borderColor: isDarkMode ? '#374151' : '#e5e7eb'
    },
    button: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '14px'
    },
    card: {
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
    },
    gradientText: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }
  };

  return (
    <div style={styles.main}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
            
            {/* Logo */}
            <button 
              onClick={() => handleNavigation('/')}
              style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <svg style={{ height: '32px', width: '32px', color: '#3b82f6', marginRight: '8px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v.75m-3-12l3-3m0 0l3 3m-3-3v12.75" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21.75l1.541-1.541a1.5 1.5 0 012.122 0l1.54 1.541M9.75 21.75V19.5M14.25 21.75V19.5m0 0a3 3 0 00-3-3h-3a3 3 0 00-3 3m12 0v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a3.375 3.375 0 00-3.375 3.375V19.5m3.375 0h3.375M3 3.375C3 2.613 3.613 2 4.375 2h15.25C20.387 2 21 2.613 21 3.375v1.5C21 5.613 20.387 6.25 19.625 6.25H4.375C3.613 6.25 3 5.613 3 4.875v-1.5z" />
              </svg>
              <span style={{ fontSize: '24px', fontWeight: 'bold', ...styles.textHeading }}>AZM.AIO</span>
            </button>
            
            {/* Desktop Navigation */}
            <nav style={{ display: 'none', alignItems: 'center', gap: '24px' }}>
              <button 
                onClick={() => handleNavigation('/')}
                style={{ background: 'none', border: 'none', fontWeight: '500', fontSize: '16px', cursor: 'pointer', ...styles.textSecondary }}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation('/about')}
                style={{ background: 'none', border: 'none', fontWeight: '500', fontSize: '16px', cursor: 'pointer', ...styles.textSecondary }}
              >
                About
              </button>
              <button 
                onClick={() => handleNavigation('/scholarship-program')}
                style={{ background: 'none', border: 'none', fontWeight: '500', fontSize: '16px', cursor: 'pointer', ...styles.textSecondary }}
              >
                Scholarship Program
              </button>
              <button 
                onClick={() => handleNavigation('/contact')}
                style={styles.button}
              >
                Contact
              </button>
              <button 
                onClick={toggleTheme}
                style={{ background: 'none', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', ...styles.textSecondary }}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </nav>
            
            {/* Mobile Menu Button */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={toggleTheme}
                style={{ background: 'none', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', ...styles.textSecondary }}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', ...styles.textSecondary }}
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{ padding: '8px 16px', borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}` }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => handleNavigation('/')}
                style={{ background: 'none', border: 'none', padding: '12px', textAlign: 'left', cursor: 'pointer', ...styles.textPrimary }}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation('/about')}
                style={{ background: 'none', border: 'none', padding: '12px', textAlign: 'left', cursor: 'pointer', ...styles.textPrimary }}
              >
                About
              </button>
              <button 
                onClick={() => handleNavigation('/scholarship-program')}
                style={{ background: 'none', border: 'none', padding: '12px', textAlign: 'left', cursor: 'pointer', ...styles.textPrimary }}
              >
                Scholarship Program
              </button>
              <button 
                onClick={() => handleNavigation('/contact')}
                style={{ ...styles.button, marginTop: '8px', textAlign: 'center' }}
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* Page Header */}
        <section style={{ padding: '96px 16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px' }}>
              <span style={styles.gradientText}>About AZM.AIO</span>
            </h1>
            <p style={{ maxWidth: '672px', margin: '0 auto', fontSize: '20px', ...styles.textSecondary }}>
              We help needy, orphan, and deserving students continue studies through self‑funded merit scholarships.
            </p>
          </div>
        </section>
        
        {/* Main Page Layout */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px 64px' }}>
          
          {/* Section: Who We Are */}
          <section style={{ marginBottom: '96px', ...styles.card }} ref={addToFadeRefs}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px', alignItems: 'center' }}>
              {/* Text Content */}
              <div>
                <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '24px', ...styles.textHeading }}>
                  Who We Are
                </h2>
                <p style={{ fontSize: '18px', ...styles.textSecondary }}>
                  AZM.AIO was born from a simple idea: to create a fair, self-reliant platform that directly supports students who have the merit but lack the means.
                </p>
              </div>
              
              {/* Timeline */}
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '32px' }} ref={addToTimelineRefs}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '16px', flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', ...styles.textHeading }}>Our Founding</h4>
                    <p style={styles.textSecondary}>AZM.AIO is a self-funded educational scholarship program founded by Sumama Khan under AZM Group of Companies.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }} ref={addToTimelineRefs}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '16px', flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', ...styles.textHeading }}>Our Goal</h4>
                    <p style={styles.textSecondary}>The main goal is to support needy, orphan, and deserving students in remote areas of Pakistan through merit-based scholarships.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Our Objectives */}
          <section style={{ marginBottom: '96px', maxWidth: '672px', margin: '0 auto 96px' }} ref={addToFadeRefs}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px', ...styles.textHeading }}>Our Objectives</h2>
              <p style={{ fontSize: '18px', ...styles.textSecondary }}>
                The key goals that drive our program's operations and long-term vision.
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Objective Items */}
              {[
                { title: 'Identify Talent', desc: 'Identify deserving and talented students in remote and low-income areas.' },
                { title: 'Conduct Fair Tests', desc: 'Conduct fair and transparent scholarship tests in schools and colleges.' },
                { title: 'Provide Support', desc: 'Provide cash scholarships and study support to high achievers.' },
                { title: 'Promote Motivation', desc: 'Promote educational motivation and a spirit of competition among students.' },
                { title: 'Strengthen Community', desc: 'Strengthen collaboration with educational institutions for long-term community benefit.' }
              ].map((obj, index) => (
                <div key={index} style={styles.card}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', ...styles.textHeading }}>{obj.title}</h3>
                  <p style={styles.textSecondary}>{obj.desc}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Section: Leadership Message */}
          <section style={{ marginBottom: '96px' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }} ref={addToFadeRefs}>
              <h2 style={{ fontSize: '36px', fontWeight: '800', ...styles.textHeading }}>Leadership Message</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '672px', margin: '0 auto' }}>
              {/* Director 1 */}
              <div style={styles.card} ref={addToFadeRefs}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', ...styles.textSecondary }}>
                    Photo
                  </div>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', ...styles.textHeading }}>Mr. Sumama Khan</h3>
                    <p style={{ color: '#3b82f6', fontWeight: '500' }}>Founder & Director General - AZM.AIO</p>
                  </div>
                </div>
                <blockquote style={{ fontSize: '20px', fontStyle: 'italic', marginBottom: '24px', ...styles.textPrimary }}>
                  "That dream became reality in the form of AZM.AIO... This program is not supported by donations or sponsors it is powered by faith, effort, and the desire to give back what I once received."
                </blockquote>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', ...styles.textSecondary }}>
                  <p>Dear Principals, Teachers, and Students,</p>
                  <p>Being a child from middle-class family, I used to notice that after paying my school fees or buying me books, there was nothing left with my parents. They sacrificed their own comfort, their savings, and even their small dreams so that I could study in good institutions.</p>
                  <p>Through AZM.AIO, I want every deserving student to know that their background does not define their future. With opportunity, guidance, and belief, any child can rise and make a difference.</p>
                </div>
              </div>
              
              {/* Director 2 */}
              <div style={styles.card} ref={addToFadeRefs}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', ...styles.textSecondary }}>
                    Photo
                  </div>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', ...styles.textHeading }}>Mrs. Iram Zeb</h3>
                    <p style={{ color: '#3b82f6', fontWeight: '500' }}>Co-Founder & Executive Director - AZM.AIO</p>
                  </div>
                </div>
                <blockquote style={{ fontSize: '20px', fontStyle: 'italic', marginBottom: '24px', ...styles.textPrimary }}>
                  "Together, we are not just giving scholarships we are building futures."
                </blockquote>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', ...styles.textSecondary }}>
                  <p>Dear Educators and Students,</p>
                  <p>Education is a light that removes darkness, and every child deserves to live under that light. At AZM.AIO, we believe that no dream should end just because of financial hardship.</p>
                  <p>As the Executive Director, I feel proud to work alongside a dedicated team that truly believes in fairness, honesty, and service to humanity.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pull-quote */}
          <section style={{ marginBottom: '96px', ...styles.card, textAlign: 'center' }} ref={addToFadeRefs}>
            <blockquote style={{ maxWidth: '672px', margin: '0 auto', padding: '40px 0' }}>
              <span style={{ fontSize: '48px', fontWeight: 'bold', ...styles.gradientText }}>"</span>
              <p style={{ fontSize: '24px', fontWeight: '600', margin: '16px 0', ...styles.textHeading }}>
                Let's create a Pakistan where no child feels limited by money, and where talent is the true measure of success.
              </p>
              <span style={{ fontSize: '48px', fontWeight: 'bold', ...styles.gradientText }}>"</span>
              <footer style={{ marginTop: '24px' }}>
                <span style={{ fontWeight: '500', ...styles.textPrimary }}> — Mr. Sumama Khan,</span>
                <span style={styles.textSecondary}> Founder & DG</span>
              </footer>
            </blockquote>
          </section>

          {/* Section: Core Values */}
          <section style={{ marginBottom: '96px', maxWidth: '896px', margin: '0 auto' }} ref={addToFadeRefs}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px', ...styles.textHeading }}>Our Core Values</h2>
              <p style={{ fontSize: '18px', ...styles.textSecondary }}>
                The principles that guide every decision we make.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {[
                { title: 'Self-reliance', desc: 'Funded entirely by AZM Group, not by donations.' },
                { title: 'Integrity', desc: 'A fair, unbiased, and transparent process for all students.' },
                { title: 'Equity', desc: 'Creating opportunities for students in remote regions.' },
                { title: 'Excellence', desc: 'Rewarding true academic merit through rigorous testing.' }
              ].map((value, index) => (
                <div key={index} style={{ ...styles.card, textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <span style={{ color: '#3b82f6', fontSize: '24px' }}>✓</span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', ...styles.textHeading }}>{value.title}</h3>
                  <p style={{ fontSize: '14px', ...styles.textSecondary }}>{value.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section style={{ ...styles.card, textAlign: 'center' }} ref={addToFadeRefs}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px', alignItems: 'center', maxWidth: '896px', margin: '0 auto' }}>
              <div>
                <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>
                  <span style={styles.gradientText}>Ready to Make a Difference?</span>
                </h2>
                <p style={{ fontSize: '18px', ...styles.textSecondary, marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
                  Whether you're a student ready to prove your merit or a school that shares our vision, we want to hear from you.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => handleNavigation('/scholarship-program')}
                    style={styles.button}
                  >
                    Register for Test
                  </button>
                  <button 
                    onClick={() => handleNavigation('/contact')}
                    style={{ ...styles.button, backgroundColor: 'transparent', color: styles.textPrimary.color, border: `1px solid ${styles.borderSecondary.borderColor}` }}
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ marginTop: '96px', ...styles.bgSecondary, padding: '64px 0 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px', marginBottom: '48px' }}>
            {/* Column 1 */}
            <div>
              <h4 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', ...styles.textHeading }}>AZM.AIO</h4>
              <p style={{ marginBottom: '24px', ...styles.textSecondary }}>
                Independent, fair, and transparent — funded by AZM Group of Companies, not donations.
              </p>
            </div>
            
            {/* Column 2 */}
            <div>
              <h5 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', ...styles.textHeading }}>Contact</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...styles.textSecondary }}>
                <div>azmgoc30@gmail.com</div>
                <div>+92-305-1755551</div>
                <div>Head Office: Jadoon Public High School & College, Gandhian, Mansehra</div>
              </div>
            </div>
            
            {/* Column 3 */}
            <div>
              <h5 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', ...styles.textHeading }}>Quick Links</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => handleNavigation('/')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', ...styles.textSecondary }}>Home</button>
                <button onClick={() => handleNavigation('/scholarship-program')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', ...styles.textSecondary }}>Scholarship Program</button>
                <button onClick={() => handleNavigation('/about')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', ...styles.textSecondary }}>About</button>
              </div>
            </div>
          </div>
          
          <div style={{ padding: '24px 0', borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`, textAlign: 'center', ...styles.textSecondary }}>
            © 2025 AZM.AIO — All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;