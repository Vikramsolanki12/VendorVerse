import { useState, useEffect } from "react";
import { Search, X } from "lucide-react"; // `npm install lucide-react`

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce Effect (search after user stops typing for 300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Trigger parent callback
  useEffect(() => {
    onSearch(debouncedQuery.trim());
  }, [debouncedQuery]);

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for vegetables, groceries, or essentials..."
        className="w-full px-4 py-2 pl-11 pr-10 rounded-full border border-emerald-400/30 bg-white/10 
             text-black caret-green-500 placeholder-slate-300 shadow-sm backdrop-blur-md 
             focus:outline-none focus:ring-2 focus:ring-emerald-400 
             focus:border-emerald-500 transition duration-200"
      />

      {/* Search Icon */}
      <Search
        size={20}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-300"
      />

      {/* Clear Button */}
      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-300 hover:text-white"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
