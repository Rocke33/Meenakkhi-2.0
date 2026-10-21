import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';

const slides = [
  {
    image: '/saree-campaign.png',
    tag: 'ROYAL BANGLADESHI SAREES',
    title: 'Sarees with a story in every thread.',
    description: 'Discover handpicked Bangladeshi sarees shaped by patient looms, graceful drapes, and motifs passed from generation to generation.',
    path: '/products',
    btnLabel: 'EXPLORE COLLECTION',
    secondaryBtnLabel: 'DISCOVER JAMDANI',
    secondaryPath: '/category/jamdani',
    seasonTag: 'THE NEW SEASON',
  },
  {
    image: '/saree-slide-2.png',
    tag: 'HERITAGE WEAVES',
    title: 'Quiet sheen. Certain presence.',
    description: 'Lustrous Katan and silks handwoven for grand occasions and quiet celebrations alike.',
    path: '/category/katan',
    btnLabel: 'VIEW KATAN',
    secondaryBtnLabel: 'EXPLORE ALL',
    secondaryPath: '/products',
    seasonTag: 'KATAN SILK EDIT',
  },
  {
    image: '/saree-slide-3.png',
    tag: 'AIR-LIGHT ARTISTRY',
    title: 'Woven poetry from the loom.',
    description: 'Intricate muslin and translucent Jamdani crafted meticulously by master artisans.',
    path: '/category/jamdani',
    btnLabel: 'EXPLORE JAMDANI',
    secondaryBtnLabel: 'VIEW MUSLIN',
    secondaryPath: '/category/muslin',
    seasonTag: 'DHAKAI JAMDANI',
  },
  {
    image: '/saree-slide-4.png',
    tag: 'FESTIVE & BRIDAL EDIT',
    title: 'Colour for the days you remember.',
    description: 'Vibrant hues and ornate zari accents curated for modern bridal trousseaus.',
    path: '/category/bridal%20collection',
    btnLabel: 'BRIDAL EDIT',
    secondaryBtnLabel: 'VIEW GALLERY',
    secondaryPath: '/products',
    seasonTag: 'BRIDAL COLLECTION',
  },
  {
    image: '/saree-slide-5.png',
    tag: 'TIMELESS HEIRLOOMS',
    title: 'Softly made for a life well lived.',
    description: 'Textiles woven to be worn, loved, and passed along with fond memories.',
    path: '/products',
    btnLabel: 'SEE COLLECTION',
    secondaryBtnLabel: 'TOP SELLERS',
    secondaryPath: '/orders',
    seasonTag: 'HERITAGE ARCHIVE',
  },
];

export default function Hero() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [isRippling, setIsRippling] = useState(false);

  const slide = slides[active];
  const fullTitle = slide.title;

  // Typewriter effect -> Water wave ripple -> Next slide cycle
  useEffect(() => {
    setTypedChars(0);
    setIsRippling(false);

    let charIndex = 0;
    const typeSpeed = 40; // ms per character

    const typeInterval = setInterval(() => {
      charIndex++;
      setTypedChars(charIndex);

      if (charIndex >= fullTitle.length) {
        clearInterval(typeInterval);

        // Allow pause then trigger water ripple effect
        setTimeout(() => {
          setIsRippling(true);

          // Transition to next slide after pause
          setTimeout(() => {
            setActive((prev) => (prev + 1) % slides.length);
          }, 3200);
        }, 500);
      }
    }, typeSpeed);

    return () => clearInterval(typeInterval);
  }, [active, fullTitle]);

  return (
    <section
      className="w-full relative select-none"
      role="region"
      aria-label="Hero Saree Showcase"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. LAPTOP / DESKTOP HERO SECTION — Matches Screenshot 1
          ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block w-full">
        <div className="w-full bg-[#4E1320] rounded-[28px] border border-[#E5B84A]/30 p-8 xl:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle ambient lighting inside the maroon card */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#E5B84A]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/40 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-12 gap-8 xl:gap-12 items-center relative z-10">

            {/* Left Content Column */}
            <div className="col-span-7 flex flex-col justify-center pr-2">
              
              {/* Tag with gold accent line */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1.5px] bg-[#E5B84A] inline-block" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#E5B84A]">
                  {slide.tag}
                </span>
              </div>

              {/* Large Serif Headline */}
              <h1 className="font-serif text-4xl xl:text-5xl font-bold text-[#FFF8F0] leading-[1.18] tracking-tight mb-5 min-h-[110px] xl:min-h-[125px] flex flex-wrap items-baseline">
                {fullTitle.slice(0, typedChars).split('').map((char, index) => (
                  <span
                    key={index}
                    className={`inline-block transition-transform ${
                      isRippling ? 'animate-waterWave' : ''
                    }`}
                    style={{
                      animationDelay: `${(index % 12) * 90}ms`,
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
                {!isRippling && typedChars < fullTitle.length && (
                  <span className="inline-block w-0.5 h-8 ml-0.5 bg-[#E5B84A] animate-pulse align-middle" />
                )}
              </h1>

              {/* Subtitle Description */}
              <p className="text-stone-300 text-sm xl:text-base leading-relaxed max-w-xl mb-8 font-light">
                {slide.description}
              </p>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => navigate(slide.path)}
                  className="bg-[#E5B84A] hover:bg-[#D4A338] text-[#1E110A] font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all duration-200 active:scale-95 inline-flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>{slide.btnLabel}</span>
                  <FiArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate(slide.secondaryPath)}
                  className="bg-transparent hover:bg-white/[0.08] text-[#E5B84A] border border-[#E5B84A]/60 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A]"
                >
                  {slide.secondaryBtnLabel}
                </button>
              </div>

              {/* Slide Dots (Subtle) */}
              <div className="flex items-center gap-2 mt-8">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => setActive(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      index === active ? 'w-6 bg-[#E5B84A]' : 'w-2 bg-white/25 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Rounded Photo Frame — Matches Screenshot 1 */}
            <div className="col-span-5 flex flex-col items-start justify-center">
              <div className="w-full relative rounded-2xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black/40 aspect-[4/5] max-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={slide.image}
                    src={slide.image}
                    alt={slide.title}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className="w-full h-full object-cover object-top"
                  />
                </AnimatePresence>
              </div>

              {/* Caption Under Image — Matches Screenshot 1 */}
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E5B84A] mt-3.5 pl-1">
                {slide.seasonTag}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE / TABLET HERO SECTION — Matches Screenshot 2
          ───────────────────────────────────────────────────────────── */}
      <div className="block lg:hidden w-full">
        {/* Notice: No text above the hero image on mobile (strict adherence to requirements) */}
        
        <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/60 shadow-xl bg-[#1A0E08] relative">
          
          {/* Main Hero Image */}
          <div className="w-full h-[320px] sm:h-[420px] overflow-hidden relative bg-stone-900">
            <AnimatePresence mode="wait">
              <motion.img
                key={slide.image}
                src={slide.image}
                alt={slide.title}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover object-top"
              />
            </AnimatePresence>
            
            {/* Subtle bottom gradient to blend seamlessly into overlay card */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Overlaid Dark Card — Matches Screenshot 2 */}
          <div className="relative -mt-20 sm:-mt-24 z-10 mx-3 sm:mx-5 mb-3 sm:mb-5 bg-[#20130B]/95 backdrop-blur-md border border-[#E5B84A]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
            
            {/* Tag */}
            <span className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-[#E5B84A] block mb-1.5">
              {slide.tag}
            </span>

            {/* Headline */}
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug tracking-tight mb-2">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs text-stone-300 leading-relaxed font-light mb-4 line-clamp-3">
              {slide.description}
            </p>

            {/* Button + Carousel Dots Row */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate(slide.path)}
                className="bg-[#E5B84A] hover:bg-[#D4A338] text-[#1E110A] font-extrabold text-[11px] sm:text-xs uppercase tracking-wider px-4 sm:px-5 py-2.5 rounded-xl shadow-md inline-flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <span>{slide.btnLabel}</span>
                <FiArrowUpRight className="w-3.5 h-3.5" />
              </button>

              {/* Slide Indicator Dots — Matches Screenshot 2 */}
              <div className="flex items-center gap-1.5">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    aria-label={`Slide ${index + 1}`}
                    onClick={() => setActive(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      index === active ? 'w-5 bg-[#E5B84A]' : 'w-1.5 bg-white/35 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── CSS KEYFRAMES FOR THE WATER RIPPLE ANIMATION ── */}
      <style>{`
        @keyframes waterWave {
          0%, 100% {
            transform: translateY(0) scaleY(1);
            color: #ffffff;
          }
          30% {
            transform: translateY(-3px) scaleY(1.05);
            color: #F8E7BE;
          }
          60% {
            transform: translateY(2px) scaleY(0.97);
            color: #E5B84A;
          }
        }
        .animate-waterWave {
          animation: waterWave 1.6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}