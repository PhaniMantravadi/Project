import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CartPage() {
  const { state, dispatch, cartTotal } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', tableNo: '' });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Enter valid 10-digit phone';
    if (!form.tableNo.trim()) errs.tableNo = 'Table number is required';
    return errs;
  };

  const placeOrder = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setPlacing(true);
    await new Promise(r => setTimeout(r, 800));
    dispatch({
      type: 'PLACE_ORDER',
      customerName: form.name,
      customerPhone: form.phone,
      tableNo: form.tableNo,
    });
    setPlacing(false);
    setSuccess(true);
    setTimeout(() => navigate('/'), 3000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-sm mx-4">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Order Placed!</h2>
          <p className="text-gray-600 mb-6">Your order has been received. We'll serve you shortly!</p>
          <p className="text-sm text-gray-400">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center p-10">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some delicious South Indian dishes!</p>
          <Link
            to="/menu"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const gst = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + gst;

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="bg-orange-700 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="text-orange-200 text-sm">{state.cart.length} item{state.cart.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {state.cart.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h3>
                <p className="text-orange-600 font-bold text-sm">${item.price}</p>
              </div>
              <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty - 1 })}
                  className="w-8 h-8 flex items-center justify-center text-orange-700 hover:bg-orange-100"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-orange-800">{item.qty}</span>
                <button
                  onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty + 1 })}
                  className="w-8 h-8 flex items-center justify-center text-orange-700 hover:bg-orange-100"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <span className="font-bold text-gray-800 text-sm w-16 text-right">${item.price * item.qty}</span>
              <button
                onClick={() => dispatch({ type: 'REMOVE_FROM_CART', id: item.id })}
                className="text-red-400 hover:text-red-600 transition ml-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary + Form */}
        <div className="space-y-4">
          {/* Bill Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">Bill Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>${cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span><span>${gst}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-base text-gray-800">
                <span>Total</span><span className="text-orange-700">${grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Customer Form */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">Your Details</h3>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Table Number *"
                  value={form.tableNo}
                  onChange={e => setForm({ ...form, tableNo: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${errors.tableNo ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.tableNo && <p className="text-red-500 text-xs mt-1">{errors.tableNo}</p>}
              </div>
              <button
                onClick={placeOrder}
                disabled={placing}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {placing ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                ) : (
                  <>Place Order <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
