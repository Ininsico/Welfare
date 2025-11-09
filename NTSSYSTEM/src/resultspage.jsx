import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ResultsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State for theme
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Login states
    const [loginPhone, setLoginPhone] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [studentAdmitId, setStudentAdmitId] = useState('');
    const [studentProfile, setStudentProfile] = useState(null);

    // State for mobile menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State for active portal view
    const [activeView, setActiveView] = useState('login'); // Default to login view

    // State for registration form
    const [registrationForm, setRegistrationForm] = useState({
        name: '',
        father: '',
        grade: '',
        contact: '',
        school: '',
        photoUrl: '',
        center: ''
    });

    // State for check result form
    const [checkId, setCheckId] = useState('');
    const [studentResult, setStudentResult] = useState(null);
    const [regMessage, setRegMessage] = useState('');
    const [checkMessage, setCheckMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const API_URL = 'http://localhost:3001/api';

    // Apply theme on component mount and when theme changes
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // Handle view switching based on hash
    useEffect(() => {
        const hash = location.hash.substring(1);
        if (hash && ['register', 'login', 'profile'].includes(hash)) {
            setActiveView(hash);
        }
    }, [location.hash]);

    // Check if user is already logged in
    useEffect(() => {
        const savedAdmitId = localStorage.getItem('studentAdmitId');
        const savedProfile = localStorage.getItem('studentProfile');

        if (savedAdmitId && savedProfile) {
            setStudentAdmitId(savedAdmitId);
            setStudentProfile(JSON.parse(savedProfile));
            setIsLoggedIn(true);
            setActiveView('profile');
        }
    }, []);

    // Scroll-fade-in animation
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

    // Theme toggle handler
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Mobile menu toggle handler
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // View switching handler
    const handleViewChange = (viewId) => {
        setActiveView(viewId);
        navigate(`/results#${viewId}`);
    };

    // Registration form handler
    const handleRegistrationChange = (e) => {
        const { id, value } = e.target;
        setRegistrationForm(prev => ({
            ...prev,
            [id.replace('reg-', '')]: value
        }));
    };

    // Phone login handler
    // Phone login handler
    const handlePhoneLogin = async (e) => {
        e.preventDefault();
        setCheckMessage('Logging in...');
        setIsLoading(true);

        try {
            // Special case for admin phone number
            if (loginPhone === '12345678910') {
                navigate('/adminpanel');
                return;
            }

            // Clean the phone number - remove any spaces, dashes, etc.
            const cleanPhone = loginPhone.replace(/\D/g, '');

            console.log('Searching for phone:', cleanPhone); // Debug log

            const response = await fetch(`${API_URL}/students/phone/${cleanPhone}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No student found with this phone number');
            }

            const result = await response.json();

            if (result.success) {
                // Get full student data
                const studentResponse = await fetch(`${API_URL}/students/${result.data.admitId}`);

                if (!studentResponse.ok) {
                    throw new Error('Failed to load student profile');
                }

                const studentData = await studentResponse.json();

                if (studentData.success) {
                    setStudentAdmitId(result.data.admitId);
                    setStudentProfile(studentData.data);
                    setIsLoggedIn(true);
                    setActiveView('profile');

                    // Save to localStorage
                    localStorage.setItem('studentAdmitId', result.data.admitId);
                    localStorage.setItem('studentProfile', JSON.stringify(studentData.data));

                    setCheckMessage('Login successful!');
                } else {
                    throw new Error('Failed to load student profile');
                }
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.error('Login error:', err);
            setCheckMessage(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Logout handler
    const handleLogout = () => {
        setIsLoggedIn(false);
        setStudentAdmitId('');
        setStudentProfile(null);
        setActiveView('login');
        localStorage.removeItem('studentAdmitId');
        localStorage.removeItem('studentProfile');
    };

    // Registration function
    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
        setRegMessage('Registering...');
        setIsLoading(true);

        const studentData = {
            name: registrationForm.name,
            father: registrationForm.father,
            grade: registrationForm.grade,
            contact: registrationForm.contact,
            school: registrationForm.school,
            photoUrl: registrationForm.photoUrl,
            center: registrationForm.center
        };

        try {
            const response = await fetch(`${API_URL}/students/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const result = await response.json();

            if (result.success) {
                setRegMessage('Registration successful! Logging you in...');

                // Auto-login after registration
                setTimeout(() => {
                    setLoginPhone(registrationForm.contact);
                    handlePhoneLogin(e);
                }, 2000);
            } else {
                throw new Error(result.message);
            }

        } catch (err) {
            console.error('Registration failed:', err);
            setRegMessage(`Registration failed: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Check result function (for non-logged in users)
    const handleCheckResultSubmit = async (e) => {
        e.preventDefault();
        setCheckMessage('Checking...');
        setStudentResult(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/students/${encodeURIComponent(checkId)}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Student not found');
            }

            const result = await response.json();

            if (result.success) {
                setStudentResult(result.data);
                setCheckMessage('');
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.error('Result check failed:', err);
            setCheckMessage(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="antialiased" style={{
            fontFamily: "'Inter', sans-serif",
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            transition: 'background-color 0.3s ease, color 0.3s ease'
        }}>
            {/* Header */}
            <header className="header sticky top-0 z-50 w-full backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <button
                            onClick={() => navigate('/')}
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
                                onClick={() => navigate('/')}
                                className="font-medium text-base text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => navigate('/about')}
                                className="font-medium text-base text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                            >
                                About
                            </button>
                            <button
                                onClick={() => navigate('/scholarship-program')}
                                className="font-medium text-base text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                            >
                                Scholarship Program
                            </button>
                            <button
                                onClick={() => navigate('/for-schools')}
                                className="font-medium text-base text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                            >
                                For Schools
                            </button>
                            <button
                                onClick={() => navigate('/results')}
                                className="font-medium text-base text-[var(--text-link)]"
                                aria-current="page"
                            >
                                Student Portal
                            </button>
                            <button
                                onClick={() => navigate('/gallery')}
                                className="font-medium text-base text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                            >
                                Gallery
                            </button>
                            {isLoggedIn && (
                                <button
                                    onClick={handleLogout}
                                    className="font-medium text-base text-red-600 hover:text-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/contact')}
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
                {isMobileMenuOpen && (
                    <div className="mobile-menu md:hidden" id="mobile-menu">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <button
                                onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                About
                            </button>
                            <button
                                onClick={() => { navigate('/scholarship-program'); setIsMobileMenuOpen(false); }}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                Scholarship Program
                            </button>
                            <button
                                onClick={() => { navigate('/for-schools'); setIsMobileMenuOpen(false); }}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                For Schools
                            </button>
                            <button
                                onClick={() => { navigate('/results'); setIsMobileMenuOpen(false); }}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-link)] bg-[var(--bg-secondary)]"
                                aria-current="page"
                            >
                                Student Portal
                            </button>
                            {isLoggedIn && (
                                <button
                                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Logout
                                </button>
                            )}
                            <button
                                onClick={() => { navigate('/gallery'); setIsMobileMenuOpen(false); }}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                Gallery
                            </button>
                            <button
                                onClick={() => { navigate('/contact'); setIsMobileMenuOpen(false); }}
                                className="mt-2 block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
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
                <section className="animated-bubbles-bg dot-pattern py-24 text-center relative overflow-hidden">
                    <div className="bubbles">
                        <span></span><span></span><span></span><span></span><span></span>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-fade-in visible relative z-10">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                            <span className="gradient-headline">Student Portal</span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl" style={{ color: 'var(--text-secondary)' }}>
                            {isLoggedIn ? `Welcome back, ${studentProfile?.name}!` : 'Login to access your test details and admit card.'}
                        </p>
                    </div>
                </section>

                {/* Main Page Layout */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-3xl mx-auto">

                        {/* Portal Navigation Tabs - Only show if not logged in */}
                        {!isLoggedIn && (
                            <div className="mb-8 flex flex-wrap items-center justify-center gap-2 border-b border-[var(--border-secondary)] pb-4">
                                <button
                                    onClick={() => handleViewChange('login')}
                                    className={`tab-button ${activeView === 'login' ? 'active' : ''}`}
                                >
                                    Student Login
                                </button>
                                <button
                                    onClick={() => handleViewChange('register')}
                                    className={`tab-button ${activeView === 'register' ? 'active' : ''}`}
                                >
                                    New Registration
                                </button>
                                <button
                                    onClick={() => handleViewChange('check')}
                                    className={`tab-button ${activeView === 'check' ? 'active' : ''}`}
                                >
                                    Check Result
                                </button>
                            </div>
                        )}

                        {/* View 1: Student Login */}
                        {!isLoggedIn && (
                            <section
                                id="login-view"
                                className={`portal-view card rounded-lg p-6 md:p-8 shadow-lg ${activeView === 'login' ? 'active' : ''}`}
                            >
                                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-heading)' }}>Student Login</h2>
                                <form onSubmit={handlePhoneLogin} className="space-y-6">
                                    <div>
                                        <label htmlFor="login-phone" className="form-label">Enter Your Registered Phone Number</label>
                                        <input
                                            type="tel"
                                            id="login-phone"
                                            className="form-input"
                                            placeholder="e.g., 03315821144"
                                            value={loginPhone}
                                            onChange={(e) => setLoginPhone(e.target.value)}
                                            required
                                        />
                                        <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                                            Use the same phone number you registered with
                                        </p>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors ${isLoading ? 'btn-loading' : ''}`}
                                        >
                                            {isLoading ? 'Logging in...' : 'Login to My Account'}
                                        </button>
                                    </div>
                                    <div className="text-center font-medium" style={{ color: checkMessage.includes('error') ? '#ef4444' : 'var(--text-secondary)' }}>
                                        {checkMessage}
                                    </div>
                                </form>
                            </section>
                        )}

                        {/* View 2: Student Registration */}
                        {!isLoggedIn && (
                            <section
                                id="register-view"
                                className={`portal-view card rounded-lg p-6 md:p-8 shadow-lg ${activeView === 'register' ? 'active' : ''}`}
                            >
                                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-heading)' }}>New Student Registration</h2>
                                <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="reg-name" className="form-label">Full Name</label>
                                            <input
                                                type="text"
                                                id="reg-name"
                                                className="form-input"
                                                value={registrationForm.name}
                                                onChange={handleRegistrationChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="reg-father" className="form-label">Father's Name</label>
                                            <input
                                                type="text"
                                                id="reg-father"
                                                className="form-input"
                                                value={registrationForm.father}
                                                onChange={handleRegistrationChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="reg-grade" className="form-label">Grade</label>
                                            <select
                                                id="reg-grade"
                                                className="form-select"
                                                value={registrationForm.grade}
                                                onChange={handleRegistrationChange}
                                                required
                                            >
                                                <option value="" disabled>Select your grade...</option>
                                                <option value="6">Grade 6</option>
                                                <option value="7">Grade 7</option>
                                                <option value="8">Grade 8</option>
                                                <option value="9">Grade 9</option>
                                                <option value="10">Grade 10</option>
                                                <option value="11">Grade 11</option>
                                                <option value="12">Grade 12</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="reg-contact" className="form-label">Guardian's Contact (WhatsApp)</label>
                                            <input
                                                type="tel"
                                                id="reg-contact"
                                                className="form-input"
                                                placeholder="e.g., 03001234567"
                                                value={registrationForm.contact}
                                                onChange={handleRegistrationChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="reg-school" className="form-label">School Name</label>
                                        <input
                                            type="text"
                                            id="reg-school"
                                            className="form-input"
                                            value={registrationForm.school}
                                            onChange={handleRegistrationChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="reg-photo-url" className="form-label">Student Photo URL (Optional)</label>
                                        <input
                                            type="url"
                                            id="reg-photo-url"
                                            className="form-input"
                                            placeholder="https://example.com/your-photo.jpg"
                                            value={registrationForm.photoUrl}
                                            onChange={handleRegistrationChange}
                                        />
                                        <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                                            Upload your photo to a site like <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-[var(--text-link)] underline">Imgur</a> and paste the link here.
                                        </p>
                                    </div>
                                    <div>
                                        <label htmlFor="reg-center" className="form-label">Test Center</label>
                                        <select
                                            id="reg-center"
                                            className="form-select"
                                            value={registrationForm.center}
                                            onChange={handleRegistrationChange}
                                            required
                                        >
                                            <option value="" disabled>Select your test center...</option>
                                            <option value="Jadoon Public High School, Gandhian">Jadoon Public High School, Gandhian</option>
                                            <option value="Govt. College Mansehra">Govt. College Mansehra</option>
                                            <option value="The Peace Group, Abbottabad">The Peace Group, Abbottabad</option>
                                        </select>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors ${isLoading ? 'btn-loading' : ''}`}
                                        >
                                            {isLoading ? 'Registering...' : 'Register & Login'}
                                        </button>
                                    </div>
                                    <div className="text-center font-medium" style={{ color: regMessage.includes('failed') ? '#ef4444' : 'var(--text-secondary)' }}>
                                        {regMessage}
                                    </div>
                                </form>
                            </section>
                        )}

                        {/* View 3: Check Result (without login) */}
                        {!isLoggedIn && (
                            <section
                                id="check-view"
                                className={`portal-view card rounded-lg p-6 md:p-8 shadow-lg ${activeView === 'check' ? 'active' : ''}`}
                            >
                                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-heading)' }}>Check Your Result</h2>
                                <form onSubmit={handlePhoneLogin} className="space-y-4">
                                    <div>
                                        <label htmlFor="check-id" className="form-label">Enter Your Test ID</label>
                                        <input
                                            type="text"
                                            id="check-id"
                                            className="form-input"
                                            placeholder="e.g., AZM-1234567890-ABCD"
                                            value={checkId}
                                            onChange={(e) => setCheckId(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors ${isLoading ? 'btn-loading' : ''}`}
                                        >
                                            {isLoading ? 'Checking...' : 'Check Result'}
                                        </button>
                                    </div>
                                </form>

                                {/* Result Display Area */}
                                {studentResult && (
                                    <div id="result-display" className="mt-8">
                                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>Student Status</h3>
                                        <div className="space-y-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                            <div className="flex justify-between">
                                                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Name:</span>
                                                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                                    {studentResult.name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Test ID:</span>
                                                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                                    {studentResult.admitId}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Status:</span>
                                                <span className="font-bold text-yellow-500">
                                                    {studentResult.result}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Score:</span>
                                                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                                    {studentResult.score}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="text-center font-medium mt-4" style={{ color: checkMessage.includes('error') ? '#ef4444' : 'var(--text-secondary)' }}>
                                    {checkMessage}
                                </div>
                            </section>
                        )}

                        {/* View 4: Student Profile (Logged In) */}
                        {isLoggedIn && studentProfile && (
                            <section
                                id="profile-view"
                                className="portal-view card rounded-lg p-6 md:p-8 shadow-lg active"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>My Profile</h2>
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>

                                {/* Profile Header */}
                                <div className="flex flex-col md:flex-row gap-6 mb-8">
                                    <div className="flex-shrink-0">
                                        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                            {studentProfile.photoUrl ? (
                                                <img
                                                    src={studentProfile.photoUrl}
                                                    alt={studentProfile.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{studentProfile.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">Test ID: <span className="font-mono font-bold text-blue-600">{studentProfile.admitId}</span></p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Father's Name</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{studentProfile.father}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Grade</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">Grade {studentProfile.grade}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Contact</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{studentProfile.contact}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">School</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{studentProfile.school}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Test Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Test Center</h4>
                                        <p className="text-gray-700 dark:text-gray-300">{studentProfile.center}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Registration Date</h4>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {new Date(studentProfile.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Result Status */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Test Result</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                                            <p className={`font-bold ${studentProfile.result === 'Passed' ? 'text-green-600' :
                                                    studentProfile.result === 'Failed' ? 'text-red-600' : 'text-yellow-600'
                                                }`}>
                                                {studentProfile.result}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{studentProfile.score}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => navigate(`/admit-card/${studentProfile.admitId}`)}
                                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        View/Print Admit Card
                                    </button>

                                    <button
                                        onClick={() => handleViewChange('check')}
                                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        Refresh Results
                                    </button>
                                </div>
                            </section>
                        )}

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
                                <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors" aria-label="X (formerly Twitter)">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors" aria-label="Facebook">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
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
                                        onClick={() => navigate('/scholarship-program')}
                                        className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                                    >
                                        Scholarship Program
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => navigate('/for-schools')}
                                        className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                                    >
                                        For Schools
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => navigate('/results')}
                                        className="text-[var(--text-secondary)] hover:text-[var(--text-link)] transition-colors"
                                    >
                                        Student Portal
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

            {/* Inline Styles */}
            <style jsx>{`
                /* All the CSS styles remain the same */
                :root {
                  --bg-primary: #f8fafc;
                  --bg-secondary: #f1f5f9;
                  --bg-card: #ffffff;
                  --bg-header: rgba(255, 255, 255, 0.85);
                  --text-primary: #0f172a;
                  --text-secondary: #475569;
                  --text-heading: #0f172a;
                  --text-link: #2563eb;
                  --text-link-hover: #1d4ed8;
                  --border-primary: #e2e8f0;
                  --border-secondary: #e2e8f0;
                  --dot-pattern-color: #e2e8f0;
                  --mesh-grad-1: rgba(59, 130, 246, 0.1);
                  --mesh-grad-2: rgba(168, 85, 247, 0.1);
                  --faq-border: #e2e8f0;
                  --bubble-color: #3b82f6;
                }

                .dark {
                  --bg-primary: #0f172a;
                  --bg-secondary: #1e293b;
                  --bg-card: #1e293b;
                  --bg-header: rgba(15, 23, 42, 0.85);
                  --text-primary: #e2e8f0;
                  --text-secondary: #94a3b8;
                  --text-heading: #ffffff;
                  --text-link: #60a5fa;
                  --text-link-hover: #93c5fd;
                  --border-primary: #1e293b;
                  --border-secondary: #334155;
                  --dot-pattern-color: #334155;
                  --mesh-grad-1: rgba(59, 130, 246, 0.15);
                  --mesh-grad-2: rgba(168, 85, 247, 0.15);
                  --faq-border: #334155;
                  --bubble-color: #60a5fa;
                }

                .gradient-headline {
                  background-image: linear-gradient(90deg, #4f46e5, #3b82f6);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  text-fill-color: transparent;
                  display: inline-block;
                }

                .dark .gradient-headline {
                  background-image: linear-gradient(90deg, #a5b4fc, #60a5fa);
                }

                .dot-pattern {
                  background-image: radial-gradient(circle at 1px 1px, var(--dot-pattern-color) 1px, transparent 0);
                  background-size: 24px 24px;
                  border-bottom: 1px solid var(--border-secondary);
                  transition: background-image 0.3s ease, border-color 0.3s ease;
                }

                @keyframes floating-bubbles {
                  0% { transform: translateY(0) scale(0.5); opacity: 0; }
                  50% { opacity: 0.1; }
                  100% { transform: translateY(-100vh) scale(1); opacity: 0; }
                }

                .animated-bubbles-bg { position: relative; overflow: hidden; }
                .bubbles { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
                .bubbles span { position: absolute; bottom: -150px; width: 40px; height: 40px; background-color: var(--bubble-color); opacity: 0; border-radius: 50%; animation: floating-bubbles 15s linear infinite; }
                .bubbles span:nth-child(1) { left: 10%; width: 80px; height: 80px; animation-delay: 0s; animation-duration: 10s; }
                .bubbles span:nth-child(2) { left: 30%; width: 30px; height: 30px; animation-delay: 2s; animation-duration: 12s; }
                .bubbles span:nth-child(3) { left: 50%; width: 60px; height: 60px; animation-delay: 5s; animation-duration: 15s; }
                .bubbles span:nth-child(4) { left: 70%; width: 20px; height: 20px; animation-delay: 1s; animation-duration: 18s; }
                .bubbles span:nth-child(5) { left: 90%; width: 50px; height: 50px; animation-delay: 7s; animation-duration: 13s; }

                .card {
                  background-color: var(--bg-card);
                  border: 1px solid var(--border-secondary);
                  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
                }

                .card:hover {
                  transform: translateY(-4px);
                  box-shadow: 0 8px 25px -3px rgba(59, 130, 246, 0.15), 0 3px 10px -4px rgba(59, 130, 246, 0.15);
                }

                .header {
                  background-color: var(--bg-header);
                  border-bottom: 1px solid var(--border-primary);
                  transition: background-color 0.3s ease, border-color 0.3s ease;
                }

                .mobile-menu {
                  background-color: var(--bg-primary);
                  border-bottom: 1px solid var(--border-secondary);
                  transition: background-color 0.3s ease, border-color 0.3s ease;
                }

                .scroll-fade-in {
                  opacity: 0;
                  transform: perspective(1000px) rotateX(10deg) scale(0.95);
                  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                }

                .scroll-fade-in.visible {
                  opacity: 1;
                  transform: perspective(1000px) rotateX(0deg) scale(1);
                }

                .footer {
                  background-color: var(--bg-secondary);
                  border-top: 1px solid var(--border-secondary);
                  transition: background-color 0.3s ease, border-color 0.3s ease;
                }

                .footer-copyright {
                  background-color: var(--bg-primary);
                  transition: background-color 0.3s ease;
                }

                .form-label {
                  display: block;
                  font-weight: 500;
                  margin-bottom: 0.5rem;
                  color: var(--text-primary);
                }

                .form-input, .form-select {
                  display: block;
                  width: 100%;
                  padding: 0.75rem 1rem;
                  border-radius: 0.5rem;
                  border: 1px solid var(--border-secondary);
                  background-color: var(--bg-secondary);
                  color: var(--text-primary);
                  transition: border-color 0.3s ease, box-shadow 0.3s ease;
                }

                .form-input:focus, .form-select:focus {
                  outline: none;
                  border-color: var(--text-link);
                  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }

                .btn-loading {
                  opacity: 0.7;
                  cursor: not-allowed;
                  position: relative;
                }

                .btn-loading::after {
                  content: '';
                  position: absolute;
                  right: 1.5rem;
                  top: 50%;
                  transform: translateY(-50%);
                  width: 1.25rem;
                  height: 1.25rem;
                  border: 2px solid #fff;
                  border-top-color: transparent;
                  border-radius: 50%;
                  animation: spin 0.6s linear infinite;
                }

                @keyframes spin {
                  to { transform: translateY(-50%) rotate(360deg); }
                }

                .tab-button {
                  appearance: none;
                  -webkit-appearance: none;
                  background-color: transparent;
                  border: 2px solid transparent;
                  cursor: pointer;
                  margin: 0;
                  padding: 0.75rem 1.5rem;
                  font-weight: 600;
                  border-radius: 0.5rem;
                  color: var(--text-secondary);
                  transition: all 0.3s ease;
                }

                .tab-button:hover {
                  background-color: var(--bg-secondary);
                  color: var(--text-primary);
                }

                .tab-button.active {
                  color: var(--text-link);
                  border-color: var(--text-link);
                  background-color: color-mix(in srgb, var(--text-link) 10%, transparent);
                }

                .portal-view {
                  display: none;
                }

                .portal-view.active {
                  display: block;
                }
            `}</style>
        </div>
    );
};

export default ResultsPage;