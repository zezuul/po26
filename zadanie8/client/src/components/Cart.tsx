import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function Cart() {
  const { items, total, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <section data-testid="cart-page">
        <h2>Koszyk</h2>
        <p className="info">Koszyk jest pusty.</p>
        <Link to="/">← Wróć do produktów</Link>
      </section>
    );
  }

  return (
    <section data-testid="cart-page">
      <h2>Koszyk</h2>
      <ul className="cart-list">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="cart-row" data-testid={`cart-item-${product.id}`}>
            <div>
              <strong>{product.name}</strong>
              <span className="muted"> — {product.price.toFixed(2)} PLN</span>
            </div>
            <div className="cart-actions">
              <button
                type="button"
                aria-label="Zmniejsz ilość"
                data-testid={`qty-decrease-${product.id}`}
                onClick={() => updateQuantity(product.id, quantity - 1)}
              >
                −
              </button>
              <span data-testid={`qty-value-${product.id}`}>{quantity}</span>
              <button
                type="button"
                aria-label="Zwiększ ilość"
                data-testid={`qty-increase-${product.id}`}
                onClick={() => updateQuantity(product.id, quantity + 1)}
              >
                +
              </button>
              <button
                type="button"
                className="secondary"
                data-testid={`remove-${product.id}`}
                onClick={() => removeFromCart(product.id)}
              >
                Usuń
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="total" data-testid="cart-total">
        Razem: <strong>{total.toFixed(2)} PLN</strong>
      </p>
      <Link to="/payment" className="btn-link" data-testid="cart-to-payment">
        Przejdź do płatności →
      </Link>
    </section>
  );
}
