import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function Cart() {
  const { items, total, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <section>
        <h2>Koszyk</h2>
        <p className="info">Koszyk jest pusty.</p>
        <Link to="/">← Wróć do produktów</Link>
      </section>
    );
  }

  return (
    <section>
      <h2>Koszyk</h2>
      <ul className="cart-list">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="cart-row">
            <div>
              <strong>{product.name}</strong>
              <span className="muted"> — {product.price.toFixed(2)} PLN</span>
            </div>
            <div className="cart-actions">
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  updateQuantity(product.id, parseInt(e.target.value, 10) || 1)
                }
              />
              <button type="button" className="secondary" onClick={() => removeFromCart(product.id)}>
                Usuń
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="total">Razem: <strong>{total.toFixed(2)} PLN</strong></p>
      <Link to="/payment" className="btn-link">
        Przejdź do płatności →
      </Link>
    </section>
  );
}
