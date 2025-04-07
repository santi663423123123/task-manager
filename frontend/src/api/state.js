const API_URL = 'http://localhost:5000/api/states';

export async function fetchStates() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch states');
  return res.json();
}
