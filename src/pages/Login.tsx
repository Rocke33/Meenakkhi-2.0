import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Footer from '../components/Footer';
import { getErrorMessage } from '../utils/errorHandling';
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) {
        throw new Error(
          error.message.toLowerCase().includes('invalid login credentials')
            ? 'Incorrect email or password.'
            : error.message
        );
      }
      if (data?.user) navigate('/');
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] font-sans text-[#2C1A0E]">

      <main className="flex flex-1 items-center justify-center px-3 sm:px-5 pt-24 sm:pt-28 pb-24 lg:pb-12">
        <div className="grid w-full max-w-4xl overflow-hidden border border-[#E8DDD3] bg-white shadow-xl rounded-2xl md:grid-cols-[.85fr_1.15fr]">

          {/* Left panel */}
          <aside className="hidden bg-[#4A2E1A] p-8 sm:p-10 text-white md:flex md:flex-col md:justify-between relative overflow-hidden">
            {/* Logo watermark */}
            <img
              src="/logo.png"
              alt=""
              className="absolute bottom-0 right-0 h-40 w-auto opacity-10 pointer-events-none select-none"
            />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[.3em] text-[#E5B84A]/80">
                মীনাক্ষী / Member Access
              </p>
              <h2 className="mt-14 max-w-xs font-serif text-3xl sm:text-4xl leading-tight text-white">
                See the world with Meenakkhi
              </h2>
            </div>
            <p className="max-w-xs border-t border-white/20 pt-5 text-xs sm:text-sm leading-relaxed text-white/60 relative z-10">
              Your saved sarees, order history, and considered choices are waiting.
            </p>
          </aside>

          {/* Right form */}
          <section className="p-5 sm:p-8 md:p-10">
            <div className="mb-6 sm:mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#8B5E3C]">Welcome Back</p>
              <h1 className="mt-2 font-serif text-2xl sm:text-3xl text-[#4A2E1A] font-bold">Sign In</h1>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#9C7B65]">
                Access your collection and order history.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 rounded-xl">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 sm:space-y-5">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.18em] text-[#6B4226]">
                  Email Address
                </span>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C7B65]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border border-[#E8DDD3] bg-[#FAF6F0] pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl outline-none transition placeholder:text-[#9C7B65]/60 focus:border-[#6B4226] focus:ring-2 focus:ring-[#6B4226]/20"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.18em] text-[#6B4226]">
                  Password
                </span>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C7B65]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border border-[#E8DDD3] bg-[#FAF6F0] pl-10 pr-10 py-3 text-xs sm:text-sm rounded-xl outline-none transition placeholder:text-[#9C7B65]/60 focus:border-[#6B4226] focus:ring-2 focus:ring-[#6B4226]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C7B65] hover:text-[#6B4226] cursor-pointer transition"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </label>

              <button
                disabled={loading}
                type="submit"
                className="mt-2 w-full bg-[#6B4226] hover:bg-[#4A2E1A] px-5 py-3.5 text-xs font-bold uppercase tracking-[.2em] text-white rounded-xl transition cursor-pointer disabled:opacity-60 shadow-md"
              >
                {loading ? 'Signing In…' : 'Sign In Securely'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs sm:text-sm text-[#9C7B65]">
              New to Meenakkhi?{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-bold text-[#6B4226] hover:text-[#4A2E1A] underline underline-offset-4 cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
