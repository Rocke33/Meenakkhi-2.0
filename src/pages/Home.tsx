import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import FeaturedLanes from '../components/FeaturedLanes';
import Subscribe from '../components/Subscribe';
import Footer from '../components/Footer';
import type { Product } from '../types/database';
import { DEFAULT_SAREE_CATEGORIES } from '../constants/categories';

// Moved to module scope (8 items divides cleanly into 2-col mobile and 4-col desktop)
const ITEMS_PER_PAGE = 8;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch categories from DB, fallback to default
  useEffect(() => {
    async function fetchDynamicCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          setCategoriesList(['All', ...data.map((item) => item.name)]);
        } else {
          setCategoriesList(DEFAULT_SAREE_CATEGORIES);
        }
      } catch {
        setCategoriesList(DEFAULT_SAREE_CATEGORIES);
      }
    }
    fetchDynamicCategories();
  }, []);

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let queryBuilder = supabase.from('products').select('*');

        if (selectedCategory !== 'All') {
          queryBuilder = queryBuilder.ilike('category', selectedCategory);
        }
        const cleanedQ = searchQuery.trim();
        if (cleanedQ !== '') {
          queryBuilder = queryBuilder.ilike('title', `%${cleanedQ}%`);
        }

        queryBuilder = queryBuilder.order('id', { ascending: false });

        const { data, error } = await queryBuilder;
        if (!error && data) setAllProducts(data as Product[]);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const handleGlobalSearch = (event: Event) => {
      setSearchQuery((event as CustomEvent<string>).detail);
    };

    window.addEventListener('saree-search', handleGlobalSearch);
    return () => window.removeEventListener('saree-search', handleGlobalSearch);
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  }, []);

  const isSearching = searchQuery.trim() !== '';
  const isFilteringCategory = selectedCategory !== 'All';
  const isSearchingOrFiltering = isSearching || isFilteringCategory;

  // Keep results in view when paging, instead of leaving the user scrolled past them
  useEffect(() => {
    if (!isSearchingOrFiltering) return;
    const anchor = document.getElementById(isSearching ? 'search-view' : 'category-view');
    anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const { paginatedProducts, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = allProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const pages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
    return { paginatedProducts: paginated, totalPages: pages };
  }, [allProducts, currentPage]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] font-sans text-[#2C1A0E]">

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 pt-[124px] sm:pt-[132px] md:pt-[138px] pb-24 lg:pb-12 box-border">

        {/* Search results view */}
        {isSearching && (
          <section id="search-view" className="my-4 sm:my-5">
            <div className="flex items-center justify-between mb-4 px-1 flex-wrap gap-2">
              <h2 className="text-sm sm:text-lg font-serif font-bold text-[#4A2E1A] tracking-tight">
                Results for "{searchQuery.trim()}"
              </h2>
              <span className="text-[10px] sm:text-xs font-bold text-[#6B4226] bg-[#E5B84A]/20 px-2.5 py-1 rounded-full border border-[#E5B84A]/40 flex-shrink-0">
                {allProducts.length} Found
              </span>
            </div>
            <ProductGrid products={paginatedProducts} loading={loading} />
          </section>
        )}

        {/* Hero (hidden during search) */}
        {!isSearching && <Hero />}

        {/* Category filter pills */}
        <section className="my-4 sm:my-6" aria-label="Saree categories" id="categories">
          <div className="bg-white p-2 sm:p-4 rounded-xl border border-[#E8DDD3] shadow-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-0.5">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#6B4226] shrink-0 hidden sm:inline pr-1">
                Shop by Weave:
              </span>
              {categoriesList.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    aria-pressed={active}
                    className={`text-[9px] sm:text-xs font-bold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg border shrink-0 transition-all duration-200 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A] focus-visible:ring-offset-1 ${
                      active
                        ? 'bg-[#6B4226] text-white border-[#6B4226] shadow-sm'
                        : 'bg-[#FAF6F0] text-[#6B4226] border-[#E8DDD3] hover:bg-[#E8DDD3] hover:border-[#8B5E3C]/40'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Product view */}
        {!isSearching && (
          isFilteringCategory ? (
            <section id="category-view" className="my-4 sm:my-5">
              <div className="flex items-center justify-between mb-3 sm:mb-5 px-1 flex-wrap gap-2">
                <h2 className="text-sm sm:text-xl font-serif font-bold text-[#4A2E1A] tracking-tight uppercase flex-shrink-0">
                  {selectedCategory} Collection
                </h2>
              </div>
              <ProductGrid products={paginatedProducts} loading={loading} />
            </section>
          ) : (
            <section className="my-4 sm:my-5" id="products">
              <FeaturedLanes
                products={allProducts}
                categories={categoriesList}
                limitProducts={4}
              />
            </section>
          )
        )}

        {/* Pagination */}
        {isSearchingOrFiltering && totalPages > 1 && !loading && (
          <div className="mt-6 mb-4 flex items-center justify-center gap-2 bg-white border border-[#E8DDD3] p-3 rounded-xl shadow-sm flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              aria-label="Previous page"
              className="px-3 py-1.5 border border-[#E8DDD3] rounded-lg text-[11px] font-bold bg-[#FAF6F0] text-[#6B4226] hover:bg-[#E8DDD3] disabled:opacity-40 cursor-pointer transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A]"
            >
              ← Prev
            </button>
            <span className="text-[11px] font-bold px-2 text-[#6B4226]" aria-live="polite">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              aria-label="Next page"
              className="px-3 py-1.5 border border-[#E8DDD3] rounded-lg text-[11px] font-bold bg-[#FAF6F0] text-[#6B4226] hover:bg-[#E8DDD3] disabled:opacity-40 cursor-pointer transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A]"
            >
              Next →
            </button>
          </div>
        )}

        <Subscribe />
      </main>

      <Footer />
    </div>
  );
}