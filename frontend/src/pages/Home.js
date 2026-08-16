import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        opacity: 0.4,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 32px 80px' }}>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: '11px',
            color: 'var(--lime)',
            letterSpacing: '0.2em',
            marginBottom: '32px',
          }}>
            // TRACK · MEASURE · DOMINATE
          </div>

          <h1 style={{
            fontFamily: 'var(--mono)',
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-3px',
            marginBottom: '32px',
            color: 'var(--text)',
          }}>
            BUILD HABITS<br />
            <span style={{ color: 'var(--lime)' }}>THAT DON'T</span><br />
            BREAK.
          </h1>

          <p style={{
            fontSize: '15px',
            color: 'var(--muted-mid)',
            maxWidth: '420px',
            lineHeight: 1.7,
            marginBottom: '48px',
          }}>
            No subscriptions. No paywalls. No bullshit. Log your habits daily, watch the streaks grow, understand what's actually working.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {isLoggedIn ? (
              <Link to="/dashboard" style={{
                fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '13px',
                color: 'var(--bg)', background: 'var(--lime)',
                padding: '14px 32px', display: 'inline-block',
              }}>
                open dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" style={{
                  fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '13px',
                  color: 'var(--bg)', background: 'var(--lime)',
                  padding: '14px 32px', display: 'inline-block',
                }}>
                  start tracking →
                </Link>
                <Link to="/login" style={{
                  fontFamily: 'var(--mono)', fontWeight: 500, fontSize: '13px',
                  color: 'var(--muted-mid)', background: 'transparent',
                  padding: '14px 32px', display: 'inline-block',
                  border: '1px solid var(--border)',
                }}>
                  sign in
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          borderTop: '2px solid var(--border)',
          borderBottom: '2px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {[
            { num: '100%', label: 'free. always.' },
            { num: '∞', label: 'habits to track' },
            { num: '0', label: 'ads. ever.' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '32px',
              borderRight: i < 2 ? '2px solid var(--border)' : 'none',
            }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '40px', fontWeight: 700, color: 'var(--lime)', lineHeight: 1, marginBottom: '8px' }}>
                {s.num}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.1em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 32px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '40px' }}>
            // features
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2px' }}>
            {[
              { tag: '[LOG]', title: 'Daily tracking', body: 'Mark habits done or not. One tap, clean interface, no friction.' },
              { tag: '[VIEW]', title: 'Streak calendar', body: 'See your entire history at a glance. Find where you broke and why.' },
              { tag: '[DATA]', title: 'Real insights', body: 'Understand what is working and what is not, based on your own data.' },
            ].map((f) => (
              <div key={f.tag} style={{
                background: 'var(--card)',
                border: '2px solid var(--border)',
                padding: '28px',
                borderLeft: '4px solid var(--lime)',
              }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--lime)', marginBottom: '16px' }}>
                  {f.tag}
                </div>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>{f.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--muted-mid)', lineHeight: 1.65 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
