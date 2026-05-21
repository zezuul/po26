import { FormEvent, useEffect, useRef, useState } from 'react';
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
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

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
      redirectTimeoutRef.current = setTimeout(() => navigate('/'), 2000);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Błąd wysyłki płatności do serwera';
      setStatus(message);
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
      <p>
        Do zapłaty: <strong>{total.toFixed(2)} PLN</strong>
      </p>

      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="cardHolder">
          Imię i nazwisko na karcie
          <input
            id="cardHolder"
            name="cardHolder"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            required
            autoComplete="name"
          />
        </label>
        <label htmlFor="email">
          E-mail
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? 'Wysyłanie…' : 'Zapłać (mock)'}
        </button>
      </form>

      {status && <p className="success">{status}</p>}
      <Link to="/cart">← Koszyk</Link>
    </section>
  );
}
