import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Main component with routing logic
const AZMScholarship = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const themeToggleRef = useRef(null);
  const themeToggleMobileRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const canvasRef = useRef(null);
  const statsSectionRef = useRef(null);
  const fadeElementsRef = useRef([]);
  const timelineItemsRef = useRef([]);

  // Navigation handler
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false); // Close mobile menu after navigation
  };

  // Theme toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

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

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Testimonial carousel
  const testimonials = [
    {
      quote: "The AZM.AIO program is a pillar of transparency and fairness. It has provided an incredible, unbiased opportunity for our students.",
      name: "Mr. Arshad Khan",
      position: "Principal, Jadoon Public H.S."
    },
    {
      quote: "We were impressed by the professionalism and clear process. Our students felt motivated and rightly rewarded for their merit.",
      name: "Ms. Saima Begum",
      position: "Director, The Peace Group"
    },
    {
      quote: "This is what a real scholarship program looks like. No recommendations, just pure merit. A huge asset to our region.",
      name: "Prof. Khalid Ahmed",
      position: "Govt. College Mansehra"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
  };

  // Auto-play testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
          entry.target.classList.remove('opacity-0', 'translate-y-5', 'scale-95');
        }
      });
    }, observerOptions);

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          const delay = entry.target.dataset.delay || '0';
          setTimeout(() => {
            entry.target.classList.add('translate-y-0');
          }, parseInt(delay));
        }
      });
    }, { threshold: 0.5 });

    // Observe fade elements
    fadeElementsRef.current.forEach(el => {
      if (el) fadeObserver.observe(el);
    });

    // Observe timeline items
    timelineItemsRef.current.forEach(el => {
      if (el) timelineObserver.observe(el);
    });

    return () => {
      fadeElementsRef.current.forEach(el => {
        if (el) fadeObserver.unobserve(el);
      });
      timelineItemsRef.current.forEach(el => {
        if (el) timelineObserver.unobserve(el);
      });
    };
  }, []);

  // Stats counter animation
  useEffect(() => {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounter('stat-students', 8500, 2000);
        animateCounter('stat-centers', 60, 2000);
        animateCounter('stat-awards', 1200, 2000);
        statsObserver.unobserve(entries[0].target);
      }
    }, { threshold: 0.5 });

    if (statsSectionRef.current) {
      statsObserver.observe(statsSectionRef.current);
    }

    return () => {
      if (statsSectionRef.current) {
        statsObserver.unobserve(statsSectionRef.current);
      }
    };
  }, []);

  const animateCounter = (elementId, target, duration) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    let start = 0;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString() + '+';
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  };

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    const mouse = { x: null, y: null, radius: 100 };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      initParticles();
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    class Particle {
      constructor(x, y, dirX, dirY, size) {
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;
        this.size = size;
        this.color = isDarkMode ? 'rgba(96, 165, 250, 0.4)' : 'rgba(59, 130, 246, 0.4)';
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
          this.dirX = -this.dirX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
          this.dirY = -this.dirY;
        }
        this.x += this.dirX;
        this.y += this.dirY;
        this.draw();
      }
    }

    const initParticles = () => {
      particles = [];
      const numParticles = (canvas.width * canvas.height) / 12000;
      
      for (let i = 0; i < numParticles; i++) {
        const size = Math.random() * 1.5 + 1;
        const x = (Math.random() * (canvas.width - size * 2)) + size;
        const y = (Math.random() * (canvas.height - size * 2)) + size;
        const dirX = (Math.random() * 0.4) - 0.2;
        const dirY = (Math.random() * 0.4) - 0.2;
        particles.push(new Particle(x, y, dirX, dirY, size));
      }
    };

    const connectParticles = () => {
      const lineColor = isDarkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)';
      
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = dx * dx + dy * dy;
          const connectDistance = 20000;

          if (distance < connectDistance) {
            const opacityValue = 1 - (distance / 20000);
            ctx.strokeStyle = lineColor.replace('0.1', `${opacityValue * 0.1}`);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[a].x - mouse.x;
          const dy = particles[a].y - mouse.y;
          const distance = dx * dx + dy * dy;
          
          if (distance < mouse.radius * mouse.radius * 2) {
            ctx.strokeStyle = lineColor.replace('0.1', '0.2');
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.color = isDarkMode ? 'rgba(96, 165, 250, 0.4)' : 'rgba(59, 130, 246, 0.4)';
        particle.update();
      });
      
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    animate();
    
    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  // Partner institutions for marquee
  const partners = [
    "Jadoon Public H.S.",
    "Govt. College Mansehra",
    "The Peace Group",
    "Al-Ghazali College",
    "Bright Vision School",
    "Tameer-e-Wattan School"
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-900 text-slate-200' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 w-full backdrop-blur-lg border-b transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-900/85 border-slate-800' 
          : 'bg-white/85 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button 
              onClick={() => handleNavigation('/')} 
              className="flex-shrink-0 flex items-center focus:outline-none"
            >
              <svg className="h-8 w-8 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v.75m-3-12l3-3m0 0l3 3m-3-3v12.75" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21.75l1.541-1.541a1.5 1.5 0 012.122 0l1.54 1.541M9.75 21.75V19.5M14.25 21.75V19.5m0 0a3 3 0 00-3-3h-3a3 3 0 00-3 3m12 0v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a3.375 3.375 0 00-3.375 3.375V19.5m3.375 0h3.375M3 3.375C3 2.613 3.613 2 4.375 2h15.25C20.387 2 21 2.613 21 3.375v1.5C21 5.613 20.387 6.25 19.625 6.25H4.375C3.613 6.25 3 5.613 3 4.875v-1.5z" />
              </svg>
              <span className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                AZM.AIO
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:items-center md:space-x-6">
              <button 
                onClick={() => handleNavigation('/')}
                className={`font-medium ${
                  location.pathname === '/' ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : 
                  (isDarkMode ? 'text-slate-200 hover:text-blue-400' : 'text-slate-900 hover:text-blue-600')
                } transition-colors duration-200 focus:outline-none`}
              >
                Home
              </button>
              {[
                { path: '/about', name: 'About' },
                { path: '/scholarship-program', name: 'Scholarship Program' },
                { path: '/for-schools', name: 'For Schools' },
                { path: '/results', name: 'Results' },
                { path: '/gallery', name: 'Gallery' }
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`font-medium transition-colors duration-200 focus:outline-none ${
                    location.pathname === item.path ? 
                    (isDarkMode ? 'text-blue-400' : 'text-blue-600') :
                    (isDarkMode 
                      ? 'text-slate-200 hover:text-blue-400' 
                      : 'text-slate-900 hover:text-blue-600')
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => handleNavigation('/contact')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors transform hover:-translate-y-px focus:outline-none"
              >
                Contact
              </button>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`ml-2 p-2 rounded-full transition-colors focus:outline-none ${
                  isDarkMode 
                    ? 'bg-slate-800 text-slate-400 hover:text-blue-400' 
                    : 'bg-slate-100 text-slate-600 hover:text-blue-600'
                }`}
              >
                {isDarkMode ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.95 14.536l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM1.293 4.293a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414L1.293 5.707a1 1 0 010-1.414zM4 10a1 1 0 01-1-1H2a1 1 0 110-2h1a1 1 0 011 1z" />
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
                className={`p-2 rounded-full transition-colors focus:outline-none ${
                  isDarkMode 
                    ? 'bg-slate-800 text-slate-400 hover:text-blue-400' 
                    : 'bg-slate-100 text-slate-600 hover:text-blue-600'
                }`}
              >
                {isDarkMode ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.95 14.536l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM1.293 4.293a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414L1.293 5.707a1 1 0 010-1.414zM4 10a1 1 0 01-1-1H2a1 1 0 110-2h1a1 1 0 011 1z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button
                onClick={toggleMobileMenu}
                className={`ml-2 inline-flex items-center justify-center p-2 rounded-md transition-colors focus:outline-none ${
                  isDarkMode ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-b transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-slate-900 border-slate-700' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => handleNavigation('/')}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium focus:outline-none ${
                  location.pathname === '/' ?
                  (isDarkMode 
                    ? 'text-blue-400 bg-slate-800' 
                    : 'text-blue-600 bg-slate-100') :
                  (isDarkMode 
                    ? 'text-slate-200 hover:bg-slate-800' 
                    : 'text-slate-900 hover:bg-slate-100')
                } transition-colors`}
              >
                Home
              </button>
              {[
                { path: '/about', name: 'About' },
                { path: '/scholarship-program', name: 'Scholarship Program' },
                { path: '/for-schools', name: 'For Schools' },
                { path: '/results', name: 'Results' },
                { path: '/gallery', name: 'Gallery' }
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors focus:outline-none ${
                    location.pathname === item.path ?
                    (isDarkMode 
                      ? 'text-blue-400 bg-slate-800' 
                      : 'text-blue-600 bg-slate-100') :
                    (isDarkMode 
                      ? 'text-slate-200 hover:bg-slate-800' 
                      : 'text-slate-900 hover:bg-slate-100')
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => handleNavigation('/contact')}
                className="mt-2 block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <section className={`relative pt-24 pb-32 text-center overflow-hidden ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900' 
            : 'bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-50'
        }`}>
          <canvas 
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full opacity-70 pointer-events-none"
          />
          
          <div 
            ref={el => fadeElementsRef.current[0] = el}
            className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 opacity-0 translate-y-5 scale-95 transition-all duration-700"
          >
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              <span className={`bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-indigo-300 to-blue-400' 
                  : 'from-indigo-500 to-blue-500'
              } bg-clip-text text-transparent`}>
                Self‑Funded Scholarships
              </span>{' '}
              for Deserving Students
            </h1>
            <p className={`max-w-3xl mx-auto text-lg md:text-xl mb-10 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Independent, fair, and transparent — no donations, no sponsors. Merit-based testing conducted at schools and colleges.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <button
                onClick={() => handleNavigation('/scholarship-program#register')}
                className={`inline-flex items-center justify-center px-8 py-3 rounded-md shadow-lg text-base font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none ${
                  isDarkMode
                    ? 'bg-blue-400/10 border border-blue-400/30 text-blue-400 hover:bg-blue-400/20 hover:shadow-blue-400/20'
                    : 'bg-blue-600/10 border border-blue-600/40 text-blue-600 hover:bg-blue-600/20 hover:shadow-blue-600/20'
                }`}
              >
                Register for Test
              </button>
              <button
                onClick={() => handleNavigation('/for-schools')}
                className={`inline-flex items-center justify-center px-8 py-3 rounded-md shadow-sm text-base font-medium transition-all duration-300 transform hover:scale-105 border focus:outline-none ${
                  isDarkMode
                    ? 'bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600'
                    : 'bg-white/50 border-slate-300 text-slate-900 hover:bg-white/80 hover:border-slate-400'
                }`}
              >
                Partner Your School
              </button>
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              <span className={`py-1 px-3 rounded-full text-sm font-medium ${
                isDarkMode
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'bg-blue-600/10 text-blue-600'
              }`}>
                Self‑Funded
              </span>
              <span className={`py-1 px-3 rounded-full text-sm font-medium ${
                isDarkMode
                  ? 'bg-green-600/20 text-green-400'
                  : 'bg-green-600/10 text-green-600'
              }`}>
                Fair & Transparent
              </span>
              <span className={`py-1 px-3 rounded-full text-sm font-medium ${
                isDarkMode
                  ? 'bg-purple-600/20 text-purple-400'
                  : 'bg-purple-600/10 text-purple-600'
              }`}>
                School + BOD Verified
              </span>
            </div>
          </div>
        </section>

        {/* Partner Marquee Section */}
        <section 
          ref={el => fadeElementsRef.current[1] = el}
          className={`py-16 opacity-0 translate-y-5 scale-95 transition-all duration-700 ${
            isDarkMode ? 'bg-slate-800' : 'bg-slate-100'
          }`}
        >
          <div className="text-center">
            <p className={`text-sm font-semibold uppercase tracking-wider mb-8 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Trusted by Our Partner Institutions
            </p>
            <div className="relative w-full overflow-hidden">
              <div className="flex animate-scroll-x">
                {[...partners, ...partners].map((partner, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 mx-3 p-4 rounded-lg shadow-sm w-64 text-center transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? 'bg-slate-700/50 border border-slate-600 text-slate-200'
                        : 'bg-white border border-slate-200 text-slate-900'
                    }`}
                  >
                    <span className="text-lg font-medium">{partner}</span>
                  </div>
                ))}
              </div>
              <div className={`absolute top-0 left-0 w-24 h-full bg-gradient-to-r ${
                isDarkMode ? 'from-slate-800' : 'from-slate-100'
              } to-transparent`} />
              <div className={`absolute top-0 right-0 w-24 h-full bg-gradient-to-l ${
                isDarkMode ? 'from-slate-800' : 'from-slate-100'
              } to-transparent`} />
            </div>
          </div>
        </section>

        {/* 3-Card Grid Section */}
        <section className={`py-24 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-900 via-blue-900/5 to-slate-900' 
            : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="h-10 w-10 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112zM15.91 11.672A.375.375 0 0115.91 11.672z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25c-1.04 0-1.92.422-2.553 1.106-.633.684-1.022 1.59-1.022 2.572 0 1.01.378 1.918 1.007 2.598.63.68 1.503 1.107 2.568 1.107 1.036 0 1.916-.417 2.548-1.107.633-.68.993-1.587.993-2.598 0-.982-.39-1.888-1.022-2.572C13.92 8.672 13.04 8.25 12 8.25z" />
                    </svg>
                  ),
                  title: "Scholarships (PKR 500–30,000)",
                  description: "Cash awards based on percentage bands starting from 60% to 100%."
                },
                {
                  icon: (
                    <svg className="h-10 w-10 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  ),
                  title: "Merit-based MCQ Tests",
                  description: "Standardized testing with clear rules, attendance, and audited results."
                },
                {
                  icon: (
                    <svg className="h-10 w-10 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5m-9 4.5v-4.5m9 0l-3-3m-3 3l-3-3m-3 3l3 3m6-3l3 3M3.75 6.75h16.5M3.75 6.75c0-1.519 1.231-2.75 2.75-2.75h11c1.519 0 2.75 1.231 2.75 2.75M3.75 6.75v4.5c0 1.519 1.231 2.75 2.75 2.75h11c1.519 0 2.75-1.231 2.75-2.75v-4.5" />
                    </svg>
                  ),
                  title: "Results & Toppers",
                  description: "Center-wise toppers and result verification. Print admit cards and certificates."
                }
              ].map((card, index) => (
                <div
                  key={index}
                  ref={el => fadeElementsRef.current[2 + index] = el}
                  className={`p-6 rounded-lg transition-all duration-500 opacity-0 translate-y-5 scale-95 ${
                    isDarkMode
                      ? 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                      : 'bg-white border border-slate-200 hover:border-slate-300'
                  } hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-xl`}
                >
                  {card.icon}
                  <h3 className={`text-2xl font-bold mb-3 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {card.title}
                  </h3>
                  <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Animated Step Timeline Section */}
        <section className="py-24" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Column: Text */}
              <div
                ref={el => fadeElementsRef.current[5] = el}
                className="opacity-0 translate-y-5 scale-95 transition-all duration-700"
              >
                <h2 className={`text-3xl sm:text-4xl font-extrabold mb-6 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  A Simple, Fair Process
                </h2>
                <p className={`text-lg mb-8 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  We believe in transparency. Our process is designed to be straightforward for students, parents, and schools.
                </p>
                <button
                  onClick={() => handleNavigation('/scholarship-program')}
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-md shadow-sm text-base font-medium transition-all transform hover:scale-105 focus:outline-none ${
                    isDarkMode
                      ? 'bg-slate-800/50 border border-slate-700 text-blue-400 hover:bg-slate-700/50'
                      : 'bg-white/50 border border-slate-300 text-blue-600 hover:bg-white/80'
                  }`}
                >
                  Learn More About the Program
                </button>
              </div>
              
              {/* Right Column: Animated Timeline */}
              <div className="relative">
                {[
                  {
                    step: "1",
                    title: "Register Online",
                    description: "Students or schools register for the upcoming test date."
                  },
                  {
                    step: "2",
                    title: "Take the Test",
                    description: "Sit for the standardized, merit-based MCQ test at your center."
                  },
                  {
                    step: "3",
                    title: "Check Your Result",
                    description: "Results are announced online and verified by the board."
                  },
                  {
                    step: "4",
                    title: "Receive Your Award",
                    description: "Top-scoring students are awarded scholarships in a prize ceremony."
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    ref={el => timelineItemsRef.current[index] = el}
                    data-delay={index * 200}
                    className={`relative mb-8 opacity-0 translate-y-4 transition-all duration-500 ${
                      index < 3 ? 'pb-12' : ''
                    }`}
                  >
                    {index < 3 && (
                      <div className={`absolute top-8 left-7 w-0.5 h-full transition-all duration-700 delay-300 ${
                        isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                      }`} />
                    )}
                    <div className={`absolute top-0 left-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm transition-all duration-500 delay-500 ${
                      isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
                    }`}>
                      {item.step}
                    </div>
                    <div className="ml-12 transition-all duration-500 delay-700">
                      <h4 className={`text-xl font-bold mb-1 ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {item.title}
                      </h4>
                      <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section 
          ref={statsSectionRef}
          className={`py-20 ${
            isDarkMode ? 'bg-slate-800' : 'bg-indigo-50'
          }`}
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${
              isDarkMode ? '#334155' : '#e2e8f0'
            } 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: (
                  <svg className="h-10 w-10 text-blue-500 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-5.242M5.25 18.72a9.094 9.094 0 013.741-.479 3 3 0 013.741 5.242M5.25 18.72L5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v11.22M15 13.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                value: "0",
                id: "stat-students",
                label: "Students Tested"
              },
              {
                icon: (
                  <svg className="h-10 w-10 text-blue-500 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125-1.125V21M8.25 3v4.875c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125.504 1.125-1.125V3M15.75 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125-1.125V21m-4.5 0v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125-1.125V3M15.75 3v4.875c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125.504 1.125-1.125V3" />
                  </svg>
                ),
                value: "0",
                id: "stat-centers",
                label: "Centers"
              },
              {
                icon: (
                  <svg className="h-10 w-10 text-blue-500 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5m-9 4.5v-4.5m9 0l-3-3m-3 3l-3-3m-3 3l3 3m6-3l3 3M3.75 6.75h16.5M3.75 6.75c0-1.519 1.231-2.75 2.75-2.75h11c1.519 0 2.75 1.231 2.75 2.75M3.75 6.75v4.5c0 1.519 1.231 2.75 2.75 2.75h11c1.519 0 2.75-1.231 2.75-2.75v-4.5" />
                  </svg>
                ),
                value: "0",
                id: "stat-awards",
                label: "Scholarships Granted"
              }
            ].map((stat, index) => (
              <div
                key={index}
                ref={el => fadeElementsRef.current[6 + index] = el}
                className="flex flex-col items-center p-4 rounded-lg opacity-0 translate-y-5 scale-95 transition-all duration-700"
              >
                {stat.icon}
                <strong
                  id={stat.id}
                  className="block text-5xl font-extrabold text-blue-500 mb-2"
                >
                  {stat.value}
                </strong>
                <span className={`text-lg ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial Carousel */}
        <section className={`py-24 ${
          isDarkMode 
            ? 'bg-gradient-to-tl from-slate-900 via-blue-900/5 to-slate-900' 
            : 'bg-gradient-to-tl from-slate-50 via-blue-50/30 to-slate-50'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                What Our Partners Say
              </h2>
              <p className={`max-w-2xl mx-auto text-lg ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                We're proud to partner with institutions dedicated to student success.
              </p>
            </div>
            
            <div
              ref={el => fadeElementsRef.current[9] = el}
              className={`p-8 md:p-12 rounded-lg shadow-lg relative opacity-0 translate-y-5 scale-95 transition-all duration-700 ${
                isDarkMode 
                  ? 'bg-slate-800 border border-slate-700' 
                  : 'bg-white border border-slate-200'
              }`}
            >
              <div className="relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4 text-center">
                      <blockquote className={`text-xl md:text-2xl font-medium mb-6 ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        "{testimonial.quote}"
                      </blockquote>
                      <footer className="text-center">
                        <div className={`text-lg font-semibold ${
                          isDarkMode ? 'text-slate-200' : 'text-slate-900'
                        }`}>
                          {testimonial.name}
                        </div>
                        <div className="text-blue-500">{testimonial.position}</div>
                      </footer>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Carousel Dots */}
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors focus:outline-none ${
                      index === currentTestimonial ? 'bg-blue-500' : 'bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Carousel Navigation */}
              <button
                onClick={prevTestimonial}
                className={`absolute left-0 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all focus:outline-none ${
                  isDarkMode
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}
                aria-label="Previous testimonial"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextTestimonial}
                className={`absolute right-0 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all focus:outline-none ${
                  isDarkMode
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}
                aria-label="Next testimonial"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Mission/Vision Section */}
        <section className="py-24" id="about">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Our Guiding Principles
              </h2>
              <p className={`max-w-2xl mx-auto text-lg ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                The core beliefs that drive our mission forward.
              </p>
            </div>
            
            <div
              ref={el => fadeElementsRef.current[10] = el}
              className={`p-8 md:p-12 rounded-lg shadow-lg opacity-0 translate-y-5 scale-95 transition-all duration-700 ${
                isDarkMode 
                  ? 'bg-slate-800 border border-slate-700' 
                  : 'bg-white border border-slate-200'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Our Mission */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center justify-center h-12 w-12 rounded-full ${
                      isDarkMode ? 'bg-blue-400/10' : 'bg-blue-600/10'
                    }`}>
                      <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold mb-3 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Our Mission
                    </h3>
                    <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                      To create opportunities via need‑ and merit‑based scholarships so students can continue their studies without financial pressure.
                    </p>
                  </div>
                </div>
                
                {/* Our Vision */}
                <div className="flex items-start space-x-4 md:border-l md:pl-12 border-slate-300">
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center justify-center h-12 w-12 rounded-full ${
                      isDarkMode ? 'bg-blue-400/10' : 'bg-blue-600/10'
                    }`}>
                      <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold mb-3 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Our Vision
                    </h3>
                    <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                      A Pakistan where students from remote areas complete their education confidently and on merit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`border-t transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Footer Column 1 */}
            <div>
              <h4 className={`text-2xl font-bold mb-3 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                AZM.AIO
              </h4>
              <p className={`mb-6 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Independent, fair, and transparent — funded by AZM Group of Companies, not donations.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => window.open('#', '_blank')}
                  className={`transition-colors duration-200 focus:outline-none ${
                    isDarkMode 
                      ? 'text-slate-400 hover:text-blue-400' 
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                  aria-label="X (formerly Twitter)"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                <button
                  onClick={() => window.open('#', '_blank')}
                  className={`transition-colors duration-200 focus:outline-none ${
                    isDarkMode 
                      ? 'text-slate-400 hover:text-blue-400' 
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                  aria-label="Facebook"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => window.open('mailto:azmgoc30@gmail.com', '_blank')}
                  className={`transition-colors duration-200 focus:outline-none ${
                    isDarkMode 
                      ? 'text-slate-400 hover:text-blue-400' 
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                  aria-label="Email"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 19h18a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1zM5 8h14v2l-6.91 4.1a1.003 1.003 0 0 1-1.18 0L5 10V8z"/>
                  </svg>
                </button>
                <button
                  onClick={() => window.open('tel:+923051755551', '_blank')}
                  className={`transition-colors duration-200 focus:outline-none ${
                    isDarkMode 
                      ? 'text-slate-400 hover:text-blue-400' 
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
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
              <h5 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Contact
              </h5>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => window.open('mailto:azmgoc30@gmail.com', '_blank')}
                    className={`transition-colors duration-200 focus:outline-none ${
                      isDarkMode 
                        ? 'text-slate-400 hover:text-blue-400' 
                        : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    azmgoc30@gmail.com
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => window.open('tel:+923051755551', '_blank')}
                    className={`transition-colors duration-200 focus:outline-none ${
                      isDarkMode 
                        ? 'text-slate-400 hover:text-blue-400' 
                        : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    +92-305-1755551
                  </button>
                </li>
                <li className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                  Head Office: Jadoon Public High School & College, Gandhian, Mansehra
                </li>
              </ul>
            </div>
            
            {/* Footer Column 3 */}
            <div>
              <h5 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Quick Links
              </h5>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleNavigation('/scholarship-program')}
                    className={`transition-colors duration-200 focus:outline-none ${
                      isDarkMode 
                        ? 'text-slate-400 hover:text-blue-400' 
                        : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    Scholarship Program
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/for-schools')}
                    className={`transition-colors duration-200 focus:outline-none ${
                      isDarkMode 
                        ? 'text-slate-400 hover:text-blue-400' 
                        : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    For Schools
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/results')}
                    className={`transition-colors duration-200 focus:outline-none ${
                      isDarkMode 
                        ? 'text-slate-400 hover:text-blue-400' 
                        : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    Results & Toppers
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={`py-6 ${
          isDarkMode ? 'bg-slate-900' : 'bg-slate-50'
        }`}>
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            © 2025 AZM.AIO — All rights reserved.
          </div>
        </div>
      </footer>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes scroll-x {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll-x {
          animation: scroll-x 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AZMScholarship