import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { getErrorMessage } from '../utils/errorHandling';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputId = 'saree-search-input';
  const listboxId = 'saree-search-suggestions';

  useEffect(() => {
    const fetchSuggestions = async () => {
      const trimmed = inputValue.trim();
      if (trimmed.length < 1) { setSuggestions([]); return; }
      try {
        const { data, error } = await supabase
          .from('products')
          .select('title')
          .ilike('title', `%${trimmed}%`)
          .limit(10);

        if (!error && data) {
          const uniqueTitles = Array.from(new Set(data.map((p) => p.title)));
          const sorted = uniqueTitles.sort((a, b) => {
            return a.toLowerCase().indexOf(trimmed.toLowerCase()) - b.toLowerCase().indexOf(trimmed.toLowerCase());
          });
          setSuggestions(sorted.slice(0, 6));
          setActiveIndex(-1);
        }
      } catch (err) {
        console.error('Search suggestion error:', getErrorMessage(err));
      }
    };

    const debounce = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(debounce);
  }, [inputValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchTrigger = (query: string) => {
    onSearch(query);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showDropdown && activeIndex >= 0 && activeIndex < suggestions.length) {
        const chosen = suggestions[activeIndex];
        setInputValue(chosen);
        handleSearchTrigger(chosen);
      } else {
        handleSearchTrigger(inputValue);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      if (!suggestions.length) return;
      e.preventDefault();
      setShowDropdown(true);
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
      return;
    }
    if (e.key === 'ArrowUp') {
      if (!suggestions.length) return;
      e.preventDefault();
      setShowDropdown(true);
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      return;
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  const renderHighlight = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase()
            ? <b key={i} className="text-[#3A2213] font-bold">{part}</b>
            : <span key={i} className="text-stone-500">{part}</span>
        )}
      </span>
    );
  };

  return (
    <div className="w-full bg-[#20140D] border-b border-white/10 py-2 sm:py-2.5 px-3 sm:px-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all">
      <div className="w-full max-w-3xl mx-auto relative" ref={dropdownRef}>
        
        {/* Search Input Container with White Typing Area */}
        <div className="flex items-center bg-white border border-stone-300 rounded-xl sm:rounded-2xl overflow-hidden shadow-md transition-all duration-200 focus-within:border-[#E5B84A] focus-within:ring-2 focus-within:ring-[#E5B84A]/40">
          <div className="flex-1 flex items-center relative min-w-0 bg-white">
            {/* Search Icon */}
            <FiSearch className="absolute left-3.5 w-4 h-4 text-stone-400 flex-shrink-0 pointer-events-none" />
            
            {/* White Background Input */}
            <input
              id={inputId}
              type="text"
              value={inputValue}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search Meenakkhi Sarees (Katan, Jamdani, Silk)..."
              onChange={(e) => { setInputValue(e.target.value); setShowDropdown(true); }}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showDropdown && suggestions.length > 0}
              aria-controls={listboxId}
              aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
              aria-label="Search sarees"
              autoComplete="off"
              className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-white font-sans text-stone-900 placeholder-stone-400 text-xs sm:text-sm font-medium outline-none border-none min-w-0"
            />

            {/* Clear Button */}
            {inputValue.length > 0 && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 bg-stone-200 hover:bg-stone-300 text-stone-600 font-bold text-xs transition rounded-full flex items-center justify-center w-5 h-5 cursor-pointer flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A]"
                title="Clear search"
                aria-label="Clear search"
              >
                <FiX className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Search Action Button — Dark/Gold as in Screenshot 1 & 2 */}
          <button
            type="button"
            onClick={() => handleSearchTrigger(inputValue)}
            className="bg-[#E5B84A] hover:bg-[#D4A338] text-[#1E110A] self-stretch px-4 sm:px-6 flex items-center justify-center cursor-pointer transition-all active:scale-95 flex-shrink-0 font-bold text-xs uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84A]"
            title="Search"
            aria-label="Search"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[#1E110A] border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSearch className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            )}
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div
            id={listboxId}
            role="listbox"
            aria-label="Search suggestions"
            className="absolute left-0 right-0 mt-1.5 bg-white border border-[#E5B84A]/30 shadow-2xl rounded-xl z-50 overflow-hidden max-h-64 overflow-y-auto divide-y divide-stone-100"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => { setInputValue(suggestion); handleSearchTrigger(suggestion); }}
                className={`px-4 py-2.5 text-xs sm:text-sm cursor-pointer transition flex items-center gap-3 ${
                  index === activeIndex ? 'bg-[#FAF6F0] text-stone-900' : 'hover:bg-[#FAF6F0] text-stone-700'
                }`}
              >
                <FiSearch className="w-3.5 h-3.5 text-[#C8962A] flex-shrink-0" />
                <span className="truncate">{renderHighlight(suggestion, inputValue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}