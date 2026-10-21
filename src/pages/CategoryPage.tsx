import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import type { Product } from '../types/database';
import { getErrorMessage } from '../utils/errorHandling';
import { FiArrowLeft } from 'react-icons/fi';

type SortOption = 'latest' | 'price-asc' | 'price-desc' | 'title-asc';

export default function CategoryPage() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  useEffect(() => {
    async function fetchCategoryProducts() {
      if (!categoryName) return;
      try {
        setLoading(true);
        const cleanCategory = decodeURIComponent(categoryName);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('category', cleanCategory);
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error loading category:', getErrorMessage(err));
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    }
    fetchCategoryProducts();
  }, [categoryName]);

  const displayTitle = categoryName
    ? decodeURIComponent(categoryName).charAt(0).toUpperCase() + decodeURIComponent(categoryName).slice(1)
    : '';

  // Client-side sorting
  const sortedProducts = useMemo(() => {
    const items = [...products];
    switch (sortBy) {
      case 'price-asc':
        return items.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return items.sort((a, b) => b.price - a.price);
      case 'title-asc':
        return items.sort((a, b) => a.title.localeCompare(b.title));
      case 'latest':
      default:
        return items.sort((a, b) => b.id - a.id);
    }
  }, [products, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] font-sans text-[#2C1A0E]">

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-5 pt-24 sm:pt-28 pb-24 lg:pb-12">
        {/* Aarong Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[10px] sm:text-xs text-stone-500 mb-2 sm:mb-3">
          <Link to="/" className="hover:text-stone-900 transition font-medium">Home</Link>
          <span className="text-stone-400">/</span>
          <span className="hover:text-stone-900 transition font-medium">Women</span>
          <span className="text-stone-400">/</span>
          <Link to="/products" className="hover:text-[#6B4226] transition font-medium">Saree</Link>
          <span className="text-stone-400">/</span>
          <span className="font-semibold text-stone-900">{displayTitle}</span>
        </nav>

        {/* Header & Sort Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="min-w-0">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B4226] hover:text-[#4A2E1A] mb-2 transition cursor-pointer"
            >
              <FiArrowLeft className="w-3.5 h-3.5 flex-shrink-0" />
              Back to Saree Collection
            </button>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#4A2E1A] tracking-tight">
                {displayTitle} Sarees
              </h1>
              {!loading && (
                <span className="text-xs sm:text-sm font-sans font-semibold text-[#8B5E3C] bg-white border border-[#E8DDD3] px-2.5 py-0.5 rounded-full shadow-2xs">
                  {products.length} {products.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            <p className="text-[#9C7B65] text-xs sm:text-sm mt-1">
              Handcrafted sarees from the authentic {displayTitle} weave heritage.
            </p>
          </div>

          {/* Sort Dropdown */}
          {!loading && products.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-[#E8DDD3] p-1.5 rounded-xl shadow-2xs">
              <label htmlFor="category-sort" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 pl-2 whitespace-nowrap">
                Sort:
              </label>
              <select
                id="category-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-[#FAF6F0] border border-[#E8DDD3] text-[#4A2E1A] text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] cursor-pointer"
              >
                <option value="latest">Latest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title-asc">Name: A to Z</option>
              </select>
            </div>
          )}
        </div>

        {/* Product Grid — Aarong 2/3/4 Column Grid */}
        <div className="w-full">
          <ProductGrid products={sortedProducts} loading={loading} />
        </div>
      </main>

      <Footer />
    </div>
  );
}