'use client';

import { useState } from 'react';
import { useAuth } from '@/hook/useAuth';

export default function LoginPage() {
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email & password');
      return;
    }

    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-red-600 flex flex-col">

      {/* 🔴 HEADER SAME LIKE REACT NATIVE */}
      <div className="h-[45vh] flex flex-col items-center justify-center px-4">

        <h1 className="text-white text-3xl md:text-5xl font-bold text-center">
          PTL Tirumala Traders
        </h1>

        <p className="text-red-100 mt-3 text-sm md:text-lg">
          Welcome Back 👋
        </p>

      </div>

      {/* ⚪ BOTTOM FORM AREA */}
      <div className="flex-1 bg-gray-100 rounded-t-[35px] px-4 py-8 flex justify-center">

        <div className="w-full max-w-md">

          {/* 🧾 CARD */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">

            <h2 className="text-2xl md:text-3xl font-bold text-center text-black mb-6">
              Login
            </h2>

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                border
                border-gray-200
                bg-gray-50
                rounded-xl
                px-4
                py-4
                mb-4
                outline-none
                text-black
                focus:ring-2
                focus:ring-red-500
              "
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full
                border
                border-gray-200
                bg-gray-50
                rounded-xl
                px-4
                py-4
                mb-4
                outline-none
                text-black
                focus:ring-2
                focus:ring-red-500
              "
            />

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-center mb-4">
                {error}
              </p>
            )}

            {/* BUTTON */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="
                w-full
                bg-green-600
                hover:bg-green-700
                transition-all
                text-white
                py-4
                rounded-xl
                font-bold
                text-lg
              "
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}