import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext(null);

const initialState = {
  cart: [],
  orders: JSON.parse(localStorage.getItem('restaurant_orders') || '[]'),
  adminLoggedIn: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, cart: [...state.cart, { ...action.item, qty: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.id !== action.id) };
    case 'UPDATE_QTY': {
      if (action.qty <= 0) {
        return { ...state, cart: state.cart.filter(i => i.id !== action.id) };
      }
      return {
        ...state,
        cart: state.cart.map(i =>
          i.id === action.id ? { ...i, qty: action.qty } : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'PLACE_ORDER': {
      const order = {
        id: `ORD-${Date.now()}`,
        items: state.cart,
        total: state.cart.reduce((s, i) => s + i.price * i.qty, 0),
        status: 'pending',
        customerName: action.customerName,
        customerPhone: action.customerPhone,
        tableNo: action.tableNo,
        placedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const orders = [order, ...state.orders];
      localStorage.setItem('restaurant_orders', JSON.stringify(orders));
      return { ...state, cart: [], orders };
    }
    case 'UPDATE_ORDER_STATUS': {
      const orders = state.orders.map(o =>
        o.id === action.id
          ? { ...o, status: action.status, updatedAt: new Date().toISOString() }
          : o
      );
      localStorage.setItem('restaurant_orders', JSON.stringify(orders));
      return { ...state, orders };
    }
    case 'DELETE_ORDER': {
      const orders = state.orders.filter(o => o.id !== action.id);
      localStorage.setItem('restaurant_orders', JSON.stringify(orders));
      return { ...state, orders };
    }
    case 'ADMIN_LOGIN':
      return { ...state, adminLoggedIn: true };
    case 'ADMIN_LOGOUT':
      return { ...state, adminLoggedIn: false };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <AppContext.Provider value={{ state, dispatch, cartCount, cartTotal }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
