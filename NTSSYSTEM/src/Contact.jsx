import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });

  // Theme management
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

  // Navigation handlers
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // Check if form is properly set up
    if (form.action.includes("YOUR_FORM_ID_HERE")) {
      setFormStatus({
        message: 'Form is not set up. Please replace the placeholder URL in the component.',
        type: 'error'
      });
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');
    setFormStatus({ message: 'Sending...', type: 'loading' });

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus({
          message: 'Message sent successfully! We will get back to you soon.',
          type: 'success'
        });
        form.reset();
      } else {
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors.map(error => error.message).join(", "));
        } else {
          throw new Error('Oops! There was a problem submitting your form.');
        }
      }
    } catch (error) {
      setFormStatus({
        message: error.message,
        type: 'error'
      });
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('btn-loading');
    }
  };

  // Scroll reveal animation
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.scroll-fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    return () => {
      fadeElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const getMessageColor = () => {
    switch (formStatus.type) {
      case 'success': return '#22c55e'; // green-500
      case 'error': return '#ef4444'; // red-500
      default: return 'var(--text-secondary)';
    }
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
                className={`font-medium text-base transition-colors ${
                  location.pathname === '/' ? 'text-[var(--text-link)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-link)]'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation('/about')}
                className={`font-medium text-base transition-colors ${
                  location.pathname === '/about' ? 'text-[var(--text-link)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-link)]'
                }`}
              >
                About
              </button>
              <button 
                onClick={() => handleNavigation('/scholarship-program')}
                className={`font-medium text-base transition-colors ${
                  location.pathname === '/scholarship-program' ? 'text-[var(--text-link)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-link)]'
                }`}
              >
                Scholarship Program
              </button>
              <button 
                onClick={() => handleNavigation('/for-schools')}
                className={`font-medium text-base transition-colors ${
                  location.pathname === '/for-schools' ? 'text-[var(--text-link)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-link)]'
                }`}
              >
                For Schools
              </button>
              <button 
                onClick={() => handleNavigation('/results')}
                className={`font-medium text-base transition-colors ${
                  location.pathname === '/results' ? 'text-[var(--text-link)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-link)]'
                }`}
              >
                Results
              </button>
              <button 
                onClick={() => handleNavigation('/gallery')}
                className={`font-medium text-base transition-colors ${
                  location.pathname === '/gallery' ? 'text-[var(--text-link)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-link)]'
                }`}
              >
                Gallery
              </button>
              <button 
                onClick={() => handleNavigation('/contact')}
                className="font-medium text-base text-[var(--text-link)]"
                aria-current="page"
              >
                Contact
              </button>
              <button 
                onClick={toggleTheme}
                className="ml-2 p-2 rounded-full text-[var(--text-secondary)] bg-[var(--bg-secondary)] hover:text-[var(--text-link)] transition-colors"
              >
                {isDarkMode ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.95 14.536l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM1.293 4.293a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414L1.293 5.707a1 1 0 010-1.414zM4 10a1 1 0 01-1-1H2a1 1 0 110-2h1a1 1 0 011 1z" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
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
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.95 14.536l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM1.293 4.293a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414L1.293 5.707a1 1 0 010-1.414zM4 10a1 1 0 01-1-1H2a1 1 0 110-2h1a1 1 0 011 1z" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
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
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
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
              className="mt-2 block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-[var(--text-link)] bg-[var(--bg-secondary)]"
              aria-current="page"
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-fade-in visible relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              <span className="gradient-headline">Get in Touch</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl" style={{ color: 'var(--text-secondary)' }}>
              We're here to help. Reach out with any questions about partnerships, registrations, or our program.
            </p>
          </div>
        </section>
        
        {/* Main Page Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">

            {/* Left Column: Contact Info Card */}
            <div className="scroll-fade-in">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-heading)' }}>Contact Details</h2>
              <div className="card rounded-lg p-6 md:p-8 shadow-lg space-y-6">
                
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-600/10">
                      <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Email</h3>
                    <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>For all inquiries</p>
                    <a href="mailto:azmgoc30@gmail.com" className="font-medium text-[var(--text-link)] hover:text-[var(--text-link-hover)] transition-colors">azmgoc30@gmail.com</a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-600/10">
                      <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.892-1.467-5.5-4.076-6.968-6.968l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Phone & WhatsApp</h3>
                    <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>For direct contact</p>
                    <a href="tel:+923051755551" className="font-medium text-[var(--text-link)] hover:text-[var(--text-link-hover)] transition-colors">+92-305-1755551</a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-600/10">
                      <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Head Office</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Jadoon Public High School & College, Gandhian, Mansehra</p>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="scroll-fade-in">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-heading)' }}>Send Us a Message</h2>
              <div className="card rounded-lg p-6 md:p-8 shadow-lg">
                <form 
                  id="contactForm" 
                  action="https://formspree.io/f/YOUR_FORM_ID_HERE" 
                  method="POST" 
                  className="space-y-6"
                  onSubmit={handleSubmit}
                >
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input type="text" id="name" name="name" className="form-input" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input type="email" id="email" name="email" className="form-input" required />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <input type="text" id="subject" name="subject" className="form-input" required />
                  </div>

                  <div>
                    <label htmlFor="message" className="form-label">Your Message</label>
                    <textarea id="message" name="message" rows="5" className="form-textarea" required></textarea>
                  </div>
                  
                  <div>
                    <button 
                      type="submit" 
                      id="contact-submit-btn" 
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                  {formStatus.message && (
                    <div 
                      id="contact-message" 
                      className="text-center font-medium"
                      style={{ color: getMessageColor() }}
                    >
                      {formStatus.message}
                    </div>
                  )}
                </form>
              </div>
            </div>
            
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer mt-16" id="contact-footer">
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
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors" aria-label="Facebook">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </button>
                <a href="mailto:azmgoc30@gmail.com" className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors" aria-label="Email">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 19h18a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1zM5 8h14v2l-6.91 4.1a1.003 1.003 0 0 1-1.18 0L5 10V8z" />
                  </svg>
                </a>
                <a href="tel:+923051755551" className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors" aria-label="Phone">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Footer Column 2 */}
            <div>
              <h5 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Contact</h5>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:azmgoc30@gmail.com" className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors">azmgoc30@gmail.com</a>
                </li>
                <li>
                  <a href="tel:+923051755551" className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors">+92-305-1755551</a>
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
                    onClick={() => handleNavigation('/scholarship-program')}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                  >
                    Scholarship Program
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('/for-schools')}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                  >
                    For Schools
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

export default Contact;