import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { menuItems, categories } from '../data/menuData';
import MenuItemCard from '../components/MenuItemCard';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  const filtered = useMemo(() => {
    return menuItems.filter(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (vegOnly && !item.veg) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [activeCategory, search, vegOnly]);

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-orange-700 text-white px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Our Menu</h1>
          <p className="text-orange-200 text-sm">Authentic South Indian cuisine, made fresh daily</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm cursor-pointer select-none text-sm">
            <div
              onClick={() => setVegOnly(v => !v)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                vegOnly ? 'border-green-600 bg-green-600' : 'border-gray-300'
              }`}
            >
              {vegOnly && <span className="text-white text-xs">✓</span>}
            </div>
            <span className="text-gray-700 font-medium">Veg Only</span>
          </label>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition ${
              activeCategory === 'all'
                ? 'bg-orange-600 text-white shadow'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50'
            }`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-orange-600 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-gray-500 text-sm mb-4">{filtered.length} item{filtered.length !== 1 ? 's' : ''} found</p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-lg font-medium">No dishes found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
