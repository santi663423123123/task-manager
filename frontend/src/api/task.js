const API_URL = 'http://localhost:5000/api/tasks';

export async function fetchStatuses() {
  const res = await fetch('http://localhost:5000/api/statuses');
  if (!res.ok) throw new Error('Failed to fetch statuses');
  return res.json();
}

export async function fetchTasks() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error fetching tasks');
  return res.json();
}

export async function fetchTaskById(taskId) {
  const res = await fetch(`${API_URL}/${taskId}`);
  if (!res.ok) throw new Error('Error fetching task');
  return res.json();
}

export async function createTask(task) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Error creating task');
  return res.json();
}

export async function updateTask(taskId, updatedTask) {

  const res = await fetch(`${API_URL}/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTask),
  });
  if (!res.ok) throw new Error('Error updating task');

  return res.json();
}

export async function deleteTask(taskId) {
  const res = await fetch(`${API_URL}/${taskId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error deleting task');
  return res.json();
}

export async function calculateSubtaskEstimates(subtaskIds, targetStates) {
  try {
    const allTasks = await fetchTasks();

    const filteredSubtasks = allTasks.filter((task) => {
      const isSubtask = subtaskIds.includes(task.id);

      if (!isSubtask) return false;

      if (targetStates.includes('ALL')) {
        return true;
      }

      return targetStates.includes(task.state?.nombre);
    });

    const totalEstimate = filteredSubtasks.reduce((sum, task) => {
      const estimate = parseFloat(task.valor_estimado) || 0;
      return sum + estimate;
    }, 0);

    return {
      totalEstimate,
      count: filteredSubtasks.length,
    };
  } catch (error) {
    console.error('Error calculating estimates:', error);
    throw error;
  }
}
