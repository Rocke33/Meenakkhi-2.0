import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { getErrorMessage } from '../utils/errorHandling';

export default function Subscribe() {
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  useEffect(() => {
    async function checkSubscriptionStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          const { data, error } = await supabase
            .from('subscribers')
            .select('email')
            .eq('email', user.email.toLowerCase())
            .maybeSingle();
          if (!error && data) setIsSubscribed(true);
        }
      } catch (err) {
        console.error('Subscription check error:', getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    checkSubscriptionStatus();
  }, []);

  const handleSubscribeAction = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) { navigate('/login'); return; }
      setActionLoading(true);
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email: user.email.toLowerCase() }]);
      if (error) {
        if (error.code === '23505') { setIsSubscribed(true); return; }
        throw error;
      }
      setIsSubscribed(true);
    } catch (err) {
      console.error('Failed to subscribe:', getErrorMessage(err));
      alert('Could not update subscription settings.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsubscribeAction = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) return;
      setActionLoading(true);
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('email', user.email.toLowerCase());
      if (error) throw error;
      setIsSubscribed(false);
    } catch (err) {
      console.error('Failed to unsubscribe:', getErrorMessage(err));
      alert('Could not update subscription settings.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="my-8 sm:my-12 bg-[#6B4226] rounded-2xl p-8 text-center text-white shadow-md animate-pulse">
        <div className="h-6 w-48 bg-[#4A2E1A] rounded mx-auto mb-3" />
        <div className="h-4 w-64 bg-[#4A2E1A] rounded mx-auto" />
      </section>
    );
  }

  return (
    <section className="my-8 sm:my-12 bg-gradient-to-br from-[#4A2E1A] via-[#6B4226] to-[#5C3820] rounded-2xl p-6 sm:p-10 text-center text-white shadow-xl relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#E5B84A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#E5B84A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo watermark */}
      <img
        src="/logo.png"
        alt=""
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 h-24 sm:h-32 w-auto opacity-[0.06] pointer-events-none select-none"
      />

      <div className="max-w-xl mx-auto relative z-10">
        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-[#E5B84A]/20 border border-[#E5B84A]/30">
          <span className="text-2xl select-none">{isSubscribed ? '🔔' : '💌'}</span>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold mb-2 tracking-tight text-white">
          {isSubscribed ? 'You\'re a VIP Member!' : 'মীনাক্ষী VIP Saree Club'}
        </h2>
        <p className="text-white/65 text-xs sm:text-sm mb-6 max-w-sm mx-auto leading-relaxed">
          {isSubscribed
            ? 'You receive early access to new saree drops, festival pre-orders, and exclusive VIP discounts.'
            : 'Subscribe for early access to exclusive Jamdani, Silk, and Katan drops plus festive VIP offers.'}
        </p>

        <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
          {!isSubscribed ? (
            <button
              disabled={actionLoading}
              onClick={handleSubscribeAction}
              className="w-full bg-[#E5B84A] hover:bg-[#C8962A] text-[#2C1A0E] font-black text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl shadow-lg transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {actionLoading ? 'Processing…' : 'Subscribe to Saree Drops'}
            </button>
          ) : (
            <div className="w-full space-y-3">
              <div className="w-full bg-emerald-600 text-white font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded-xl shadow-md border border-emerald-500/30 select-none">
                ✓ VIP Member — Subscribed
              </div>
              <button
                disabled={actionLoading}
                onClick={handleUnsubscribeAction}
                className="text-[11px] font-bold text-white/50 hover:text-white/80 transition underline cursor-pointer disabled:opacity-40"
              >
                {actionLoading ? 'Updating…' : 'Unsubscribe from notifications'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}