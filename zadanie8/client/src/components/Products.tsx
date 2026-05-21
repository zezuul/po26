import { useEffect, useMemo, useState } from 'react';
import { fetchProducts } from '../api';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err: unknown) => {
        const msg =
          err instanceof Error ? err.message : 'Nie udało się pobrać produktów z serwera';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [products, search]);

  if (loading) return <p className="info">Ładowanie produktów…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section data-testid="products-page">
      <h2>Produkty</h2>
      <p className="info">Dane z API (axios) — dodaj do koszyka</p>

      <label htmlFor="product-search" className="search-label">
        Szukaj (test XSS — React escapuje tekst)
        <input
          id="product-search"
          data-testid="product-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="np. Laptop"
        />
      </label>
      {search.trim() && (
        <p data-testid="search-preview">
          Wynik wyszukiwania dla: <span data-testid="search-query-text">{search}</span>
        </p>
      )}

      <div className="grid">
        {filtered.map((p) => (
          <article key={p.id} className="card" data-testid={`product-${p.id}`}>
            <h3>{p.name}</h3>
            <p className="muted">{p.category}</p>
            <p className="price">{p.price.toFixed(2)} PLN</p>
            <button
              type="button"
              data-testid={`add-to-cart-${p.id}`}
              onClick={() => addToCart(p)}
              aria-label={`Dodaj ${p.name} do koszyka`}
            >
              Do koszyka
            </button>
          </article>
        ))}
      </div>
      {filtered.length === 0 && <p className="info">Brak produktów dla podanego filtra.</p>}
    </section>
  );
}
