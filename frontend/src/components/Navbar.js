import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '2px solid var(--border)',
      padding: '0 32px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 700, color: 'var(--lime)', letterSpacing: '-0.5px' }}>
          HABITLOG_
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {isLoggedIn && (
          <>
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/habits', label: 'Habits' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{
                fontFamily: 'var(--mono)',
                fontSize: '12px',
                fontWeight: 500,
                color: isActive(to) ? 'var(--lime)' : 'var(--muted-mid)',
                padding: '6px 14px',
                borderBottom: isActive(to) ? '2px solid var(--lime)' : '2px solid transparent',
                transition: 'color 0.15s',
              }}>
                {label}
              </Link>
            ))}
            <button onClick={handleLogout} style={{
              marginLeft: '16px',
              fontFamily: 'var(--mono)',
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--muted)',
              background: 'none',
              padding: '6px 12px',
              border: '1px solid var(--border)',
            }}>
              logout
            </button>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Link to="/login" style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted-mid)', padding: '6px 14px' }}>
              login
            </Link>
            <Link to="/register" style={{
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--bg)',
              background: 'var(--lime)',
              padding: '8px 16px',
            }}>
              start free →
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
