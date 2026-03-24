'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-brown-900 border border-brown-700 p-8 space-y-5">
        <h1 className="font-serif text-2xl text-cream-100 mb-6">Sign In</h1>

        {error && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-300 font-sans text-xs px-4 py-3">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="space-y-2">
          <label className="font-sans text-[10px] tracking-widest uppercase text-brown-400">
            Username
          </label>
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-500" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-brown-800 border border-brown-600 text-cream-100 font-sans text-sm pl-9 pr-4 py-3 focus:outline-none focus:border-cream-400 transition-colors placeholder:text-brown-600"
              placeholder="admin"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="font-sans text-[10px] tracking-widest uppercase text-brown-400">
            Password
          </label>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-brown-800 border border-brown-600 text-cream-100 font-sans text-sm pl-9 pr-10 py-3 focus:outline-none focus:border-cream-400 transition-colors placeholder:text-brown-600"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-500 hover:text-brown-300 transition-colors"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cream-400 text-brown-950 font-sans font-bold text-xs tracking-widest uppercase py-3.5 hover:bg-cream-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>

      <p className="text-center font-sans text-xs text-brown-600">
        <a href="/" className="hover:text-brown-400 transition-colors">
          ← Back to shop
        </a>
      </p>
    </form>
  );
}
