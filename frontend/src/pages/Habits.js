import { useState, useEffect } from 'react';
import { getHabits, createHabit, deleteHabit } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Habits() {
  const { token } = useAuth();
  const [habits, setHabits] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getHabits(token).then(d => { setHabits(Array.isArray(d) ? d : []); setLoading(false); });
  }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    const h = await createHabit(newTitle.trim(), token);
    if (h.id) { setHabits([...habits, h]); setNewTitle(''); }
    setAdding(false);
  };

  const handleDelete = async (id) => {
    await deleteHabit(id, token);
    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--lime)', letterSpacing: '0.15em', marginBottom: '16px' }}>
        // habit list
      </div>
      <h1 style={{ fontFamily: 'var(--mono)', fontSize: '28px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '40px' }}>
        Your habits.
      </h1>

      {/* Add form */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
        <input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="new habit name..."
          style={{
            flex: 1, padding: '12px 16px',
            background: 'var(--card)', border: '2px solid var(--border)',
            color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: '13px',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--lime)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button type="submit" disabled={adding} style={{
          padding: '12px 24px', background: 'var(--lime)',
          color: 'var(--bg)', fontFamily: 'var(--mono)',
          fontWeight: 700, fontSize: '13px',
        }}>
          {adding ? '...' : '+ add'}
        </button>
      </form>

      {loading && (
        <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', padding: '24px 0' }}>
          loading...
        </div>
      )}

      {!loading && habits.length === 0 && (
        <div style={{ border: '2px dashed var(--border)', padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.1em' }}>
            no habits yet. add your first one above.
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {habits.map((h, i) => (
          <div key={h.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'var(--card)',
            border: '2px solid var(--border)',
            borderLeft: '4px solid var(--lime)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', minWidth: '24px' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontWeight: 500, fontSize: '14px' }}>{h.title}</span>
            </div>
            <button onClick={() => handleDelete(h.id)} style={{
              background: 'none', color: 'var(--muted)',
              fontFamily: 'var(--mono)', fontSize: '11px',
              padding: '4px 8px', border: '1px solid transparent',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.target.style.color = 'var(--orange)'; e.target.style.borderColor = 'var(--orange)'; }}
              onMouseLeave={e => { e.target.style.color = 'var(--muted)'; e.target.style.borderColor = 'transparent'; }}
            >
              [remove]
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
