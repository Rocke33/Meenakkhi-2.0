import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Footer from '../components/Footer';
import { formatBDT } from '../types/database';
import { getErrorMessage } from '../utils/errorHandling';
import { FiTrendingUp } from 'react-icons/fi';

interface TopProductMetrics {
  id: number;
  product_name: string;
  image_url: string;
  price: number;
  unitsSold: number;
}

interface TopSalesRow {
  id: number;
  title: string;
  image_url: string;
  price: number;
  sales_count: number | string | null;
}

export default function Orders() {
  const navigate = useNavigate();
  const [topProducts, setTopProducts] = useState<TopProductMetrics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const { data, error } = await supabase.rpc('get_public_top_sales');
        if (error) { setErrorMessage(`Database Error: ${error.message}`); return; }
        if (data) {
          const formatted: TopProductMetrics[] = (data as TopSalesRow[]).map((prod) => ({
            id: prod.id,
            product_name: prod.title,
            image_url: prod.image_url,
            price: prod.price,
            unitsSold: Number(prod.sales_count) || 0,
          }));
          setTopProducts(formatted);
        }
      } catch (err: unknown) {
        setErrorMessage(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchTopSellingProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] font-sans text-[#2C1A0E]">

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-5 pt-24 sm:pt-28 pb-24 lg:pb-12">
        {/* Aarong Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[10px] sm:text-xs text-stone-500 mb-2 sm:mb-3">
          <span onClick={() => navigate('/')} className="hover:text-stone-900 transition font-medium cursor-pointer">Home</span>
          <span className="text-stone-400">/</span>
          <span onClick={() => navigate('/products')} className="hover:text-stone-900 transition font-medium cursor-pointer">Women</span>
          <span className="text-stone-400">/</span>
          <span className="font-semibold text-stone-900">Top Sellers</span>
        </nav>

        {/* Header */}
        <div className="mb-6 border-b border-stone-200 pb-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#4A2E1A] tracking-tight flex items-center gap-2.5 flex-wrap">
            <FiTrendingUp className="text-[#6B4226] flex-shrink-0" />
            <span>Top Selling Sarees</span>
          </h1>
          <p className="text-[#9C7B65] text-xs sm:text-sm mt-1">
            The most loved saree weaves, ranked by live customer purchase metrics.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold">
            ⚠️ {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3 bg-white border border-[#E8DDD3] rounded-2xl shadow-sm">
            <div className="w-8 h-8 border-4 border-[#6B4226] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#9C7B65] text-xs font-bold uppercase tracking-wider">Compiling trending catalog…</p>
          </div>
        ) : topProducts.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#E8DDD3] text-[#9C7B65] text-sm font-medium rounded-2xl shadow-sm">
            📉 No purchase metrics logged yet. Check back once orders are completed!
          </div>
        ) : (
          // Aarong standard: 2 cols on mobile, 3 on tablet, 4 on desktop
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {topProducts.map((prod, idx) => (
              <div
                key={prod.id}
                onClick={() => navigate(`/product/${prod.id}`)}
                className="bg-white border border-[#E8DDD3] rounded-2xl p-2 sm:p-2.5 flex flex-col relative shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-[#8B5E3C]/50 transition-all duration-300 cursor-pointer group overflow-hidden"
              >
                {/* Rank badge */}
                <span className="absolute top-2 left-2 z-10 bg-[#6B4226] text-white text-[8px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                  #{idx + 1}
                </span>

                {/* Sales badge */}
                <span className="absolute top-2 right-2 z-10 bg-[#E5B84A]/20 text-[#6B4226] text-[8px] sm:text-[10px] font-black px-2 py-0.5 rounded-full border border-[#E5B84A]/40 truncate max-w-[55%]">
                  {prod.unitsSold} Sold
                </span>

                {/* Image — Slightly reduced height aspect ratio (4:5) */}
                <div className="aspect-[4/5] w-full rounded-xl bg-[#FAF6F0] flex items-center justify-center p-2 mb-2 overflow-hidden mt-6">
                  <img
                    src={prod.image_url}
                    alt={prod.product_name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 min-w-0 px-1">
                  <h4
                    className="font-serif text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 leading-snug mb-1 group-hover:text-[#6B4226] transition-colors"
                    title={prod.product_name}
                  >
                    {prod.product_name}
                  </h4>
                  <div className="mt-auto pt-2 flex justify-between items-center border-t border-stone-100 gap-1">
                    <span className="text-xs sm:text-base font-serif font-bold text-stone-900 truncate">
                      {formatBDT(prod.price)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#6B4226] font-bold group-hover:translate-x-0.5 transition-transform">
                      View →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}