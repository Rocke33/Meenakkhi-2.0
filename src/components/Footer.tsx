import { Link } from 'react-router-dom';

// ── Official brand SVG logos ──────────────────────────────────────────────────

// Facebook official blue "f" logo
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#1877F2"/>
    <path d="M16.5 3H14C11.2386 3 9 5.23858 9 8V9H7V12H9V21H12.6V12H15.4L16 9H12.6V8C12.6 7.44772 13.0477 7 13.6 7H16.5V3Z" fill="white"/>
  </svg>
);

// Instagram official gradient logo
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-grad" cx="30%" cy="107%" r="140%">
        <stop offset="0%" stopColor="#fdf497"/>
        <stop offset="5%" stopColor="#fdf497"/>
        <stop offset="45%" stopColor="#fd5949"/>
        <stop offset="60%" stopColor="#d6249f"/>
        <stop offset="90%" stopColor="#285AEB"/>
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="5" fill="url(#ig-grad)"/>
    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
    <circle cx="17" cy="7" r="1.1" fill="white"/>
  </svg>
);

// Twitter official logo
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1DA1F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
  </svg>
);

// Visa official blue wordmark logo
const VisaIcon = () => (
  <svg viewBox="0 0 60 24" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="24" rx="4" fill="#1A1F71"/>
    <path d="M22.5 16.5H19.7L21.5 7.5H24.3L22.5 16.5ZM17.1 7.5L14.5 13.5L14.2 11.9L13.2 8.2C13.2 8.2 13.1 7.5 12.2 7.5H8L7.9 7.7C7.9 7.7 9.2 7.9 10.7 8.8L13.1 16.5H16.1L20.5 7.5H17.1ZM35.7 16.5H38.4L36 7.5H33.7C33 7.5 32.6 7.9 32.3 8.5L28.2 16.5H31.2L31.8 14.8H35.4L35.7 16.5ZM32.6 12.7L34.1 8.8L34.9 12.7H32.6ZM28.4 9.8L28.8 7.8C28.8 7.8 27.6 7.4 26.4 7.4C25.1 7.4 22 8 22 10.5C22 12.8 25.2 12.8 25.2 14C25.2 15.2 22.4 15 21.5 14.2L21.1 16.3C21.1 16.3 22.3 16.8 24.1 16.8C25.9 16.8 28.9 15.9 28.9 13.2C28.9 10.5 25.7 10.3 25.7 9.2C25.7 8.1 28 8.3 28.4 9.8Z" fill="#F7A800"/>
  </svg>
);

// bKash pink logo (falls back to a text badge if the asset is missing)
const BkashIcon = () => (
  <img
    src="/bkash.png"
    alt="bKash"
    className="h-5 w-auto object-contain"
    onError={(e) => {
      const el = e.currentTarget;
      el.style.display = 'none';
      el.insertAdjacentHTML('afterend', '<span class="text-[11px] font-black text-[#E2136E]">bKash</span>');
    }}
  />
);

// Nagad logo (falls back to a text badge if the asset is missing)
const NagadIcon = () => (
  <img
    src="/nagad.png"
    alt="Nagad"
    className="h-5 w-auto object-contain"
    onError={(e) => {
      const el = e.currentTarget;
      el.style.display = 'none';
      el.insertAdjacentHTML('afterend', '<span class="text-[11px] font-black text-[#F6921E]">Nagad</span>');
    }}
  />
);

export default function Footer() {
  return (
    <footer className="bg-[#1A0E07] text-white pt-10 sm:pt-14 pb-20 lg:pb-10 font-sans mt-auto relative overflow-hidden">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E5B84A]/60 to-transparent" />
      {/* Background fish watermark */}
      <img
        src="/logo.png"
        alt=""
        aria-hidden="true"
        className="absolute -bottom-6 right-0 sm:right-8 h-52 sm:h-72 w-auto opacity-[0.04] pointer-events-none select-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-10">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2">
            {/* Logo + Name */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#4A2E1A] border border-[#E5B84A]/30 rounded-xl p-1.5 flex-shrink-0">
                <img src="/logo.png" alt="Meenakkhi Logo" className="h-11 w-auto rounded-lg" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#E5B84A] leading-tight">মীনাক্ষী</h3>
                <p className="text-[9px] font-bold uppercase tracking-[.2em] text-white/50">Meenakkhi Sarees Boutique</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/55 leading-relaxed max-w-sm mb-5">
              Your premier online boutique for authentic Dhakai Jamdani, pure Katan Silk, Rajshahi Silk, Muslin, Organza, and bespoke Bridal Sarees — woven with heritage craftsmanship across Bangladesh.
            </p>

            {/* Social icons row */}
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/35 mr-1">Follow Us</span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                title="Facebook"
                className="transition hover:scale-110 hover:opacity-90 active:scale-95 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A]"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                title="Instagram"
                className="transition hover:scale-110 hover:opacity-90 active:scale-95 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A]"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                title="Twitter"
                className="transition hover:scale-110 hover:opacity-90 active:scale-95 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A]"
              >
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div className="min-w-0">
            <h4 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#E5B84A] mb-3 pb-2 border-b border-white/10">
              <span className="w-1 h-3.5 bg-[#E5B84A] rounded-full flex-shrink-0" />
              Collections
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/products', label: 'All Saree Weaves' },
                { to: '/category/katan', label: 'Katan Silk' },
                { to: '/category/jamdani', label: 'Dhakai Jamdani' },
                { to: '/category/bridal%20collection', label: 'Bridal Collection' },
                { to: '/category/rajshahi%20silk', label: 'Rajshahi Silk' },
                { to: '/category/muslin', label: 'Muslin' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[11px] sm:text-xs text-white/55 hover:text-[#E5B84A] transition-colors duration-150 block truncate leading-relaxed rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="min-w-0">
            <h4 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#E5B84A] mb-3 pb-2 border-b border-white/10">
              <span className="w-1 h-3.5 bg-[#E5B84A] rounded-full flex-shrink-0" />
              Customer Care
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/cart', label: 'Shopping Cart' },
                { to: '/profile', label: 'My Orders' },
                { to: '/orders', label: 'Top Sellers' },
                { to: '/login', label: 'Sign In' },
                { to: '/register', label: 'Create Account' },
                { to: '/admin', label: 'Admin Portal' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[11px] sm:text-xs text-white/55 hover:text-[#E5B84A] transition-colors duration-150 block truncate leading-relaxed rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── PAYMENT METHODS BAR (No COD) ── */}
        <div className="border-t border-white/10 pt-5 mb-5">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 flex-shrink-0">
              Official Payment Partners:
            </span>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="bg-white rounded-md px-2.5 py-1 flex items-center justify-center shadow-sm h-8" title="Visa">
                <VisaIcon />
              </div>
              <div className="bg-white rounded-md px-2.5 py-1 flex items-center justify-center shadow-sm h-8" title="bKash">
                <BkashIcon />
              </div>
              <div className="bg-white rounded-md px-2.5 py-1 flex items-center justify-center shadow-sm h-8" title="Nagad">
                <NagadIcon />
              </div>
            </div>
          </div>
        </div>

        {/* ── COPYRIGHT BAR ── */}
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p className="text-[10px] sm:text-[11px] text-white/50 leading-relaxed font-medium">
            © {new Date().getFullYear()} Meenakkhi Sarees Boutique. All rights reserved.
          </p>
          <p className="text-[10px] sm:text-[11px] text-white/40 leading-relaxed font-medium">
            This site is created by <span className="text-[#E5B84A] font-bold">Rocke .</span>
          </p>
        </div>
      </div>
    </footer>
  );
}