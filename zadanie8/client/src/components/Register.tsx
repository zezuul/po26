import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, type RegisterErrors } from '../api';

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage(null);
    setLoading(true);

    try {
      const result = await registerUser({ name, email, password });
      if (result.errors) {
        setErrors(result.errors);
        return;
      }
      setMessage(result.message || 'Zarejestrowano');
      setTimeout(() => navigate('/login'), 800);
    } catch {
      setMessage('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section data-testid="register-page">
      <h2>Rejestracja</h2>
      <form onSubmit={handleSubmit} className="form" data-testid="register-form" noValidate>
        <label htmlFor="reg-name">
          Imię i nazwisko
          <input
            id="reg-name"
            name="name"
            data-testid="register-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
          />
        </label>
        {errors.name && (
          <p className="error" data-testid="error-name" role="alert">
            {errors.name}
          </p>
        )}

        <label htmlFor="reg-email">
          E-mail
          <input
            id="reg-email"
            name="email"
            type="text"
            inputMode="email"
            data-testid="register-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
          />
        </label>
        {errors.email && (
          <p className="error" data-testid="error-email" role="alert">
            {errors.email}
          </p>
        )}

        <label htmlFor="reg-password">
          Hasło
          <input
            id="reg-password"
            name="password"
            type="password"
            data-testid="register-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
          />
        </label>
        {errors.password && (
          <p className="error" data-testid="error-password" role="alert">
            {errors.password}
          </p>
        )}

        <button type="submit" disabled={loading} data-testid="register-submit">
          {loading ? 'Rejestracja…' : 'Zarejestruj'}
        </button>
      </form>
      {message && (
        <p className="success" data-testid="register-message">
          {message}
        </p>
      )}
      <p>
        Masz konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </section>
  );
}
