import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const navLinks = [
  { text: 'Services', path: '/sentiment' },
  { text: 'Cases', path: '/analytics' },
  { text: 'Company', path: '/data-sources' },
  { text: 'Insights', path: '/real-time' },
  { text: 'Contacts', path: '/contact' },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>('en');

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'HI' },
    { code: 'es', label: 'ES' },
    { code: 'fr', label: 'FR' },
    { code: 'bn', label: 'BN' },
    { code: 'vi', label: 'VI' },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('preferred_language');
    if (stored) setSelectedLang(stored);
  }, []);

  const changeLanguage = (code: string) => {
    setSelectedLang(code);
    localStorage.setItem('preferred_language', code);
    // set html lang attribute for accessibility / SEO
  try { document.documentElement.lang = code; } catch { /* ignore */ }
    setLangOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 isolate bg-slate-900 text-slate-100 backdrop-blur supports-[backdrop-filter]:bg-slate-900 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 min-w-0">
            <div className="flex items-center cursor-pointer flex-shrink-0 whitespace-nowrap" onClick={() => navigate('/') }>
              <span className="text-lg md:text-xl font-semibold tracking-tight">SentimentAI</span>
            </div>

            <nav className="hidden lg:flex flex-1 items-center justify-center gap-8 min-w-0 overflow-x-auto">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <button
                    key={link.text}
                    onClick={() => navigate(link.path)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative inline-flex items-center text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                    } after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-white/80 after:transition-all after:duration-300 after:ease-out ${
                      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                    }`}
                  >
                    {link.text}
                  </button>
                );
              })}
            </nav>

            <div className="hidden lg:flex flex-shrink-0 items-center gap-4 relative">
              {/* Language selector */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen((s) => !s)}
                  aria-haspopup="listbox"
                  aria-expanded={!!langOpen}
                  className="px-3 py-2 bg-slate-800 text-slate-200 text-sm font-medium rounded-md hover:bg-slate-700 transition-colors flex items-center gap-2"
                  title="Preferred language"
                >
                  <span className="text-xs font-semibold">{selectedLang.toUpperCase()}</span>
                  <svg className="w-4 h-4 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                  </svg>
                </button>

                {langOpen && (
                  <ul role="listbox" aria-label="Select language" tabIndex={-1} className="absolute right-0 mt-2 w-32 bg-slate-800 text-slate-100 rounded-md shadow-lg border border-slate-700 z-50">
                    {languages.map((l) => (
                      <li
                        key={l.code}
                        role="option"
                        aria-selected={selectedLang === l.code ? true : false}
                        onClick={() => changeLanguage(l.code)}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-slate-700 ${selectedLang === l.code ? 'font-semibold bg-slate-700' : ''}`}
                      >
                        {l.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={() => navigate('/contact')}
                className="px-4 py-2 bg-white text-slate-900 text-sm font-semibold rounded-md hover:bg-slate-100 transition-colors"
              >
                Get in touch
              </button>
            </div>

            <div className="lg:hidden">
              <button 
                aria-label="Open menu" 
                onClick={() => setSidebarOpen(true)} 
                className="p-2 text-slate-200 hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;
