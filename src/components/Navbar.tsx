import { useEffect, useState, useCallback, useMemo } from 'react';
import type { User } from '@supabase/supabase-js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import {
  FiShoppingBag, FiUser, FiSearch, FiMenu, FiX,
  FiShield, FiArrowRight, FiHome, FiGrid, FiTrendingUp, FiHeart,
} from 'react-icons/fi';

export default function Navbar() {
  const { cartCount, isShivering } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Scroll detector for dynamic backdrop glassmorphism
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Supabase auth listener
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const u = session?.user || null;
      setUser(u);
      setUserName(u?.user_metadata?.display_name || null);
    };
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      setUser(u);
      setUserName(u?.user_metadata?.display_name || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = useCallback((path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const displayName = useMemo(() =>
    userName || (user && (user.user_metadata?.display_name || user.email?.split('@')[0])) || null,
    [userName, user]
  );

  const navLinks = [
    { name: 'HOME', path: '/', Icon: FiHome },
    { name: 'SAREE COLLECTION', path: '/products', Icon: FiGrid },
    { name: 'TOP SELL', path: '/orders', Icon: FiTrendingUp },
    { name: 'MY PROFILE', path: user ? '/profile' : '/login', Icon: FiUser },
  ];

  const handleWishlistClick = () => {
    navigate('/products');
  };

  return (
    <>
      {/* ── TOP FIXED NAVBAR ── */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#20140D]/95 backdrop-blur-xl border-b border-[#E5B84A]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2 sm:py-2.5'
            : 'bg-[#24160E]/98 backdrop-blur-md border-b border-white/10 shadow-lg py-2.5 sm:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 min-w-0">

          {/* BRAND LOGO — Matches Screenshot 1 & 2 */}
          <Link
            to="/"
            className="group flex items-center gap-2 sm:gap-3 shrink-0 min-w-0 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative flex-shrink-0 p-1 rounded-xl bg-gradient-to-br from-[#E5B84A]/25 via-black/40 to-[#2A170C] border border-[#E5B84A]/40 group-hover:border-[#E5B84A]/80 shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-all duration-300">
              <img
                src="/logo.png"
                alt="Meenakkhi Sarees Logo"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="h-8 sm:h-9 md:h-10 w-auto object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-base sm:text-lg md:text-xl font-bold text-white leading-none tracking-wide drop-shadow-sm group-hover:text-[#F3D78A] transition-colors">
                মীনাক্ষী
              </span>
              <span className="text-[8px] sm:text-[9.5px] font-sans uppercase tracking-[0.22em] text-[#E5B84A] font-medium mt-1">
                MEENAKKHI SAREES
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV PILL CONTAINER — Matches Screenshot 1 */}
          <div className="hidden lg:flex items-center gap-1 bg-black/45 px-3 py-1.5 rounded-full border border-white/10 shadow-inner backdrop-blur-md">
            {navLinks.map(({ name, path }) => {
              const active = isActive(path);
              return (
                <Link
                  key={name}
                  to={path}
                  aria-current={active ? 'page' : undefined}
                  className={`relative text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A] ${
                    active
                      ? 'text-[#F3D78A] bg-white/[0.14] shadow-sm font-extrabold'
                      : 'text-stone-300 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {name}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-gradient-to-r from-[#C8962A] via-[#E5B84A] to-[#C8962A] rounded-full shadow-[0_0_8px_rgba(229,184,74,0.8)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            <span className="h-3.5 w-px bg-white/20 mx-1 flex-shrink-0" />

            {/* ADMIN BUTTON WITH SHIELD — Matches Screenshot 1 */}
            <Link
              to="/admin"
              aria-current={isActive('/admin') ? 'page' : undefined}
              className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all duration-200 whitespace-nowrap flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A] ${
                isActive('/admin')
                  ? 'bg-[#E5B84A]/30 text-[#F3D78A] border-[#E5B84A]/70 shadow-[0_0_12px_rgba(229,184,74,0.3)]'
                  : 'bg-transparent text-[#E5B84A] border-[#E5B84A]/50 hover:bg-[#E5B84A]/20 hover:text-white hover:border-[#E5B84A]/80'
              }`}
            >
              <FiShield className="w-3.5 h-3.5 flex-shrink-0 text-[#E5B84A]" />
              <span>ADMIN</span>
            </Link>
          </div>

          {/* RIGHT SIDE ACTIONS — Matches Screenshot 1 (Desktop) & Screenshot 2 (Mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">

            {/* SEARCH ICON BUTTON */}
            <button
              onClick={() => navigate('/products')}
              title="Search Saree Collection"
              aria-label="Search Collection"
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black/30 border border-white/10 text-stone-200 hover:bg-white/10 hover:text-[#E5B84A] hover:border-[#E5B84A]/40 transition duration-200 active:scale-95 cursor-pointer flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A]"
            >
              <FiSearch className="w-4 h-4" />
            </button>

            {/* WISHLIST (HEART) ICON BUTTON (Desktop) — Matches Screenshot 1 */}
            <button
              onClick={handleWishlistClick}
              title="Saved Wishlist"
              aria-label="Wishlist"
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl bg-black/30 border border-white/10 text-stone-200 hover:bg-white/10 hover:text-rose-400 hover:border-rose-400/40 transition duration-200 active:scale-95 cursor-pointer flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A]"
            >
              <FiHeart className="w-4 h-4" />
            </button>

            {/* AUTH (DESKTOP) — Matches Screenshot 1 */}
            {!user ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-wider text-stone-200 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  SIGN IN
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#E5B84A] to-[#D4A338] hover:brightness-110 text-[#1E110A] px-4 py-2 rounded-xl shadow-[0_2px_10px_rgba(229,184,74,0.3)] transition-all duration-200 active:scale-95 whitespace-nowrap"
                >
                  REGISTER
                </Link>
              </div>
            ) : (
              <button
                onClick={() => navigate('/profile')}
                type="button"
                className="hidden lg:flex items-center gap-2 bg-black/30 hover:bg-white/10 text-stone-100 text-xs font-semibold rounded-xl px-3 py-2 border border-white/10 hover:border-[#E5B84A]/40 max-w-[150px] transition duration-200 active:scale-95 cursor-pointer flex-shrink-0"
              >
                <div className="p-1 rounded-full bg-[#E5B84A]/20 text-[#E5B84A]">
                  <FiUser className="w-3 h-3 flex-shrink-0" />
                </div>
                <span className="truncate">{displayName || user.email?.split('@')[0]}</span>
              </button>
            )}

            {/* TOP CART BUTTON — Matches Screenshot 1 & 2 */}
            <Link
              to="/cart"
              className={`relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl transition-all duration-300 border shadow-sm flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A] ${
                isShivering
                  ? 'bg-[#E5B84A] border-[#C8962A] text-[#2C1A0E] scale-110 ring-4 ring-[#E5B84A]/40'
                  : isActive('/cart')
                  ? 'bg-gradient-to-r from-[#E5B84A] to-[#D4A338] border-[#C8962A] text-[#2C1A0E] shadow-[0_0_15px_rgba(229,184,74,0.4)]'
                  : 'bg-black/30 border-white/10 text-white hover:border-[#E5B84A]/60 hover:text-[#E5B84A] active:scale-95'
              }`}
              title="Shopping Cart"
              aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} item${cartCount === 1 ? '' : 's'}` : ''}`}
            >
              <FiShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {/* Badge shows count, including 0 if on desktop or > 0 on mobile */}
              <span
                className={`absolute -top-1.5 -right-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full px-1 text-[9px] font-black shadow-md transition-all duration-300 ${
                  isShivering
                    ? 'bg-[#2C1A0E] text-[#E5B84A] ring-2 ring-[#E5B84A] scale-125'
                    : 'bg-[#E5B84A] text-[#2C1A0E] ring-2 ring-[#24160E]'
                }`}
              >
                {cartCount}
              </span>
            </Link>

            {/* MOBILE HAMBURGER TOGGLE — Matches Screenshot 2 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black/30 text-stone-200 hover:text-white border border-white/10 transition duration-200 active:scale-95 cursor-pointer flex items-center justify-center flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A]"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {isMobileMenuOpen ? <FiX className="w-4.5 h-4.5" /> : <FiMenu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE SLIDE-OUT DRAWER ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#120a05]/80 backdrop-blur-sm z-50 lg:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed top-0 right-0 bottom-0 w-[84%] max-w-sm bg-gradient-to-b from-[#341d10] to-[#24130a] border-l border-[#E5B84A]/30 shadow-2xl z-50 lg:hidden flex flex-col overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-black/30">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1.5 rounded-xl bg-gradient-to-br from-[#E5B84A]/25 to-black/40 border border-[#E5B84A]/40 shrink-0">
                    <img
                      src="/logo.png"
                      alt="Meenakkhi"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      className="h-8 w-auto rounded-md"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-white font-bold text-base leading-tight">মীনাক্ষী Sarees</h3>
                    <p className="text-[9px] uppercase tracking-widest text-[#E5B84A] font-semibold mt-0.5">Boutique Menu</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-white/10 text-stone-200 hover:text-white border border-white/15 cursor-pointer flex-shrink-0 transition active:scale-95"
                  aria-label="Close menu"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Nav Links */}
              <div className="flex flex-col gap-1.5 p-4 sm:p-5 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 px-2 mb-2">
                  Navigation Menu
                </span>

                {navLinks.map(({ name, path, Icon }) => {
                  const active = isActive(path);
                  return (
                    <Link
                      key={name}
                      to={path}
                      className={`flex items-center justify-between min-h-[48px] px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                        active
                          ? 'bg-[#E5B84A]/20 text-[#F3D78A] border border-[#E5B84A]/40 shadow-xs'
                          : 'text-stone-200 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-3.5">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#E5B84A]' : 'text-stone-400'}`} />
                        {name}
                      </span>
                      <FiArrowRight className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-[#E5B84A]' : 'text-stone-500'}`} />
                    </Link>
                  );
                })}

                <div className="my-2 border-t border-white/10" />

                <Link
                  to="/admin"
                  className={`flex items-center justify-between min-h-[48px] px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    isActive('/admin')
                      ? 'bg-[#E5B84A]/25 text-[#F3D78A] border-[#E5B84A]/60 shadow-xs'
                      : 'bg-black/25 text-[#E5B84A] border-[#E5B84A]/30 hover:bg-[#E5B84A]/15'
                  }`}
                >
                  <span className="flex items-center gap-3.5">
                    <FiShield className="w-4 h-4 flex-shrink-0 text-[#E5B84A]" />
                    Admin Panel
                  </span>
                  <FiArrowRight className="w-3.5 h-3.5 flex-shrink-0 text-[#E5B84A]/80" />
                </Link>

                <Link
                  to="/cart"
                  className={`flex items-center justify-between min-h-[48px] px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive('/cart')
                      ? 'bg-[#E5B84A]/20 text-[#F3D78A] border border-[#E5B84A]/40'
                      : 'text-stone-200 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3.5">
                    <FiShoppingBag className={`w-4 h-4 flex-shrink-0 ${isActive('/cart') ? 'text-[#E5B84A]' : 'text-stone-400'}`} />
                    Shopping Cart ({cartCount})
                  </span>
                  <FiArrowRight className={`w-3.5 h-3.5 flex-shrink-0 ${isActive('/cart') ? 'text-[#E5B84A]' : 'text-stone-500'}`} />
                </Link>
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-white/10 p-4 sm:p-5 bg-black/30">
                {!user ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      to="/login"
                      className="flex items-center justify-center min-h-[44px] rounded-xl border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center min-h-[44px] rounded-xl bg-gradient-to-r from-[#E5B84A] to-[#D4A338] text-[#1E110A] font-black text-xs uppercase tracking-wider hover:brightness-110 transition shadow-md"
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-white/[0.08] p-3 rounded-xl border border-white/10">
                    <div className="p-2 rounded-lg bg-[#E5B84A]/20 text-[#E5B84A] flex-shrink-0">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{displayName}</p>
                      <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MOBILE FIXED BOTTOM NAVIGATION BAR — Matches Screenshot 2 ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#24160E]/98 backdrop-blur-xl border-t border-[#E5B84A]/30 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4 w-full max-w-md mx-auto">
          {[
            { icon: FiHome, label: 'HOME', path: '/' },
            { icon: FiGrid, label: 'SHOP', path: '/products' },
            { icon: FiShoppingBag, label: 'CART', path: '/cart', badge: cartCount },
            { icon: FiUser, label: 'PROFILE', path: user ? '/profile' : '/login' },
          ].map(({ icon: Icon, label, path, badge }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                aria-current={active ? 'page' : undefined}
                aria-label={badge !== undefined && badge > 0 ? `${label}, ${badge} item${badge === 1 ? '' : 's'}` : label}
                className={`flex flex-col items-center justify-center py-2 gap-0.5 relative transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A] focus-visible:ring-inset ${
                  active ? 'text-[#F3D78A]' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`} />
                  {badge !== undefined && badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E5B84A] text-[#2C1A0E] text-[8px] font-black px-1 ring-2 ring-[#24160E]">
                      {badge}
                    </span>
                  )}
                </div>
                <span className={`text-[9px] uppercase tracking-wider leading-tight ${active ? 'font-bold' : 'font-medium'}`}>
                  {label}
                </span>
                {active && (
                  <motion.span
                    layoutId="activeBottomTab"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-gradient-to-r from-[#C8962A] via-[#E5B84A] to-[#C8962A] rounded-full shadow-[0_0_8px_rgba(229,184,74,0.9)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}