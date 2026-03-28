import { Plus, Minus, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

const spicyLabel = ['Mild', 'Low', 'Medium', 'Hot 🔥'];

export default function MenuItemCard({ item }) {
  const { state, dispatch } = useApp();
  const cartItem = state.cart.find(c => c.id === item.id);

  const add = () => dispatch({ type: 'ADD_TO_CART', item });
  const inc = () => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: cartItem.qty + 1 });
  const dec = () => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: cartItem.qty - 1 });

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop'; }}
        />
        {item.popular && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Popular
          </span>
        )}
        <span
          className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
            item.veg
              ? 'border-green-600 text-green-600 bg-white'
              : 'border-red-600 text-red-600 bg-white'
          }`}
        >
          {item.veg ? '●' : '●'}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-800 text-base leading-tight">{item.name}</h3>
          <span className="text-orange-600 font-bold text-base whitespace-nowrap">₹{item.price}</span>
        </div>

        {item.spicy > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: item.spicy }).map((_, i) => (
              <Flame key={i} className="w-3 h-3 text-red-500 fill-red-400" />
            ))}
            <span className="text-xs text-gray-400 ml-1">{spicyLabel[item.spicy]}</span>
          </div>
        )}

        <p className="text-gray-500 text-sm flex-1 leading-snug mb-4">{item.description}</p>

        <div className="mt-auto">
          {!cartItem ? (
            <button
              onClick={add}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-xl transition flex items-center justify-center gap-1.5 text-sm"
            >
              <Plus className="w-4 h-4" /> Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl overflow-hidden">
              <button
                onClick={dec}
                className="w-10 h-9 flex items-center justify-center text-orange-700 hover:bg-orange-100 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-orange-800">{cartItem.qty}</span>
              <button
                onClick={inc}
                className="w-10 h-9 flex items-center justify-center text-orange-700 hover:bg-orange-100 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
