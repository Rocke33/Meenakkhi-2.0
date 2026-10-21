import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import FeaturedLanes from '../components/FeaturedLanes';
import type { Product } from '../types/database';
import { DEFAULT_SAREE_CATEGORIES } from '../constants/categories';
import { FiGrid, FiList } from 'react-icons/fi';

type SortOption = 'latest' | 'price-asc' | 'price-desc' | 'title-asc';

export default function Products() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'lanes'>('grid');

  useEffect(() => {
    async function fetchDynamicCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          setCategories(['All', ...data.map((item) => item.name)]);
        } else {
          setCategories(DEFAULT_SAREE_CATEGORIES);
        }
      } catch {
        setCategories(DEFAULT_SAREE_CATEGORIES);
      }
    }
    fetchDynamicCategories();
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');

        if (selectedCategory !== 'All') {
          query = query.ilike('category', selectedCategory);
        }
        if (searchQuery.trim() !== '') {
          query = query.ilike('title', `%${searchQuery.trim()}%`);
        }

        query = query.order('id', { ascending: false });

        const { data, error } = await query;
        if (!error && data) setAllProducts(data as Product[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [searchQuery, selectedCategory]);

  // Client-side sorting on products
  const sortedProducts = useMemo(() => {
    const items = [...allProducts];
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
  }, [allProducts, sortBy]);

  const activeLanesList = selectedCategory === 'All' ? categories : [selectedCategory];

  useEffect(() => {
    const handleGlobalSearch = (event: Event) => {
      setSearchQuery((event as CustomEvent<string>).detail);
    };

    window.addEventListener('saree-search', handleGlobalSearch);
    return () => window.removeEventListener('saree-search', handleGlobalSearch);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] font-sans text-[#2C1A0E]">

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-[124px] sm:pt-[132px] md:pt-[138px] pb-24 lg:pb-12">
        {/* Aarong Heritage Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[10px] sm:text-xs text-stone-500 mb-2 sm:mb-3">
          <Link to="/" className="hover:text-stone-900 transition font-medium">Home</Link>
          <span className="text-stone-400">/</span>
          <span className="hover:text-stone-900 transition font-medium">Women</span>
          <span className="text-stone-400">/</span>
          <Link to="/products" className="font-semibold text-stone-900 hover:text-[#6B4226] transition">Saree</Link>
          {selectedCategory !== 'All' && (
            <>
              <span className="text-stone-400">/</span>
              <span className="font-semibold text-[#8B5E3C]">{selectedCategory}</span>
            </>
          )}
        </nav>

        {/* Aarong Page Header & Item Count */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#4A2E1A] tracking-tight">
                {selectedCategory === 'All' ? 'Saree Collection' : `${selectedCategory} Sarees`}
              </h1>
              {!loading && (
                <span className="text-xs sm:text-sm font-sans font-semibold text-[#8B5E3C] bg-white border border-[#E8DDD3] px-2.5 py-0.5 rounded-full shadow-2xs">
                  {sortedProducts.length} {sortedProducts.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            <p className="text-[#9C7B65] text-xs sm:text-sm mt-1 max-w-2xl">
              Authentic handloom sarees woven with exquisite traditional motifs, celebrating Bangladesh's rich textile heritage.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E8DDD3] p-1 rounded-xl shadow-2xs self-start sm:self-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#6B4226] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
              title="Aarong Catalog Grid"
            >
              <FiGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('lanes')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'lanes'
                  ? 'bg-[#6B4226] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
              title="By Weave Lanes"
            >
              <FiList className="w-3.5 h-3.5" />
              <span>By Weave</span>
            </button>
          </div>
        </div>

        {/* Aarong Filter & Sort Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-2.5 sm:p-3.5 rounded-2xl border border-[#E8DDD3] shadow-xs mb-6">
          {/* Weave Category Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-0.5 min-w-0">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#6B4226] shrink-0 pl-1">
              Weave:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg border shrink-0 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#6B4226] text-white border-[#6B4226] shadow-xs'
                      : 'bg-[#FAF6F0] text-[#6B4226] border-[#E8DDD3] hover:bg-[#E8DDD3] hover:border-[#8B5E3C]/40'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-stone-100">
            <label htmlFor="sort-select" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 whitespace-nowrap">
              Sort By:
            </label>
            <select
              id="sort-select"
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
        </div>

        {/* Products Display (Aarong 2/3/4 Grid or Curated Lanes) */}
        <div className="w-full">
          {viewMode === 'grid' ? (
            <ProductGrid products={sortedProducts} loading={loading} />
          ) : loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-[#6B4226] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#9C7B65] text-xs font-bold uppercase tracking-wider">Syncing Saree Collection…</p>
            </div>
          ) : (
            <FeaturedLanes
              products={sortedProducts}
              categories={activeLanesList}
              limitProducts={4}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}