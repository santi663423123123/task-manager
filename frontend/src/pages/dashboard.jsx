import { useEffect, useState } from 'react';
import TaskList from '../components/task_list';
import TaskForm from '../components/task_form';
import { fetchTasks } from '../api/task';
import { fetchPriorities } from '../api/priority';
import { fetchStates } from '../api/state';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();

      const mappedData = data.map((task) => ({
        id: task.id,
        title: task.titulo,
        status: task.state.nombre || '-',
        description: task.descripcion || '-',
        statusColor: task.state.color || '#ccc',
        priority: task.priority.nombre || '-',
        priorityColor: task.priority.color || '#ccc',
        estimate: task.valor_estimado,
        created_at: task.fecha_creacion,
        updated_at: task.fecha_actualizacion,
        subtasks: task.subtasks,
      }));

      setTasks(mappedData);
    } catch (err) {
      console.error('Error al cargar tareas:', err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="containerTasks container-fluid py-4">
      <div className="row align-items-center mb-4">
        <div className="col-12 d-flex flex-column flex-md-row justify-content-between  align-items-md-center">
          <h1 className="TaskNameDashboard display-6 fw-bold mb-3 mb-md-0">📋 Task Dashboard</h1>
          <TaskForm onCreate={loadTasks} />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <TaskList tasks={tasks} reloadTasks={loadTasks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
