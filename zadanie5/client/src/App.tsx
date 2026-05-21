import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Cart } from './components/Cart';
import { Payments } from './components/Payments';
import { Products } from './components/Products';
import { CartProvider, useCart } from './context/CartContext';

function Navigation() {
  const { itemCount } = useCart();

  return (
    <nav>
      <Link to="/">Produkty</Link>
      <Link to="/cart">Koszyk ({itemCount})</Link>
      <Link to="/payment">Płatności</Link>
    </nav>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/payment" element={<Payments />} />
    </Routes>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app">
          <header>
            <h1>PO26 — Sklep (React)</h1>
            <Navigation />
          </header>
          <main>
            <AppRoutes />
          </main>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}
