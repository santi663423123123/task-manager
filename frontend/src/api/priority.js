const API_URL = 'http://localhost:5000/api/priorities';

export async function fetchPriorities() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch priorities');
  return res.json();
}
