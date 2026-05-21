import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await login(email, password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    navigate('/account');
  };

  return (
    <section data-testid="login-page">
      <h2>Logowanie</h2>
      <form onSubmit={handleSubmit} className="form" data-testid="login-form">
        <label htmlFor="login-email">
          E-mail
          <input
            id="login-email"
            name="email"
            type="email"
            data-testid="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label htmlFor="login-password">
          Hasło
          <input
            id="login-password"
            name="password"
            type="password"
            data-testid="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading} data-testid="login-submit">
          {loading ? 'Logowanie…' : 'Zaloguj'}
        </button>
      </form>
      {error && (
        <p className="error" data-testid="login-error" role="alert">
          {error}
        </p>
      )}
      <p>
        <Link to="/register">Rejestracja</Link>
      </p>
    </section>
  );
}
