import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, Lock, User } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useAppContext();
  // Pre-filled credentials for testing convenience
  const [email, setEmail] = useState('admin@school.gov.bd');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('ps_auth_token', 'mock_token_123');
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4 transition-colors">
      <div className="mb-8 text-center">
        <div className="bg-green-600 text-white p-4 rounded-full inline-flex mb-4 shadow-lg">
           <School className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-green-900 dark:text-white">Primary School System</h1>
        <p className="text-green-700 dark:text-green-400">Admission & Survey Management 2025</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-green-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">{t('adminLogin')}</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('emailAddr')}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="admin@school.gov.bd"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all transform active:scale-95 shadow-md"
          >
            {loading ? t('authenticating') : t('signIn')}
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          <p>{t('restrictedAccess')}</p>
          <p className="mt-2 text-green-600 dark:text-green-400">(Test Mode: Click Sign In to continue)</p>
        </div>
      </div>
    </div>
  );
};

export default Login;