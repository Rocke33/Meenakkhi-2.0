import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCartActions } from '../hooks/useCartActions';
import { formatBDT } from '../types/database';
import LuxuryImage from './LuxuryImage';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image_url: string;
  category: string;
  description?: string;
}

const ProductCard = memo(function ProductCard({ id, title, price, image_url, category }: ProductCardProps) {
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState<number>(5.0);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  const { isAddedSuccess, isMutating, handleDirectAddToCart } = useCartActions(id);

  useEffect(() => {
    let isMounted = true;

    const fetchRatingMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('product_comments')
          .select('rating')
          .eq('product_id', id);

        if (error) throw error;

        if (isMounted && data && data.length > 0) {
          const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
          setAverageRating(parseFloat((sum / data.length).toFixed(1)));
          setTotalReviews(data.length);
        }
      } catch (err) {
        console.error('Error fetching rating:', err);
      }
    };

    fetchRatingMetrics();
    return () => { isMounted = false; };
  }, [id]);

  const handleCardRedirection = () => navigate(`/product/${id}`);

  return (
    <div
      onClick={handleCardRedirection}
      className="bg-white border border-stone-200/90 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-stone-300 transition-all duration-300 group cursor-pointer h-full min-w-0 overflow-hidden"
    >
      {/* Image — Slightly reduced height aspect ratio (4:5) for a balanced modern luxury grid */}
      <div className="w-full aspect-[4/5] bg-stone-100 rounded-xl overflow-hidden mb-2 relative flex-shrink-0">
        <LuxuryImage
          src={image_url}
          alt={title}
          aspectRatio="aspect-auto"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        {/* Aarong-style minimal category tag */}
        <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-black/65 backdrop-blur-sm text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-white px-2 py-0.5 rounded-full max-w-[80%] truncate shadow-xs">
          {category}
        </span>
      </div>

      {/* Details (Aarong typography & structure) */}
      <div className="flex-1 flex flex-col min-w-0 px-0.5">
        <h3 className="font-serif text-[11px] sm:text-xs md:text-sm font-bold text-stone-900 line-clamp-2 leading-snug mb-1 group-hover:text-[#6B4226] transition-colors">
          {title}
        </h3>

        {/* Combined Row: Rating Stars on Left + Price Beside Stars on Right */}
        <div className="flex items-center justify-between gap-1 my-1">
          <div className="flex items-center gap-0.5">
            <div className="flex text-amber-500 text-[8px] sm:text-[10px]">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(averageRating) ? 'text-amber-500' : 'text-stone-200'}>★</span>
              ))}
            </div>
            {totalReviews > 0 && (
              <span className="text-[7px] sm:text-[8px] font-semibold text-stone-500 ml-0.5 truncate">
                ({totalReviews})
              </span>
            )}
          </div>
          <span className="text-xs sm:text-sm md:text-base font-serif font-bold text-stone-900 truncate">
            {formatBDT(price)}
          </span>
        </div>
      </div>

      {/* Action Buttons: Add to Cart (Green) & Details */}
      <div className="pt-1.5 border-t border-stone-100 flex flex-col gap-1 px-0.5" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          {isAddedSuccess && (
            <span className="absolute -top-4 left-0 right-0 text-center text-[8px] font-black text-emerald-600 z-20 bg-emerald-50 py-0.5 rounded-md shadow-xs animate-fadeIn">
              Added to Cart!
            </span>
          )}
          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={isAddedSuccess || isMutating}
              onClick={handleDirectAddToCart}
              className={`flex-1 flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer z-10 text-[10px] sm:text-xs px-2 py-1.5 sm:py-2 min-w-0 ${
                isAddedSuccess
                  ? 'bg-emerald-700 text-white cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 shadow-xs'
              } ${isMutating && !isAddedSuccess ? 'opacity-50 cursor-wait' : ''}`}
            >
              {isAddedSuccess ? 'Added ✓' : isMutating ? '…' : 'Add to Cart'}
            </button>

            <button
              type="button"
              onClick={handleCardRedirection}
              className="flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl px-2.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer z-10 flex-shrink-0 border border-stone-200/80"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;