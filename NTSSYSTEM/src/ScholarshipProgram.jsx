import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ScholarshipProgram = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const fadeElementsRef = useRef([]);
  const timelineItemsRef = useRef([]);

  // Theme toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setIsDarkMode(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--bg-card', '#1e293b');
      root.style.setProperty('--text-primary', '#e2e8f0');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--text-heading', '#ffffff');
      root.style.setProperty('--border-primary', '#1e293b');
    } else {
      root.style.setProperty('--bg-primary', '#f8fafc');
      root.style.setProperty('--bg-secondary', '#f1f5f9');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--text-heading', '#0f172a');
      root.style.setProperty('--border-primary', '#e2e8f0');
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    applyTheme(newDarkMode);
  };

  // Navigation handlers
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Scroll animations
  useEffect(() => {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    fadeElementsRef.current.forEach(el => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
      }
    });

    timelineItemsRef.current.forEach(el => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        timelineObserver.observe(el);
      }
    });

    return () => {
      fadeObserver.disconnect();
      timelineObserver.disconnect();
    };
  }, []);

  // Scholarship awards data
  const scholarshipAwards = [
    { range: "95-100% Marks", amount: "PKR 30,000" },
    { range: "91%-94% Marks", amount: "PKR 20,000" },
    { range: "85%-90% Marks", amount: "PKR 15,000" },
    { range: "80%-84% Marks", amount: "PKR 10,000" },
    { range: "76%-79% Marks", amount: "PKR 5,000" },
    { range: "70%-75% Marks", amount: "PKR 3,000" },
    { range: "60%-69% Marks", amount: "PKR 500" }
  ];

  // Timeline steps
  const timelineSteps = [
    { number: "1", title: "Coordination", description: "AZM.AIO contacts the school administration to confirm a test date." },
    { number: "2", title: "Permission & Registration", description: "A formal permission letter is submitted. Eligible students are registered with names and roll numbers." },
    { number: "3", title: "Test Day", description: "A room is arranged by the school. The test is conducted fairly under joint supervision." },
    { number: "4", title: "Marking & Results", description: "Papers are marked transparently by the AZM.AIO team. Winners are decided based on marks and eligibility." },
    { number: "5", title: "Prize Ceremony", description: "Cash prizes and certificates are distributed after the institution's approval." },
    { number: "6", title: "Reporting", description: "A short report with the names of winners is shared with the school." }
  ];

  // FAQ items
  const faqItems = [
    {
      question: "Student Rules",
      answer: [
        "Students must arrive 15 minutes before the test.",
        "No unfair means (mobile, copying, etc.) are allowed.",
        "School uniform is preferred for discipline."
      ]
    },
    {
      question: "School Responsibilities",
      answer: [
        "The school must grant written permission on official letterhead.",
        "Two responsible teachers must be assigned to coordinate with the AZM.AIO team.",
        "School management must ensure discipline and silence in the test area.",
        "The school must provide a safe and suitable place for the prize ceremony."
      ]
    },
    {
      question: "AZM.AIO Rights & Policies",
      answer: [
        "AZM.AIO reserves the right to disqualify any student found cheating.",
        "The decision of the AZM.AIO Board of Directors shall be final.",
        "AZM.AIO will directly manage all funds, receipts, and distributions."
      ]
    },
    {
      question: "Communication Protocol",
      answer: [
        "All official communication will be handled through the principal or nominated coordinator.",
        "In case of any issue, school administration can contact the director directly."
      ]
    }
  ];

  // Inline styles object
  const styles = {
    container: {
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      minHeight: '100vh',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    },
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      backdropFilter: 'blur(8px)',
      backgroundColor: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-primary)'
    },
    card: {
      backgroundColor: 'var(--bg-card)',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      border: '1px solid var(--border-primary)'
    },
    buttonPrimary: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 500,
      transition: 'background-color 0.2s ease'
    },
    buttonSecondary: {
      backgroundColor: 'var(--bg-card)',
      color: 'var(--text-primary)',
      padding: '8px 16px',
      borderRadius: '6px',
      border: '1px solid var(--border-primary)',
      cursor: 'pointer',
      fontWeight: 500,
      transition: 'all 0.2s ease'
    },
    timelineItem: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '32px',
      position: 'relative'
    },
    timelineCircle: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#2563eb',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      flexShrink: 0,
      marginRight: '16px',
      position: 'relative',
      zIndex: 2
    },
    timelineLine: {
      position: 'absolute',
      left: '20px',
      top: '40px',
      bottom: '-32px',
      width: '2px',
      backgroundColor: '#2563eb',
      zIndex: 1
    },
    faqItem: {
      borderBottom: '1px solid var(--border-primary)',
      padding: '16px 0'
    },
    faqSummary: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      listStyle: 'none',
      padding: '8px 0'
    },
    faqContent: {
      paddingTop: '12px',
      paddingLeft: '16px'
    },
    gradientText: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
            <button 
              onClick={() => handleNavigation("/")}
              style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <div style={{ width: '32px', height: '32px', color: '#2563eb', marginRight: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v.75m-3-12l3-3m0 0l3 3m-3-3v12.75" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21.75l1.541-1.541a1.5 1.5 0 012.122 0l1.54 1.541M9.75 21.75V19.5M14.25 21.75V19.5m0 0a3 3 0 00-3-3h-3a3 3 0 00-3 3m12 0v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a3.375 3.375 0 00-3.375 3.375V19.5m3.375 0h3.375M3 3.375C3 2.613 3.613 2 4.375 2h15.25C20.387 2 21 2.613 21 3.375v1.5C21 5.613 20.387 6.25 19.625 6.25H4.375C3.613 6.25 3 5.613 3 4.875v-1.5z" />
                </svg>
              </div>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-heading)' }}>AZM.AIO</span>
            </button>

            <nav style={{ display: window.innerWidth > 768 ? 'flex' : 'none', alignItems: 'center', gap: '24px' }}>
              <button 
                onClick={() => handleNavigation("/")}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: location.pathname === '/' ? '#2563eb' : 'var(--text-secondary)',
                  fontWeight: 500
                }}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation("/about")}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: location.pathname === '/about' ? '#2563eb' : 'var(--text-secondary)',
                  fontWeight: 500
                }}
              >
                About
              </button>
              <button 
                onClick={() => handleNavigation("/scholarship-program")}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: location.pathname === '/scholarship-program' ? '#2563eb' : 'var(--text-secondary)',
                  fontWeight: 500
                }}
              >
                Scholarship Program
              </button>
              <button 
                onClick={() => handleNavigation("/contact")}
                style={styles.buttonPrimary}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                Contact
              </button>
              <button 
                onClick={toggleTheme}
                style={{
                  background: 'var(--bg-secondary)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </nav>

            <div style={{ display: window.innerWidth <= 768 ? 'flex' : 'none', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={toggleTheme}
                style={{
                  background: 'var(--bg-secondary)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '8px'
                }}
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{ 
            padding: '16px',
            borderTop: '1px solid var(--border-primary)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => handleNavigation("/")}
                style={{ 
                  textAlign: 'left',
                  padding: '12px',
                  borderRadius: '6px',
                  background: location.pathname === '/' ? 'var(--bg-secondary)' : 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation("/about")}
                style={{ 
                  textAlign: 'left',
                  padding: '12px',
                  borderRadius: '6px',
                  background: location.pathname === '/about' ? 'var(--bg-secondary)' : 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                About
              </button>
              <button 
                onClick={() => handleNavigation("/scholarship-program")}
                style={{ 
                  textAlign: 'left',
                  padding: '12px',
                  borderRadius: '6px',
                  background: location.pathname === '/scholarship-program' ? 'var(--bg-secondary)' : 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer'
                }}
              >
                Scholarship Program
              </button>
              <button 
                onClick={() => handleNavigation("/contact")}
                style={{ 
                  ...styles.buttonPrimary,
                  marginTop: '8px',
                  textAlign: 'center'
                }}
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section style={{
          padding: '96px 16px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)'
        }}>
          <div 
            ref={el => fadeElementsRef.current[0] = el}
            style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}
          >
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px' }}>
              <span style={styles.gradientText}>Scholarship Program</span>
            </h1>
            <p style={{ 
              maxWidth: '600px', 
              margin: '0 auto',
              fontSize: '18px', 
              color: 'var(--text-secondary)' 
            }}>
              Our complete process, from registration and testing to scholarship awards.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 16px' }}>
          {/* Scholarship Awards Section */}
          <section 
            id="awards" 
            ref={el => fadeElementsRef.current[1] = el}
            style={{ marginBottom: '96px', maxWidth: '800px', margin: '0 auto 96px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-heading)' }}>
                Scholarship Awards
              </h2>
              <p style={{ 
                maxWidth: '600px', 
                margin: '0 auto',
                fontSize: '18px', 
                color: 'var(--text-secondary)' 
              }}>
                Cash scholarships are awarded based on the student's performance in the written test. A minimum of 60% is required to pass.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {scholarshipAwards.map((award, index) => (
                <div key={index} style={{
                  ...styles.card,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <span style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-heading)' }}>
                    {award.range}
                  </span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
                    {award.amount}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Program Criteria Section */}
          <section 
            id="criteria" 
            ref={el => fadeElementsRef.current[2] = el}
            style={{ marginBottom: '96px', maxWidth: '1000px', margin: '0 auto 96px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-heading)' }}>
                Program Criteria
              </h2>
              <p style={{ 
                maxWidth: '600px', 
                margin: '0 auto',
                fontSize: '18px', 
                color: 'var(--text-secondary)' 
              }}>
                Our program is designed to be inclusive while prioritizing students who need help the most.
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, 1fr)' : '1fr',
              gap: '32px'
            }}>
              <div style={styles.card}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-heading)' }}>
                  Eligibility
                </h3>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '0', listStyle: 'none' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ color: '#2563eb', marginRight: '8px', flexShrink: 0 }}>✓</span>
                    <span>Students from grades 6-12.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#2563eb', marginRight: '8px', flexShrink: 0 }}>✓</span>
                    <span>Participants must be from selected institutions.</span>
                  </li>
                </ul>
              </div>

              <div style={styles.card}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-heading)' }}>
                  Priority
                </h3>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '0', listStyle: 'none' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ color: '#2563eb', marginRight: '8px', flexShrink: 0 }}>✓</span>
                    <span>Orphan, needy, or high IQ students.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#2563eb', marginRight: '8px', flexShrink: 0 }}>✓</span>
                    <span>Financially challenged students are given priority.</span>
                  </li>
                </ul>
              </div>

              <div style={styles.card}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-heading)' }}>
                  Selection
                </h3>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '0', listStyle: 'none' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ color: '#2563eb', marginRight: '8px', flexShrink: 0 }}>✓</span>
                    <span>Based on academic merit & financial need.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#2563eb', marginRight: '8px', flexShrink: 0 }}>✓</span>
                    <span>Final selection via test score + school/BOD verification.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Process Timeline Section */}
          <section 
            id="process" 
            ref={el => fadeElementsRef.current[3] = el}
            style={{ 
              marginBottom: '96px',
              background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '32px' }}>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
                gap: '48px',
                alignItems: 'center',
                maxWidth: '1000px',
                margin: '0 auto'
              }}>
                <div>
                  <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '24px', color: 'var(--text-heading)' }}>
                    How the Test Works
                  </h2>
                  <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                    We coordinate directly with institutions to ensure a fair, transparent, and smooth process for everyone involved.
                  </p>
                </div>

                <div style={{ position: 'relative' }}>
                  {timelineSteps.map((step, index) => (
                    <div 
                      key={index}
                      ref={el => timelineItemsRef.current[index] = el}
                      style={styles.timelineItem}
                    >
                      {index < timelineSteps.length - 1 && <div style={styles.timelineLine}></div>}
                      <div style={styles.timelineCircle}>{step.number}</div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-heading)' }}>
                          {step.title}
                        </h4>
                        <p style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Rules & FAQ Section */}
          <section 
            id="rules" 
            ref={el => fadeElementsRef.current[4] = el}
            style={{ marginBottom: '96px', maxWidth: '800px', margin: '0 auto' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-heading)' }}>
                Rules & Discipline
              </h2>
              <p style={{ 
                maxWidth: '600px', 
                margin: '0 auto',
                fontSize: '18px', 
                color: 'var(--text-secondary)' 
              }}>
                To ensure a fair and orderly process, all participants and institutions must adhere to the following rules.
              </p>
            </div>

            <div>
              {faqItems.map((faq, index) => (
                <div key={index} style={styles.faqItem}>
                  <details style={{ border: 'none' }}>
                    <summary style={styles.faqSummary}>
                      <span style={{ fontSize: '18px', fontWeight: '600' }}>{faq.question}</span>
                      <span style={{ transition: 'transform 0.2s ease' }}>▼</span>
                    </summary>
                    <div style={styles.faqContent}>
                      <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px' }}>
                        {faq.answer.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section 
            ref={el => fadeElementsRef.current[5] = el}
            style={{
              borderRadius: '8px',
              padding: '48px 32px',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr' : '1fr',
              gap: '48px',
              alignItems: 'center',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              <div style={{ textAlign: window.innerWidth > 1024 ? 'left' : 'center' }}>
                <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px' }}>
                  <span style={styles.gradientText}>Ready to Make a Difference?</span>
                </h2>
                <p style={{ fontSize: '18px', marginBottom: '32px', color: 'var(--text-secondary)' }}>
                  Whether you're a student ready to prove your merit or a school that shares our vision, we want to hear from you.
                </p>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: window.innerWidth > 640 ? 'row' : 'column',
                  gap: '16px',
                  justifyContent: window.innerWidth > 1024 ? 'flex-start' : 'center'
                }}>
                  <button 
                    onClick={() => handleNavigation("/contact")}
                    style={styles.buttonPrimary}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                  >
                    Register for Test
                  </button>
                  <button 
                    onClick={() => handleNavigation("/contact")}
                    style={styles.buttonSecondary}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'var(--bg-primary)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'var(--bg-card)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Partner Your School
                  </button>
                </div>
              </div>

              <div style={{ 
                position: 'relative', 
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%2394a3b8%22%3E%3Cpath d=%22M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0 2c-2.5 0-7 1.25-7 3.75V20h14v-2.25c0-2.5-4.5-3.75-7-3.75Z%22/%3E%3C/svg%3E")',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  border: '4px solid var(--bg-card)',
                  position: 'absolute',
                  right: '50%',
                  transform: 'translateX(80px)'
                }} />
                <div style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%2394a3b8%22%3E%3Cpath d=%22M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0 2c-2.5 0-7 1.25-7 3.75V20h14v-2.25c0-2.5-4.5-3.75-7-3.75Z%22/%3E%3C/svg%3E")',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  border: '4px solid var(--bg-card)',
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-80px)'
                }} />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ marginTop: '96px' }} id="contact">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 16px' }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, 1fr)' : '1fr',
            gap: '48px'
          }}>
            <div>
              <h4 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-heading)' }}>
                AZM.AIO
              </h4>
              <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
                Independent, fair, and transparent — funded by AZM Group of Companies, not donations.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <a href="#" style={{ color: 'var(--text-secondary)' }}>𝕏</a>
                <a href="#" style={{ color: 'var(--text-secondary)' }}>f</a>
                <a href="mailto:azmgoc30@gmail.com" style={{ color: 'var(--text-secondary)' }}>✉</a>
                <a href="tel:+923051755551" style={{ color: 'var(--text-secondary)' }}>📞</a>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-heading)' }}>
                Contact
              </h5>
              <ul style={{ color: 'var(--text-secondary)', listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="mailto:azmgoc30@gmail.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    azmgoc30@gmail.com
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="tel:+923051755551" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    +92-305-1755551
                  </a>
                </li>
                <li>
                  Head Office: Jadoon Public High School & College, Gandhian, Mansehra
                </li>
              </ul>
            </div>

            <div>
              <h5 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-heading)' }}>
                Quick Links
              </h5>
              <ul style={{ color: 'var(--text-secondary)', listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <button 
                    onClick={() => handleNavigation("/")}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-secondary)', 
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left'
                    }}
                  >
                    Home
                  </button>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <button 
                    onClick={() => handleNavigation("/about")}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-secondary)', 
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left'
                    }}
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation("/contact")}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-secondary)', 
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left'
                    }}
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{ 
          padding: '24px 16px',
          textAlign: 'center',
          borderTop: '1px solid var(--border-primary)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '14px' }}>
            © 2025 AZM.AIO — All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ScholarshipProgram;