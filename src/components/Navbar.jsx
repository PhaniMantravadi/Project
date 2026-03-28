import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, ChefHat, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { cartCount } = useApp();
  const location = useLocation();

  return (
    <nav className="bg-orange-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <ChefHat className="w-7 h-7 text-yellow-300" />
          <span className="text-yellow-100">Dakshin</span>
          <span className="text-white font-light">Kitchen</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/menu"
            className={`hidden sm:block text-sm font-medium px-3 py-1.5 rounded-full transition ${
              location.pathname === '/menu'
                ? 'bg-yellow-400 text-orange-900'
                : 'hover:bg-orange-600'
            }`}
          >
            Menu
          </Link>
          <Link
            to="/cart"
            className="relative flex items-center gap-1.5 bg-yellow-400 text-orange-900 font-semibold px-3 py-1.5 rounded-full hover:bg-yellow-300 transition text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-1 text-orange-200 hover:text-white transition text-sm"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
