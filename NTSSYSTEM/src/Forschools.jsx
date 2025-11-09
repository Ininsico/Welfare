import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ForSchools = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Partner schools data state
  const [partnerSchools, setPartnerSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for scroll animations
  const fadeElementsRef = useRef([]);
  const timelineItemsRef = useRef([]);

  // Apply theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Theme toggle handler
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Mobile menu toggle handler
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation handler
  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeElementsRef.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Timeline animation observer
  useEffect(() => {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    timelineItemsRef.current.forEach(el => {
      if (el) timelineObserver.observe(el);
    });

    return () => timelineObserver.disconnect();
  }, []);

  // Fetch partner schools data
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const API_URL = "https://script.google.com/macros/s/AKfycbyFqYJ6JNRl8MymsvZcWAH1NYtnIUZeNvX_2xVpyZ7OeH39307xuuENCrE4FS2Xj4/exec";
        const cacheBustURL = API_URL + "?v=" + new Date().getTime();
        
        const response = await fetch(cacheBustURL);
        if (!response.ok) {
          throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        const data = await response.json();

        setIsLoading(false);
        if (data && data.length > 0) {
          setPartnerSchools(data);
        } else {
          setError('No partner schools are currently listed. Check back soon!');
        }
      } catch (err) {
        console.error('Failed to fetch partner data:', err);
        setIsLoading(false);
        setError('');
      }
    };

    fetchPartners();
  }, []);

  // Generate school card component
  const SchoolCard = ({ school }) => {
    const logoUrl = school.logo || `https://placehold.co/400x300/e2e8f0/475569?text=${encodeURIComponent(school.name)}`;
    
    return (
      <div className="card flex flex-col rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-[1.03]">
        <img 
          className="h-48 w-full object-cover" 
          src={logoUrl} 
          alt={`${school.name} logo`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/400x300/e2e8f0/475569?text=Image+Error';
          }}
        />
        <div className="p-6 flex-grow">
          <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>{school.name}</h3>
          <p className="text-sm font-medium text-blue-500 mb-4">{school.city}</p>
        </div>
        <div className="p-6 pt-4 border-t border-[var(--border-secondary)]" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <h4 className="text-sm font-semibold uppercase text-[var(--text-secondary)] mb-3">Statistics</h4>
          <div className="flex justify-between text-center gap-4">
            <div>
              <span className="text-2xl font-bold block" style={{ color: 'var(--text-heading)' }}>{school.applied}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Applied</span>
            </div>
            <div>
              <span className="text-2xl font-bold block" style={{ color: 'var(--text-heading)' }}>{school.admitted || 0}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Admitted</span>
            </div>
            <div>
              <span className="text-2xl font-bold block" style={{ color: 'var(--text-heading)' }}>{school.awarded || 0}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Awarded</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Check if current route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="antialiased">
      {/* Header */}
      <header className="header sticky top-0 z-50 w-full backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <button 
              onClick={() => handleNavigation('/')}
              className="flex-shrink-0 flex items-center cursor-pointer"
            >
              <svg className="h-8 w-8 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v.75m-3-12l3-3m0 0l3 3m-3-3v12.75" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21.75l1.541-1.541a1.5 1.5 0 012.122 0l1.54 1.541M9.75 21.75V19.5M14.25 21.75V19.5m0 0a3 3 0 00-3-3h-3a3 3 0 00-3 3m12 0v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a3.375 3.375 0 00-3.375 3.375V19.5m3.375 0h3.375M3 3.375C3 2.613 3.613 2 4.375 2h15.25C20.387 2 21 2.613 21 3.375v1.5C21 5.613 20.387 6.25 19.625 6.25H4.375C3.613 6.25 3 5.613 3 4.875v-1.5z" />
              </svg>
              <span className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>AZM.AIO</span>
            </button>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:items-center md:space-x-6">
              <button 
                onClick={() => handleNavigation('/')}
                className={`font-medium text-base ${isActiveRoute('/') ? 'text-[var(--text-link)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-link)]'} transition-colors`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation('/about')}
                className={`font-medium text-base ${isActiveRoute('/about') ? 'text-[var(--text-link)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-link)]'} transition-colors`}
              >
                About
              </button>
              <button 
                onClick={() => handleNavigation('/scholarship-program')}
                className={`font-medium text-base ${isActiveRoute('/scholarship-program') ? 'text-[var(--text-link)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-link)]'} transition-colors`}
              >
                Scholarship Program
              </button>
              <button 
                onClick={() => handleNavigation('/for-schools')}
                className={`font-medium text-base ${isActiveRoute('/for-schools') ? 'text-[var(--text-link)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-link)]'} transition-colors`}
              >
                For Schools
              </button>
              <button 
                onClick={() => handleNavigation('/results')}
                className={`font-medium text-base ${isActiveRoute('/results') ? 'text-[var(--text-link)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-link)]'} transition-colors`}
              >
                Results
              </button>
              <button 
                onClick={() => handleNavigation('/gallery')}
                className={`font-medium text-base ${isActiveRoute('/gallery') ? 'text-[var(--text-link)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-link)]'} transition-colors`}
              >
                Gallery
              </button>
              <button 
                onClick={() => handleNavigation('/contact')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors transform hover:-translate-y-px"
              >
                Contact
              </button>
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="ml-2 p-2 rounded-full text-[var(--text-secondary)] bg-[var(--bg-secondary)] hover:text-[var(--text-link)] transition-colors"
              >
                {isDarkMode ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.95 14.536l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM1.293 4.293a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414L1.293 5.707a1 1 0 010-1.414zM4 10a1 1 0 01-1-1H2a1 1 0 110-2h1a1 1 0 011 1z" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                  </svg>
                )}
              </button>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-[var(--text-secondary)] bg-[var(--bg-secondary)] transition-colors"
              >
                {isDarkMode ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.95 14.536l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM1.293 4.293a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414L1.293 5.707a1 1 0 010-1.414zM4 10a1 1 0 01-1-1H2a1 1 0 110-2h1a1 1 0 011 1z" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                  </svg>
                )}
              </button>
              <button 
                onClick={toggleMobileMenu}
                className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors" 
                aria-controls="mobile-menu" 
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              onClick={() => handleNavigation('/')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('/about')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => handleNavigation('/scholarship-program')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Scholarship Program
            </button>
            <button 
              onClick={() => handleNavigation('/for-schools')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-link)] bg-[var(--bg-secondary)]"
            >
              For Schools
            </button>
            <button 
              onClick={() => handleNavigation('/results')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Results
            </button>
            <button 
              onClick={() => handleNavigation('/gallery')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Gallery
            </button>
            <button 
              onClick={() => handleNavigation('/contact')}
              className="mt-2 block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Page Header */}
        <section className="animated-bubbles-bg dot-pattern py-24 text-center relative overflow-hidden">
          <div className="bubbles">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
          <div 
            ref={el => fadeElementsRef.current[0] = el}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-fade-in visible relative z-10"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              <span className="gradient-headline">Partner With AZM.AIO</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl" style={{ color: 'var(--text-secondary)' }}>
              Join us in our mission to support deserving students and foster academic excellence at your institution.
            </p>
          </div>
        </section>
        
        {/* Main Page Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex-1 min-w-0">
            
            {/* Section: Why Partner With Us */}
            <section 
              id="why-partner" 
              ref={el => fadeElementsRef.current[1] = el}
              className="mb-24 scroll-fade-in max-w-5xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: 'var(--text-heading)' }}>
                  Benefits for Your Institution
                </h2>
                <p className="max-w-2xl mx-auto text-lg" style={{ color: 'var(--text-secondary)' }}>
                  Our program is designed to be a win-win, providing valuable opportunities for your students at zero cost to you.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Benefit 1 */}
                <div className="card p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-600/10">
                      <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-5.242M5.25 18.72a9.094 9.094 0 013.741-.479 3 3 0 013.741 5.242M5.25 18.72L5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v11.22M15 13.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>Support Your Students</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Provide financial aid to your needy, orphan, and deserving students.</p>
                </div>
                
                {/* Benefit 2 */}
                <div className="card p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-600/10">
                      <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5m-9 4.5v-4.5m9 0l-3-3m-3 3l-3-3m-3 3l3 3m6-3l3 3M3.75 6.75h16.5M3.75 6.75c0-1.519 1.231-2.75 2.75-2.75h11c1.519 0 2.75 1.231 2.75 2.75M3.75 6.75v4.5c0 1.519 1.231 2.75 2.75 2.75h11c1.519 0 2.75-1.231 2.75-2.75v-4.5" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>Promote Excellence</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Promote educational motivation and a healthy spirit of competition.</p>
                </div>
                
                {/* Benefit 3 */}
                <div className="card p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-600/10">
                      <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>Zero Cost & Admin</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>We are 100% self-funded. We manage all funds, materials, and marking.</p>
                </div>
                
                {/* Benefit 4 */}
                <div className="card p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-600/10">
                      <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>Build Partnership</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Strengthen collaboration for long-term community benefit.</p>
                </div>
              </div>
            </section>
            
            {/* Partner Schools Showcase Section */}
            <section 
              id="partners" 
              ref={el => fadeElementsRef.current[2] = el}
              className="mb-24 scroll-fade-in"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: 'var(--text-heading)' }}>
                  Meet Our Partner Institutions
                </h2>
                <p className="max-w-2xl mx-auto text-lg" style={{ color: 'var(--text-secondary)' }}>
                  We are proud to work with schools dedicated to providing fair opportunities for their students.
                </p>
              </div>
              
              {/* Grid for cards */}
              <div id="partner-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Loading State */}
                {isLoading && (
                  <p className="text-lg text-center md:col-span-2 lg:col-span-3" style={{ color: 'var(--text-secondary)' }}>
                    <svg className="animate-spin h-6 w-6 inline-block mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ color: 'var(--text-link)' }}>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading partner data...
                  </p>
                )}
                
                {/* Error State */}
                {error && (
                  <p className="text-lg text-center md:col-span-2 lg:col-span-3 text-red-500">{error}</p>
                )}
                
                {/* Partner Schools Cards */}
                {partnerSchools.map((school, index) => (
                  <SchoolCard key={index} school={school} />
                ))}
              </div>
            </section>

            {/* Section: Our Partnership Process (Timeline) */}
            <section 
              id="process" 
              ref={el => fadeElementsRef.current[3] = el}
              className="mb-24 scroll-fade-in animated-bubbles-bg relative overflow-hidden rounded-lg"
            >
              <div className="bubbles">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <div className="relative z-10 p-4 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                  {/* Left Column: Text */}
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-6" style={{ color: 'var(--text-heading)' }}>
                      Our Partnership Process
                    </h2>
                    <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                      We handle the heavy lifting. Our process is designed to be simple, professional, and require minimal overhead from your staff.
                    </p>
                  </div>
                  
                  {/* Right Column: Animated Timeline */}
                  <div className="relative">
                    {/* Step 1 */}
                    <div 
                      ref={el => timelineItemsRef.current[0] = el}
                      className="timeline-item scroll-fade-in delay-1"
                    >
                      <div className="timeline-line"></div>
                      <div className="timeline-circle">1</div>
                      <div className="timeline-content">
                        <h4 className="text-xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>Contact & Approval</h4>
                        <p style={{ color: 'var(--text-secondary)' }}>We contact your administration to confirm a date and submit a formal permission letter.</p>
                      </div>
                    </div>
                    {/* Step 2 */}
                    <div 
                      ref={el => timelineItemsRef.current[1] = el}
                      className="timeline-item scroll-fade-in delay-2"
                    >
                      <div className="timeline-line"></div>
                      <div className="timeline-circle">2</div>
                      <div className="timeline-content">
                        <h4 className="text-xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>Setup & Coordination</h4>
                        <p style={{ color: 'var(--text-secondary)' }}>Your school arranges a test room and assigns two teachers to coordinate with our team.</p>
                      </div>
                    </div>
                    {/* Step 3 */}
                    <div 
                      ref={el => timelineItemsRef.current[2] = el}
                      className="timeline-item scroll-fade-in delay-3"
                    >
                      <div className="timeline-line"></div>
                      <div className="timeline-circle">3</div>
                      <div className="timeline-content">
                        <h4 className="text-xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>Test & Marking</h4>
                        <p style={{ color: 'var(--text-secondary)' }}>We bring all materials and conduct the test. Our team marks all papers transparently.</p>
                      </div>
                    </div>
                    {/* Step 4 */}
                    <div 
                      ref={el => timelineItemsRef.current[3] = el}
                      className="timeline-item scroll-fade-in delay-4"
                    >
                      <div className="timeline-circle">4</div>
                      <div className="timeline-content">
                        <h4 className="text-xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>Awards & Reporting</h4>
                        <p style={{ color: 'var(--text-secondary)' }}>We host a prize ceremony and provide a final report of all winners for your records.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: School Responsibilities (Accordion) */}
            <section 
              id="rules" 
              ref={el => fadeElementsRef.current[4] = el}
              className="mb-24 scroll-fade-in faq-accordion max-w-3xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: 'var(--text-heading)' }}>
                  Your Role as a Partner
                </h2>
                <p className="max-w-2xl mx-auto text-lg" style={{ color: 'var(--text-secondary)' }}>
                  To ensure a fair and smooth event, we request the following from our partner institutions.
                </p>
              </div>
              <div>
                {/* Rule 1 */}
                <details>
                  <summary>
                    <span className="text-lg font-semibold">Before the Test</span>
                    <span className="faq-icon">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="faq-content">
                    <ul className="list-disc list-inside space-y-2">
                      <li>Grant written permission on official letterhead before the test date.</li>
                      <li>Assign two responsible teachers as school representatives to coordinate with the AZM.AIO team.</li>
                      <li>Handle all official communication through the principal or the nominated coordinator.</li>
                    </ul>
                  </div>
                </details>
                {/* Rule 2 */}
                <details>
                  <summary>
                    <span className="text-lg font-semibold">During the Test</span>
                    <span className="faq-icon">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="faq-content">
                    <ul className="list-disc list-inside space-y-2">
                      <li>Arrange a suitable room for the test.</li>
                      <li>Ensure discipline and silence in the test area.</li>
                      <li>School management may observe the test but cannot interfere in paper setting or checking.</li>
                      <li>No outsider other than AZM.AIO team or authorized school staff is allowed.</li>
                    </ul>
                  </div>
                </details>
                {/* Rule 3 */}
                <details>
                  <summary>
                    <span className="text-lg font-semibold">After the Test</span>
                    <span className="faq-icon">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="faq-content">
                    <ul className="list-disc list-inside space-y-2">
                      <li>Provide a safe and suitable place for the prize ceremony.</li>
                      <li>The principal or head is requested to attend and support the distribution event.</li>
                      <li>Keep a copy of the test attendance and result list for your records.</li>
                      <li>You may share the report or photos on your notice board or social media with credit to AZM.AIO.</li>
                    </ul>
                  </div>
                </details>
              </div>
            </section>

            {/* CTA Section */}
            <section 
              ref={el => fadeElementsRef.current[5] = el}
              className="scroll-fade-in rounded-lg p-8 md:p-12 cta-band" 
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                {/* Left: Text Content */}
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                    <span className="gradient-headline">Ready to Join Us?</span>
                  </h2>
                  <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-lg mx-auto lg:mx-0">
                    Let's work together to create opportunities for your students. Contact us today to schedule a test date.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                    <button 
                      onClick={() => handleNavigation('/contact')}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-md shadow-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105"
                    >
                      Contact Us to Partner
                    </button>
                    <button 
                      onClick={() => handleNavigation('/scholarship-program')}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-md text-base font-medium text-[var(--text-primary)] bg-[var(--bg-card)] shadow-sm border border-[var(--border-secondary)] hover:bg-[var(--bg-primary)] transition-all transform hover:scale-105"
                    >
                      View Program Details
                    </button>
                  </div>
                </div>
                
                {/* Right: Images */}
                <div className="relative h-48 lg:h-full flex justify-center items-center">
                  <img 
                    src="iram zeb.jpeg" 
                    alt="Mr. Iram Zeb" 
                    loading="lazy" 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-4 border-[var(--bg-card)] absolute right-1/2 translate-x-16 lg:right-auto lg:left-1/2 lg:-translate-x-10 z-10"
                  />
                  <img 
                    src="sumama khan.jpg" 
                    alt="Mr. Sumama Khan" 
                    loading="lazy" 
                    className="w-36 h-36 md:w-48 md:h-48 rounded-full object-cover shadow-lg border-4 border-[var(--bg-card)] absolute left-1/2 -translate-x-16 lg:left-0 lg:translate-x-0 z-20"
                  />
                </div>
              </div>
            </section>
            
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer mt-24" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Footer Column 1 */}
            <div>
              <h4 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-heading)' }}>AZM.AIO</h4>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                Independent, fair, and transparent — funded by AZM Group of Companies, not donations.
              </p>
              <div className="flex space-x-4">
                <button className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors" aria-label="X (formerly Twitter)">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                <button className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors" aria-label="Facebook">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={() => window.location.href = 'mailto:azmgoc30@gmail.com'}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors" 
                  aria-label="Email"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 19h18a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1zM5 8h14v2l-6.91 4.1a1.003 1.003 0 0 1-1.18 0L5 10V8z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => window.location.href = 'tel:+923051755551'}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors" 
                  aria-label="Phone"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Footer Column 2 */}
            <div>
              <h5 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Contact</h5>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => window.location.href = 'mailto:azmgoc30@gmail.com'}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                  >
                    azmgoc30@gmail.com
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.location.href = 'tel:+923051755551'}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                  >
                    +92-3051755551
                  </button>
                </li>
                <li style={{ color: 'var(--text-secondary)' }}>
                  Head Office: Jadoon Public High School & College, Gandhian, Mansehra
                </li>
              </ul>
            </div>
            
            {/* Footer Column 3 */}
            <div>
              <h5 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Quick Links</h5>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleNavigation('/')}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('/about')}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('/scholarship-program')}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                  >
                    Scholarship Program
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('/results')}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                  >
                    Results & Toppers
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            © 2025 AZM.AIO — All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ForSchools;