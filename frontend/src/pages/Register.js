import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

const inputStyle = {
  width: '100%', padding: '12px 16px',
  background: 'var(--card)', border: '2px solid var(--border)',
  color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: '13px',
  transition: 'border-color 0.15s',
};

export default function Register() {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await register(form);
      if (data.id) navigate('/login');
      else setError('username or email already taken');
    } catch { setError('connection error'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--lime)', letterSpacing: '0.15em', marginBottom: '24px' }}>
          // create account
        </div>
        <h1 style={{ fontFamily: 'var(--mono)', fontSize: '28px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '32px' }}>
          Start tracking.
        </h1>

        {error && (
          <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--orange)', padding: '12px 16px', border: '1px solid var(--orange)', marginBottom: '20px' }}>
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { key: 'email', label: 'email', type: 'email' },
            { key: 'username', label: 'username', type: 'text' },
            { key: 'password', label: 'password', type: 'password' },
          ].map(({ key, label, type }) => (
            <div key={key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '8px', letterSpacing: '0.1em' }}>
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--lime)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? 'var(--muted)' : 'var(--lime)',
            color: 'var(--bg)', fontFamily: 'var(--mono)',
            fontWeight: 700, fontSize: '13px', marginTop: '8px',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'creating account...' : 'create account →'}
          </button>
        </form>

        <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', marginTop: '24px', textAlign: 'center' }}>
          already have an account? <Link to="/login" style={{ color: 'var(--lime)' }}>sign in</Link>
        </p>
      </div>
    </div>
  );
}
