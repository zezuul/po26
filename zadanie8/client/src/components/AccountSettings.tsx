import { FormEvent, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { fetchCsrfToken, updateAccountSettings } from '../api';
import { useAuth } from '../context/AuthContext';

export function AccountSettings() {
  const { user, loading, setUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <p className="info">Ładowanie konta…</p>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setSubmitting(true);

    try {
      const token = await fetchCsrfToken();
      const result = await updateAccountSettings(displayName || user!.name, token);
      if (!result.success) {
        setError(result.error || 'Nie udało się zapisać');
        return;
      }
      setUser(result.user);
      setStatus('Ustawienia zapisane');
    } catch {
      setError('Błąd zapisu ustawień');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section data-testid="account-page">
      <h2>Ustawienia konta</h2>
      <p data-testid="account-current-name">
        Aktualna nazwa: <strong>{user!.name}</strong>
      </p>
      <form onSubmit={handleSubmit} className="form" data-testid="account-form">
        <label htmlFor="displayName">
          Wyświetlana nazwa
          <input
            id="displayName"
            name="displayName"
            data-testid="account-display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={user!.name}
          />
        </label>
        <button type="submit" disabled={submitting} data-testid="account-submit">
          Zapisz (z tokenem CSRF)
        </button>
      </form>
      {status && (
        <p className="success" data-testid="account-success">
          {status}
        </p>
      )}
      {error && (
        <p className="error" data-testid="account-error" role="alert">
          {error}
        </p>
      )}
      <p className="info">
        Ochrona CSRF: nagłówek <code>X-CSRF-Token</code> z endpointu{' '}
        <code>/api/csrf-token</code>.
      </p>
      <Link to="/">← Produkty</Link>
    </section>
  );
}
