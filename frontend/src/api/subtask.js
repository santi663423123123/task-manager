const API_URL = 'http://localhost:5000/api/subtask';

export async function fetchSubtasksByStatus(taskId, statusList = []) {
  const res = await fetch(`${API_URL}/filter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskId, statuses: statusList }),
  });

  if (!res.ok) throw new Error('Error fetching filtered subtasks');
  return res.json();
}
