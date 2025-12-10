import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Users, FileText, Menu, X, LogOut, Database, Moon, Sun, Globe } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { useAppContext } from '../contexts/AppContext';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme, language, setLanguage, t } = useAppContext();
  
  const handleLogout = () => {
    localStorage.removeItem('ps_auth_token');
    navigate('/login');
  };

  const navItems = [
    { label: t('dashboard'), path: '/', icon: LayoutDashboard },
    { label: t('admissionForm'), path: '/add', icon: UserPlus },
    { label: t('studentList'), path: '/list', icon: Users },
    { label: t('reports'), path: '/report', icon: FileText },
  ];

  const logoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/240px-Government_Seal_of_Bangladesh.svg.png";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row print:block print:bg-white print:min-h-0 transition-colors duration-200">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-green-700 dark:bg-gray-800 text-white p-4 flex justify-between items-center no-print">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full p-1 flex items-center justify-center">
             <img src={logoUrl} alt="BD Govt Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-sm">Kagapasha GPS</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-200 ease-in-out no-print
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 text-green-700 dark:text-green-500">
          <div className="w-10 h-10 flex-shrink-0">
             <img src={logoUrl} alt="BD Govt Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-gray-800 dark:text-white">{t('schoolName')}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('systemName')}</p>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
           {/* DB Status Indicator */}
          <div className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
            isSupabaseConfigured ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
          }`}>
            <Database className="w-3 h-3" />
            {isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage'}
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('signOut')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto h-screen print:h-auto print:overflow-visible print:block flex flex-col">
        
        {/* Desktop Header / Toolbar */}
        <header className="hidden md:flex bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-8 justify-between items-center no-print sticky top-0 z-30">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
             {/* Dynamic Breadcrumb-like title could go here */}
          </h2>

          <div className="flex items-center gap-4">
             {/* Language Switcher */}
             <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${language === 'en' ? 'bg-white dark:bg-gray-600 text-green-700 dark:text-green-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setLanguage('bn')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${language === 'bn' ? 'bg-white dark:bg-gray-600 text-green-700 dark:text-green-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                >
                  বাংলা
                </button>
             </div>

             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme}
               className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
               title="Toggle Theme"
             >
               {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
             </button>
          </div>
        </header>

        {/* Mobile Controls (Visible only on mobile below header) */}
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex justify-end items-center gap-3 no-print">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button onClick={() => setLanguage('en')} className={`px-2 py-1 text-xs font-bold rounded ${language === 'en' ? 'bg-white dark:bg-gray-600 text-green-700 dark:text-green-300 shadow' : 'text-gray-500 dark:text-gray-400'}`}>EN</button>
                <button onClick={() => setLanguage('bn')} className={`px-2 py-1 text-xs font-bold rounded ${language === 'bn' ? 'bg-white dark:bg-gray-600 text-green-700 dark:text-green-300 shadow' : 'text-gray-500 dark:text-gray-400'}`}>BN</button>
             </div>
             <button onClick={toggleTheme} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
               {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
             </button>
        </div>

        <div className="p-4 md:p-8 mx-auto print:p-0 print:max-w-none print:w-full w-full">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/50 z-30 md:hidden no-print"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;