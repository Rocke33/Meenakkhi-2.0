import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import CheckoutForm from '../components/CheckoutForm';
import { supabase } from '../supabaseClient';
import { formatBDT } from '../types/database';
import { getErrorMessage } from '../utils/errorHandling';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

interface CartItemRecord {
  id: number;
  quantity: number;
  products: {
    id: number;
    title: string;
    price: number;
    image_url: string;
  };
}

export default function Cart() {
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const [cartItems, setCartItems] = useState<CartItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uiError, setUiError] = useState<string | null>(null);
  const [uiSuccess, setUiSuccess] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isDeliveryInfoModalOpen, setIsDeliveryInfoModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isFormVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFormVisible]);

  const fetchUserCart = async () => {
    setLoading(true);
    setUiError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('cart_items')
          .select('id, quantity, products(id, title, price, image_url)')
          .eq('user_id', user.id);

        if (error) throw error;
        if (data) setCartItems(data as unknown as CartItemRecord[]);
      }
    } catch (err: unknown) {
      setUiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUserCart(); }, []);

  const handleUpdateQuantity = async (itemId: number, newQty: number) => {
    if (newQty <= 0) {
      const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
      if (!error) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        await refreshCart();
      }
    } else {
      const { error } = await supabase.from('cart_items').update({ quantity: newQty }).eq('id', itemId);
      if (!error) {
        setCartItems((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
        );
        await refreshCart();
      }
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      const { error } = await supabase.from('cart_items').delete().eq('id', id);
      if (error) throw error;
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      await refreshCart();
    } catch (err: unknown) {
      setUiError('Could not remove item: ' + getErrorMessage(err));
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.products.price * item.quantity, 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleOrderSuccess = async () => {
    setCartItems([]);
    setIsFormVisible(false);
    await refreshCart();
    setUiSuccess('🎉 Order placed successfully! Thank you for shopping with Meenakkhi Sarees.');
    setTimeout(() => navigate('/profile'), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] font-sans relative">

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-5 pt-24 sm:pt-28 pb-24 lg:pb-12">
        {/* Page Header */}
        <div className="mb-5 sm:mb-7">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#8B5E3C] mb-1">মীনাক্ষী Sarees / Cart</p>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#4A2E1A] tracking-tight flex items-center gap-2 flex-wrap">
            <FiShoppingBag className="text-[#6B4226] flex-shrink-0" />
            <span>Shopping Cart</span>
            <span className="text-sm font-sans font-semibold text-[#9C7B65]">
              ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </span>
          </h1>
        </div>

        {uiError && !isFormVisible && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
            ❌ {uiError}
          </div>
        )}

        {uiSuccess && (
          <div className="mb-5 p-6 bg-emerald-50 border border-emerald-200 text-center rounded-2xl shadow-sm">
            <span className="text-3xl block mb-2">🎉</span>
            <h3 className="text-base font-black text-emerald-900 mb-1">{uiSuccess}</h3>
            <p className="text-xs text-emerald-700 font-medium">Redirecting to your orders dashboard…</p>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center border border-dashed border-[#E8DDD3] bg-white rounded-2xl">
            <div className="w-8 h-8 border-4 border-[#6B4226] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[#9C7B65] font-medium text-xs">Loading your cart…</p>
          </div>
        ) : cartItems.length === 0 && !uiSuccess ? (
          <div className="py-16 text-center border border-dashed border-[#E8DDD3] bg-white rounded-2xl p-6">
            <span className="text-5xl block mb-3">🛍️</span>
            <p className="text-[#9C7B65] font-medium text-sm mb-4">Your saree cart is empty.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-[#6B4226] hover:bg-[#4A2E1A] text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
            >
              Explore Saree Collections
            </button>
          </div>
        ) : (
          cartItems.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-[#E8DDD3] rounded-xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
                  >
                    {/* Image + Title */}
                    <div className="flex items-center gap-3 w-full sm:w-auto min-w-0 flex-1">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-[#FAF6F0] flex-shrink-0 overflow-hidden flex items-center justify-center border border-[#E8DDD3] p-1">
                        <img
                          src={item.products.image_url}
                          alt={item.products.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-[#2C1A0E] truncate tracking-tight">
                          {item.products.title}
                        </h4>
                        <p className="text-xs font-semibold text-[#6B4226] mt-0.5">
                          {formatBDT(item.products.price)} each
                        </p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 w-full sm:w-auto border-t sm:border-t-0 pt-2.5 sm:pt-0 border-[#E8DDD3] flex-shrink-0">
                      {/* Qty stepper */}
                      <div className="flex items-center border border-[#E8DDD3] rounded-xl overflow-hidden bg-white h-9">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-full flex items-center justify-center bg-[#FAF6F0] text-[#6B4226] hover:bg-[#6B4226] hover:text-white border-r border-[#E8DDD3] transition font-black cursor-pointer"
                        >
                          −
                        </button>
                        <span className="px-3 text-xs font-black text-[#2C1A0E] min-w-[32px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center bg-[#FAF6F0] text-[#6B4226] hover:bg-[#6B4226] hover:text-white border-l border-[#E8DDD3] transition font-black cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="text-sm font-black text-[#4A2E1A] min-w-[80px] text-right">
                        {formatBDT(item.products.price * item.quantity)}
                      </span>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 rounded-lg text-[#9C7B65] hover:text-red-600 hover:bg-red-50 transition cursor-pointer flex-shrink-0"
                        title="Remove"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-white border border-[#E8DDD3] rounded-2xl p-5 shadow-sm flex flex-col gap-4 sticky top-24">
                {/* Logo accent */}
                <div className="flex items-center gap-2 pb-3 border-b border-[#E8DDD3]">
                  <img src="/logo.png" alt="" className="h-8 w-auto opacity-80" />
                  <h3 className="font-serif font-bold text-[#4A2E1A] text-base">Order Summary</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#6B4226]">
                    <span className="text-xs font-semibold">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                    <span className="font-bold">{formatBDT(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#9C7B65]">
                    <span className="font-semibold text-[#6B4226]">Delivery</span>
                    <button
                      type="button"
                      onClick={() => setIsDeliveryInfoModalOpen(true)}
                      className="flex items-center gap-1 bg-[#FAF6F0] hover:bg-[#E5B84A]/20 text-[#6B4226] border border-[#E8DDD3] text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition shadow-2xs"
                    >
                      <span>ℹ️</span>
                      <span>Delivery Info</span>
                    </button>
                  </div>
                  <div className="border-t border-[#E8DDD3] pt-2 flex justify-between font-serif font-black text-[#2C1A0E] text-base">
                    <span>Total</span>
                    <span>{formatBDT(subtotal)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFormVisible(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#6B4226] hover:bg-[#4A2E1A] text-white py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition cursor-pointer font-bold text-sm tracking-wide"
                >
                  <span>Proceed to Checkout</span>
                  <FiArrowRight className="w-4 h-4 flex-shrink-0" />
                </button>

                <p className="text-[10px] text-center text-[#9C7B65]">
                  bKash · Nagad · Cash on Delivery accepted
                </p>
              </div>
            </div>
          )
        )}
      </main>

      {/* Checkout Modal — Opens below fixed navbar with a small, visually balanced gap */}
      {isFormVisible && (
        <div
          className="fixed inset-0 z-40 overflow-y-auto bg-black/65 backdrop-blur-xs pt-[74px] sm:pt-[82px] pb-10 px-3 sm:px-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Checkout Dialog"
        >
          {/* Backdrop Click Dismiss */}
          <div
            className="fixed inset-0 -z-10 cursor-default"
            onClick={() => setIsFormVisible(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-xl mx-auto my-1 sm:my-2">
            <CheckoutForm
              cartItems={cartItems}
              subtotal={subtotal}
              onClose={() => setIsFormVisible(false)}
              onOrderSuccess={handleOrderSuccess}
            />
          </div>
        </div>
      )}

      {/* Delivery Info Modal */}
      {isDeliveryInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsDeliveryInfoModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-sm bg-white border border-[#E8DDD3] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8DDD3] pb-3">
              <h3 className="text-sm font-black text-[#4A2E1A] uppercase tracking-tight">
                Delivery Charge Information
              </h3>
              <button
                type="button"
                aria-label="Close Delivery Info"
                onClick={() => setIsDeliveryInfoModalOpen(false)}
                className="text-gray-400 hover:text-[#4A2E1A] font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-semibold text-gray-700">
              <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100">
                <span>Jahangirnagar University Campus</span>
                <span className="font-mono font-black text-emerald-700">৳0.00 (Free)</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-amber-50/60 text-[#6B4226] border border-amber-200/60">
                <span>Inside Dhaka (All Thanas)</span>
                <span className="font-mono font-black">৳80</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-[#FAF6F0] text-[#2C1A0E] border border-[#E8DDD3]">
                <span>Outside Dhaka (All Bangladesh)</span>
                <span className="font-mono font-black">৳130</span>
              </div>
            </div>

            <p className="text-[11px] text-[#9C7B65] text-center leading-relaxed">
              Standard delivery takes 2–5 business days across Bangladesh with live tracking.
            </p>

            <button
              type="button"
              onClick={() => setIsDeliveryInfoModalOpen(false)}
              className="w-full text-xs font-black uppercase tracking-wider bg-[#6B4226] text-white py-2.5 rounded-xl hover:bg-[#4A2E1A] transition cursor-pointer shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}