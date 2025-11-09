import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Gallery = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Theme toggle handler
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Navigation handlers
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Initialize theme and scroll animations
  useEffect(() => {
    // Set initial theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setIsDarkMode(initialDarkMode);
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Scroll-fade-in animation
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

  // Gallery images data
  const galleryImages = [
    {
      src: "image 1.jpeg",
      alt: "Award Ceremony",
      caption: "Award Ceremony at Jadoon Public H.S.",
      fallback: "https://placehold.co/400x600/e2e8f0/475569?text=Image+Missing"
    },
    {
      src: "image 2.jpeg",
      alt: "Students Taking Test",
      caption: "Students at Govt. College Mansehra",
      fallback: "https://placehold.co/600x400/e2e8f0/475569?text=Image+Missing"
    },
    {
      src: "image 3.jpeg",
      alt: "Topper Receiving Prize",
      caption: "",
      fallback: "https://placehold.co/600x400/e2e8f0/475569?text=Image+Missing"
    },
    {
      src: "image 4.jpeg",
      alt: "Founder's Speech",
      caption: "Our Founder, Mr. Sumama Khan",
      fallback: "https://placehold.co/400x600/e2e8f0/475569?text=Image+Missing"
    },
    {
      src: "iram zeb.jpeg",
      alt: "Director's Speech",
      caption: "Our Director, Mrs. Iram Zeb, addressing partners",
      fallback: "https://placehold.co/600x400/e2e8f0/475569?text=Image+Missing"
    },
    {
      src: "sumama khan.jpg",
      alt: "Founder",
      caption: "Mr. Sumama Khan",
      fallback: "https://placehold.co/600x400/e2e8f0/475569?text=Image+Missing"
    },
    {
      src: "image 7.jpeg",
      alt: "Award Ceremony",
      caption: "",
      fallback: "https://placehold.co/400x600/e2e8f0/475569?text=Image+Missing"
    },
    {
      src: "image 8.jpeg",
      alt: "Students Taking Test",
      caption: "",
      fallback: "https://placehold.co/600x400/e2e8f0/475569?text=Image+Missing"
    },
    {
      src: "image 9.jpeg",
      alt: "Topper Receiving Prize",
      caption: "",
      fallback: "https://placehold.co/600x400/e2e8f0/475569?text=Image+Missing"
    },
    {
      src: "image 10.jpeg",
      alt: "Founder's Speech",
      caption: "",
      fallback: "https://placehold.co/400x600/e2e8f0/475569?text=Image+Missing"
    },
    {
      src: "image 11.jpeg",
      alt: "Director's Speech",
      caption: "",
      fallback: "https://placehold.co/600x400/e2e8f0/475569?text=Image+Missing"
    },
    {
      src: "image 12.jpeg",
      alt: "Founder",
      caption: "",
      fallback: "https://placehold.co/600x400/e2e8f0/475569?text=Image+Missing"
    }
  ];

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
                className="font-medium text-base text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation('/about')}
                className="font-medium text-base text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => handleNavigation('/scholarship-program')}
                className="font-medium text-base text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
              >
                Scholarship Program
              </button>
              <button 
                onClick={() => handleNavigation('/for-schools')}
                className="font-medium text-base text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
              >
                For Schools
              </button>
              <button 
                onClick={() => handleNavigation('/results')}
                className="font-medium text-base text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
              >
                Results
              </button>
              <button 
                onClick={() => handleNavigation('/gallery')}
                className="font-medium text-base text-[var(--text-link)]"
                aria-current="page"
              >
                Gallery
              </button>
              <button 
                onClick={() => handleNavigation('/contact')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors transform hover:-translate-y-px"
              >
                Contact
              </button>
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
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
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
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-link)] bg-[var(--bg-secondary)]"
              aria-current="page"
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-fade-in visible relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              <span className="gradient-headline">Event Gallery</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl" style={{ color: 'var(--text-secondary)' }}>
              Highlights from our test days and award ceremonies across Pakistan.
            </p>
          </div>
        </section>
        
        {/* Masonry Gallery Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="masonry-gallery scroll-fade-in">
            {galleryImages.map((image, index) => (
              <div key={index} className="masonry-item">
                <a href={image.src} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="gallery-card-image"
                    onError={(e) => {
                      e.target.src = image.fallback;
                    }}
                  />
                  {image.caption && (
                    <div className="masonry-caption">
                      <h3>{image.caption}</h3>
                    </div>
                  )}
                </a>
              </div>
            ))}
          </div>
        </section>
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
                <a href="mailto:azmgoc30@gmail.com" className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors" aria-label="Email">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 19h18a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1zM5 8h14v2l-6.91 4.1a1.003 1.003 0 0 1-1.18 0L5 10V8z"/>
                  </svg>
                </a>
                <a href="tel:+923051755551" className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors" aria-label="Phone">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
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

export default Gallery;