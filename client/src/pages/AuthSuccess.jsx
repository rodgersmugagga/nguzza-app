import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('processing'); // processing | success | error

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userString = params.get('user');

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        const authData = { token, user };

        // Dispatch success to Redux (redux-persist handles localStorage)
        dispatch(signInSuccess(authData));

        // Remove sensitive query params from browser history
        window.history.replaceState({}, '', '/auth-success');

        setStatus('success');
        setTimeout(() => navigate('/', { replace: true }), 800);
      } catch (error) {
        console.error('Error parsing OAuth user data:', error);
        setStatus('error');
        setTimeout(() => navigate('/sign-in?error=data_parse_error', { replace: true }), 2000);
      }
    } else {
      const error = params.get('error');
      setStatus('error');
      setTimeout(() => navigate(`/sign-in?error=${error || 'missing_auth_data'}`, { replace: true }), 2000);
    }

    // Safety timeout — redirect to sign-in if stuck
    const safety = setTimeout(() => {
      setStatus((prev) => {
        if (prev === 'processing') {
          navigate('/sign-in?error=timeout', { replace: true });
        }
        return prev;
      });
    }, 10000);

    return () => clearTimeout(safety);
  }, [location, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
      <div className="text-center px-6">
        {status === 'processing' && (
          <>
            <div className="w-14 h-14 border-[3px] border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
            <h2 className="text-lg font-bold text-gray-800 mb-1">Completing Sign In</h2>
            <p className="text-sm text-gray-400">Please wait…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Welcome to Nguzza!</h2>
            <p className="text-sm text-gray-400">Redirecting…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Sign In Failed</h2>
            <p className="text-sm text-gray-400">Redirecting to sign in…</p>
          </>
        )}
      </div>
    </div>
  );
}
