import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { submitPayment } from '../api';
import { useCart } from '../context/CartContext';

export function Payments() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [cardHolder, setCardHolder] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setStatus('Koszyk jest pusty — dodaj produkty');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const result = await submitPayment({
        cardHolder,
        email,
        total,
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
      });
      setStatus(result.message || 'Płatność OK');
      clearCart();
      setTimeout(() => navigate('/'), 2000);
    } catch {
      setStatus('Błąd wysyłki płatności do serwera');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !status) {
    return (
      <section>
        <h2>Płatności</h2>
        <p className="info">Brak pozycji w koszyku.</p>
        <Link to="/">← Produkty</Link>
      </section>
    );
  }

  return (
    <section>
      <h2>Płatności</h2>
      <p className="info">Dane wysyłane do serwera (axios POST /api/payments)</p>
      <p>Do zapłaty: <strong>{total.toFixed(2)} PLN</strong></p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Imię i nazwisko na karcie
          <input
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            required
          />
        </label>
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Wysyłanie…' : 'Zapłać (mock)'}
        </button>
      </form>

      {status && <p className="success">{status}</p>}
      <Link to="/cart">← Koszyk</Link>
    </section>
  );
}
