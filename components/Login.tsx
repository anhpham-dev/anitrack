
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-sm p-8 space-y-8 bg-card rounded-2xl shadow-2xl shadow-primary/20 border border-primary/20 animate-scale-up">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-tight">
                Ani<span className="text-primary">Track</span>
            </h1>
            <p className="mt-2 text-text-secondary">Login to access your anime gallery.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input w-full"
              placeholder="Username"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input w-full"
              placeholder="Password"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-3 font-semibold text-white bg-primary rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50"
          >
            Login
          </button>
        </form>
      </div>
      <style>{`
        .input {
          background-color: #111827;
          border: 1px solid #4b5563;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          color: #f9fafb;
          transition: all 0.3s ease;
        }
        .input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 15px 2px rgba(109, 40, 217, 0.6);
        }
        .label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default Login;
