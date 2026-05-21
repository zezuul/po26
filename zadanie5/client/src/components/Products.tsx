import { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError('Nie udało się pobrać produktów z serwera'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="info">Ładowanie produktów…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h2>Produkty</h2>
      <p className="info">Dane z API (axios) — dodaj do koszyka</p>
      <div className="grid">
        {products.map((p) => (
          <article key={p.id} className="card">
            <h3>{p.name}</h3>
            <p className="muted">{p.category}</p>
            <p className="price">{p.price.toFixed(2)} PLN</p>
            <button type="button" onClick={() => addToCart(p)}>
              Do koszyka
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
