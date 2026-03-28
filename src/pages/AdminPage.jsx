import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock, LogOut, ChefHat, Clock, CheckCircle, XCircle,
  Truck, AlertCircle, TrendingUp, ShoppingBag, Users, DollarSign
} from 'lucide-react';

const ADMIN_PASSWORD = 'admin123';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',     color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: <Clock className="w-4 h-4" />, next: 'preparing' },
  preparing:  { label: 'Preparing',   color: 'bg-blue-100 text-blue-800 border-blue-300',       icon: <ChefHat className="w-4 h-4" />, next: 'ready' },
  ready:      { label: 'Ready',       color: 'bg-green-100 text-green-800 border-green-300',    icon: <CheckCircle className="w-4 h-4" />, next: 'served' },
  served:     { label: 'Served',      color: 'bg-purple-100 text-purple-800 border-purple-300', icon: <Truck className="w-4 h-4" />, next: null },
  cancelled:  { label: 'Cancelled',   color: 'bg-red-100 text-red-800 border-red-300',          icon: <XCircle className="w-4 h-4" />, next: null },
};

const FILTERS = ['all', 'pending', 'preparing', 'ready', 'served', 'cancelled'];

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (mins < 1) return 'Just now';
  if (mins === 1) return '1 min ago';
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export default function AdminPage() {
  const { state, dispatch } = useApp();
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      dispatch({ type: 'ADMIN_LOGIN' });
      setPwError('');
    } else {
      setPwError('Incorrect password. Hint: admin123');
    }
  };

  if (!state.adminLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-700 to-amber-600 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3">
              <Lock className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-1">Dakshin Kitchen Dashboard</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 ${pwError ? 'border-red-400' : 'border-gray-200'}`}
            />
            {pwError && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {pwError}
              </p>
            )}
            <button
              onClick={login}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const orders = state.orders;
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const todayTotal = orders.reduce((s, o) => o.status !== 'cancelled' ? s + o.total : s, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const servingCount = orders.filter(o => o.status === 'preparing' || o.status === 'ready').length;

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Pending', value: pendingCount, icon: <Clock className="w-5 h-5 text-yellow-600" />, bg: 'bg-yellow-50' },
    { label: 'In Progress', value: servingCount, icon: <ChefHat className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-50' },
    { label: "Today's Revenue", value: `$${todayTotal}`, icon: <DollarSign className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gray-900 text-white px-4 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <ChefHat className="w-7 h-7 text-orange-400" />
          <div>
            <h1 className="font-bold text-lg leading-tight">Admin Dashboard</h1>
            <p className="text-gray-400 text-xs">Dakshin Kitchen</p>
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: 'ADMIN_LOGOUT' })}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition text-sm"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 shadow-sm`}>
              <div className="flex items-center gap-2 mb-1">
                {s.icon}
                <span className="text-xs text-gray-500 font-medium">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition ${
                filter === f
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && (
                <span className="ml-1.5 bg-gray-200 text-gray-700 text-xs rounded-full px-1.5">
                  {orders.filter(o => o.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No orders here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map(order => {
              const cfg = STATUS_CONFIG[order.status];
              const isExpanded = expandedOrder === order.id;
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-800 text-sm">{order.id}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
                            {cfg.icon} {cfg.label}
                          </span>
                          {order.status === 'pending' && (
                            <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium animate-pulse">
                              New!
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span>👤 {order.customerName}</span>
                          <span>🍽️ Table {order.tableNo}</span>
                          <span>🕐 {timeAgo(order.placedAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-orange-700 text-lg">${order.total}</span>
                        <span className="text-gray-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-4 pb-4">
                      {/* Items */}
                      <div className="py-3 space-y-2">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Items</h4>
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="flex-1 text-sm text-gray-700">{item.name}</span>
                            <span className="text-xs text-gray-500">×{item.qty}</span>
                            <span className="text-sm font-semibold text-gray-800">${item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>

                      {/* Customer Info */}
                      <div className="bg-gray-50 rounded-xl p-3 mb-3 text-sm text-gray-600 grid grid-cols-2 gap-2">
                        <div><span className="text-gray-400">Name:</span> {order.customerName}</div>
                        <div><span className="text-gray-400">Phone:</span> {order.customerPhone}</div>
                        <div><span className="text-gray-400">Table:</span> {order.tableNo}</div>
                        <div><span className="text-gray-400">Placed:</span> {formatTime(order.placedAt)} · {formatDate(order.placedAt)}</div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {cfg.next && (
                          <button
                            onClick={() => dispatch({ type: 'UPDATE_ORDER_STATUS', id: order.id, status: cfg.next })}
                            className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
                          >
                            Mark as {STATUS_CONFIG[cfg.next].label} →
                          </button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'served' && (
                          <button
                            onClick={() => dispatch({ type: 'UPDATE_ORDER_STATUS', id: order.id, status: 'cancelled' })}
                            className="bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold px-4 py-2 rounded-xl transition"
                          >
                            Cancel Order
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this order permanently?')) {
                              dispatch({ type: 'DELETE_ORDER', id: order.id });
                            }
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-xl transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
