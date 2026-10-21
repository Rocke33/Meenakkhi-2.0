import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import type { Product } from '../types/database';

interface FeaturedLanesProps {
  products: Product[];
  categories: string[];
  limitProducts: number;
}

export default function FeaturedLanes({ products, categories, limitProducts }: FeaturedLanesProps) {
  const activeCategories = categories.filter((cat) => cat !== 'All');

  const lanesToRender = activeCategories
    .map((catName) => {
      const matchingItems = products.filter(
        (p) => p.category && p.category.toLowerCase() === catName.toLowerCase()
      );
      return {
        categoryName: catName,
        // Fixed: was Math.max(4, limitProducts) which ignored limitProducts when < 4
        products: matchingItems.slice(0, limitProducts > 0 ? limitProducts : 4),
      };
    })
    .filter((lane) => lane.products.length > 0);

  if (lanesToRender.length === 0) {
    return (
      <div className="py-14 text-center border-2 border-dashed border-[#E8DDD3] bg-white rounded-2xl mx-1">
        <p className="text-[#9C7B65] font-bold text-sm">No saree collections available in this view.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12 w-full">
      {lanesToRender.map((lane) => (
        <div key={lane.categoryName} className="space-y-3 sm:space-y-4">

          {/* Aarong-style Section Header */}
          <div className="flex items-end justify-between border-b border-stone-200 pb-3 gap-2 px-1">
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[.25em] text-[#8B5E3C] mb-0.5">
                Curated Handloom
              </p>
              <h3 className="text-base sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
                {lane.categoryName} Collection
              </h3>
            </div>

            <Link
              to={`/category/${encodeURIComponent(lane.categoryName.toLowerCase())}`}
              className="text-xs sm:text-sm font-bold text-[#6B4226] hover:text-[#4A2E1A] transition flex items-center gap-1 group pb-0.5 whitespace-nowrap"
            >
              <span>Explore All</span>
              <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Product Grid — 2 columns on mobile, 3 on tablet, 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full">
            {lane.products.map((item, index) => (
              <div
                key={item.id}
                className={`min-w-0 overflow-hidden ${
                  index >= 4 ? 'hidden lg:block' : 'block'
                }`}
              >
                <ProductCard
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  image_url={item.image_url}
                  category={item.category}
                  description={item.description}
                />
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}
