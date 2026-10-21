import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Footer from '../components/Footer';
import { getErrorMessage } from '../utils/errorHandling';
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi';

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const targetEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: targetEmail,
        password,
        options: { data: { display_name: fullName.trim() } },
      });
      if (error) {
        throw new Error(
          error.message.toLowerCase().includes('already registered')
            ? 'This email address is already registered.'
            : error.message
        );
      }
      if (data?.user) {
        await supabase
          .from('profiles')
          .upsert([{ id: data.user.id, name: fullName.trim(), email: targetEmail }]);
      }
      setSuccessMsg('Account created! Redirecting to your collection…');
      setTimeout(() => navigate('/'), 1500);
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
            <img
              src="/logo.png"
              alt=""
              className="absolute bottom-0 right-0 h-40 w-auto opacity-10 pointer-events-none select-none"
            />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[.3em] text-[#E5B84A]/80">
                মীনাক্ষী / Join Us
              </p>
              <h2 className="mt-14 max-w-xs font-serif text-3xl sm:text-4xl leading-tight text-white">
                Make room for beautiful things.
              </h2>
            </div>
            <p className="max-w-xs border-t border-white/20 pt-5 text-xs sm:text-sm leading-relaxed text-white/60 relative z-10">
              Save your favourites, follow new arrivals, and keep every occasion close.
            </p>
          </aside>

          {/* Right form */}
          <section className="p-5 sm:p-8 md:p-10">
            <div className="mb-6 sm:mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#8B5E3C]">Begin Your Edit</p>
              <h1 className="mt-2 font-serif text-2xl sm:text-3xl text-[#4A2E1A] font-bold">Create Account</h1>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#9C7B65]">
                A quieter way to discover the saree meant for you.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 rounded-xl">
                ⚠️ {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 rounded-xl">
                🎉 {successMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.18em] text-[#6B4226]">
                  Full Name
                </span>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C7B65]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full border border-[#E8DDD3] bg-[#FAF6F0] pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl outline-none transition placeholder:text-[#9C7B65]/60 focus:border-[#6B4226] focus:ring-2 focus:ring-[#6B4226]/20"
                  />
                </div>
              </label>

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
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
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
                {loading ? 'Creating Account…' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs sm:text-sm text-[#9C7B65]">
              Already a member?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-bold text-[#6B4226] hover:text-[#4A2E1A] underline underline-offset-4 cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
