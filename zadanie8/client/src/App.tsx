import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { AccountSettings } from './components/AccountSettings';
import { Cart } from './components/Cart';
import { Login } from './components/Login';
import { Payments } from './components/Payments';
import { Products } from './components/Products';
import { Register } from './components/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

function Navigation() {
  const { itemCount } = useCart();
  const { user, logout, loading } = useAuth();

  return (
    <nav>
      <Link to="/">Produkty</Link>
      <Link to="/cart" data-testid="nav-cart">
        Koszyk ({itemCount})
      </Link>
      <Link to="/payment">Płatności</Link>
      {!loading && user ? (
        <>
          <Link to="/account" data-testid="nav-account">
            Konto ({user.name})
          </Link>
          <button type="button" className="nav-btn" onClick={() => logout()} data-testid="nav-logout">
            Wyloguj
          </button>
        </>
      ) : (
        <>
          <Link to="/login" data-testid="nav-login">
            Logowanie
          </Link>
          <Link to="/register" data-testid="nav-register">
            Rejestracja
          </Link>
        </>
      )}
    </nav>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/payment" element={<Payments />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/account" element={<AccountSettings />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app">
            <header>
              <h1>PO26 — Sklep (React + testy)</h1>
              <Navigation />
            </header>
            <main>
              <AppRoutes />
            </main>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
