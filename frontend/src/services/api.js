const BASE = 'http://localhost:8000';

const h = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});

export const register = (data) =>
  fetch(`${BASE}/register/`, { method: 'POST', headers: h(), body: JSON.stringify(data) }).then(r => r.json());

export const login = (username, password) => {
  const form = new URLSearchParams();
  form.append('username', username);
  form.append('password', password);
  return fetch(`${BASE}/token/`, { method: 'POST', body: form }).then(r => r.json());
};

export const getMe = (token) =>
  fetch(`${BASE}/users/me/`, { headers: h(token) }).then(r => r.json());

export const getHabits = (token) =>
  fetch(`${BASE}/habits/`, { headers: h(token) }).then(r => r.json());

export const createHabit = (title, token) =>
  fetch(`${BASE}/habits/`, { method: 'POST', headers: h(token), body: JSON.stringify({ title }) }).then(r => r.json());

export const deleteHabit = (id, token) =>
  fetch(`${BASE}/habits/${id}`, { method: 'DELETE', headers: h(token) }).then(r => r.json());

export const getLogs = (date, token) =>
  fetch(`${BASE}/habitlogs/?date=${date}`, { headers: h(token) }).then(r => r.json());

export const logHabit = (habitId, date, completed, token) =>
  fetch(`${BASE}/habitlogs/`, {
    method: 'POST', headers: h(token),
    body: JSON.stringify({ habitId, date, completed }),
  }).then(r => r.json());

export const updateLog = (habitId, date, completed, token) =>
  fetch(`${BASE}/habitlogs/`, {
    method: 'PUT', headers: h(token),
    body: JSON.stringify({ habitId, date, completed }),
  }).then(r => r.json());
