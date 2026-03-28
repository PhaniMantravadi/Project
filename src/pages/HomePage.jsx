import { Link } from 'react-router-dom';
import { ChefHat, Star, Clock, Leaf } from 'lucide-react';

const highlights = [
  { icon: <Leaf className="w-6 h-6 text-green-600" />, title: 'Fresh & Pure', desc: 'Authentic recipes using fresh-ground spices daily.' },
  { icon: <Clock className="w-6 h-6 text-orange-500" />, title: 'Quick Service', desc: 'Hot meals served within 15–20 minutes of ordering.' },
  { icon: <Star className="w-6 h-6 text-yellow-500" />, title: 'Rated 4.8★', desc: 'Loved by thousands of happy diners every month.' },
];

const featuredImages = [
  { url: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop', label: 'Masala Dosa' },
  { url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop', label: 'Idli Sambar' },
  { url: 'https://images.unsplash.com/photo-1563379091339-03246963d651?w=400&h=300&fit=crop', label: 'Chettinad Biryani' },
  { url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop', label: 'Chicken Chettinad' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-700 via-orange-600 to-amber-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="w-10 h-10 text-yellow-300" />
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              Dakshin Kitchen
            </h1>
          </div>
          <p className="text-xl sm:text-2xl text-orange-100 mb-2 font-light">
            Authentic South Indian Flavours
          </p>
          <p className="text-orange-200 max-w-xl mx-auto mb-10 text-base sm:text-lg">
            From crispy Masala Dosas to aromatic Chettinad curries — experience the
            soul of South Indian cuisine, cooked with tradition and love.
          </p>
          <Link
            to="/menu"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-orange-900 font-bold text-lg px-8 py-3 rounded-full shadow-lg transition hover:scale-105"
          >
            View Full Menu →
          </Link>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {highlights.map(h => (
          <div key={h.title} className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-1">
              {h.icon}
            </div>
            <h3 className="font-bold text-gray-800 text-lg">{h.title}</h3>
            <p className="text-gray-500 text-sm">{h.desc}</p>
          </div>
        ))}
      </section>

      {/* Featured Dishes */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          🍽️ Signature Dishes
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {featuredImages.map(img => (
            <Link to="/menu" key={img.label} className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
              <img src={img.url} alt={img.label} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                <span className="text-white font-semibold text-sm">{img.label}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/menu"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-full transition"
          >
            Order Now
          </Link>
        </div>
      </section>
    </div>
  );
}
