import ProductCard from './ProductCard';
import type { Product } from '../types/database';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-2 sm:p-3 flex flex-col gap-2 overflow-hidden shadow-xs">
      <div className="w-full aspect-[4/5] skeleton rounded-xl" />
      <div className="h-3.5 skeleton rounded-md w-3/4 mt-1" />
      <div className="h-3 skeleton rounded-md w-1/2" />
      <div className="h-8 skeleton rounded-xl mt-auto" />
    </div>
  );
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center border-2 border-dashed border-stone-200 bg-white rounded-3xl mx-1 p-6">
        <span className="text-4xl block mb-2">🌸</span>
        <p className="text-stone-700 font-serif font-bold text-base">No sarees match your selection.</p>
        <p className="text-stone-500 text-xs mt-1">Try selecting a different weave category or clearing your search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full">
      {products.map((item) => (
        <div key={item.id} className="min-w-0 overflow-hidden">
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
  );
}
