import { useState, useEffect } from 'react';
import { getHabits, getLogs, logHabit, updateLog } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const today = () => new Date().toISOString().split('T')[0];

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
};

const getDayDates = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

export default function Dashboard() {
  const { token } = useAuth();
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today());
  const [loading, setLoading] = useState(true);
  const weekDates = getDayDates();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [h, l] = await Promise.all([
        getHabits(token),
        getLogs(selectedDate, token)
      ]);
      setHabits(Array.isArray(h) ? h : []);
      setLogs(Array.isArray(l) ? l : []);
      setLoading(false);
    };
    load();
  }, [token, selectedDate]);

  const isLogged = (habitId) => logs.find(l => Number(l.habitId) === Number(habitId));
  const isDone = (habitId) => logs.find(l => Number(l.habitId) === Number(habitId) && l.completed);

  const handleToggle = async (habitId) => {
    console.log('selectedDate:', selectedDate);
    console.log('logs:', logs);
    const existing = isLogged(habitId);
    console.log('existing:', existing);
    if (existing) {
      const updated = await updateLog(habitId, selectedDate, !existing.completed, token);
      setLogs(logs.map(l => l.habitId === habitId ? { ...l, completed: updated.completed } : l));
    } else {
      const newLog = await logHabit(habitId, selectedDate, true, token);
      setLogs([...logs, newLog]);
    }
  };

  const completedCount = habits.filter(h => isDone(h.id)).length;
  const totalCount = habits.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const dayLabel = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase();
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--lime)', letterSpacing: '0.15em', marginBottom: '8px' }}>
            // daily log
          </div>
          <h1 style={{ fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px' }}>
            {formatDate(selectedDate)}
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '48px', fontWeight: 700, color: pct === 100 ? 'var(--lime)' : 'var(--text)', lineHeight: 1 }}>
            {pct}<span style={{ fontSize: '20px', color: 'var(--muted)' }}>%</span>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>
            {completedCount}/{totalCount} done
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', background: 'var(--border)', marginBottom: '32px' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: pct === 100 ? 'var(--lime)' : 'var(--lime-dim)',
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Week selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '40px' }}>
        {weekDates.map(date => (
          <button key={date} onClick={() => setSelectedDate(date)} style={{
            padding: '10px 4px',
            background: date === selectedDate ? 'var(--lime)' : 'var(--card)',
            border: '2px solid',
            borderColor: date === selectedDate ? 'var(--lime)' : 'var(--border)',
            color: date === selectedDate ? 'var(--bg)' : 'var(--muted)',
            fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700,
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '4px',
          }}>
            <span>{dayLabel(date)}</span>
            <span style={{ fontSize: '13px', color: 'inherit' }}>{new Date(date + 'T00:00:00').getDate()}</span>
          </button>
        ))}
      </div>

      {/* Habit list */}
      {loading && (
        <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', padding: '24px 0' }}>
          loading...
        </div>
      )}

      {!loading && habits.length === 0 && (
        <div style={{ border: '2px dashed var(--border)', padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
            no habits configured yet.
          </div>
          <Link to="/habits" style={{
            fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 700,
            color: 'var(--bg)', background: 'var(--lime)', padding: '10px 20px',
          }}>
            add your first habit →
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {habits.map(habit => {
          const done = isDone(habit.id);
          return (
            <button key={habit.id} onClick={() => handleToggle(habit.id)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 20px',
              background: done ? 'var(--lime-bg)' : 'var(--card)',
              border: '2px solid',
              borderColor: done ? 'var(--lime)' : 'var(--border)',
              borderLeft: `4px solid ${done ? 'var(--lime)' : 'var(--border)'}`,
              cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'all 0.15s',
            }}>
              <span style={{
                fontWeight: 500, fontSize: '14px',
                color: done ? 'var(--lime)' : 'var(--text)',
                textDecoration: done ? 'none' : 'none',
                fontFamily: 'var(--sans)',
              }}>
                {habit.title}
              </span>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700,
                color: done ? 'var(--lime)' : 'var(--muted)',
              }}>
                {done ? '[✓ DONE]' : '[ LOG ]'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
