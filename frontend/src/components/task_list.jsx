import { useState } from 'react';
import DataTable from 'react-data-table-component';
import TaskDetailModal from '../components/task_details';

export default function TaskList({ tasks, reloadTasks }) {
  const [filterText, setFilterText] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const filteredTasks = tasks.filter((task) =>
    task.title?.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    { name: 'ID', selector: (row) => row.id, sortable: true, width: '80px' },
    { name: 'Title', selector: (row) => row.title, sortable: true },
    {
      name: 'Status',
      cell: (row) => (
        <span
          style={{
            backgroundColor: row.statusColor || '#ccc',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '6px',
            display: 'inline-block',
            minWidth: '90px',
            textAlign: 'center',
          }}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'Priority',
      cell: (row) => (
        <span
          style={{
            backgroundColor: row.priorityColor || '#ccc',
            color: '#000',
            padding: '4px 8px',
            borderRadius: '6px',
            display: 'inline-block',
            minWidth: '90px',
            textAlign: 'center',
          }}
        >
          {row.priority}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'Estimate',
      selector: (row) => row.estimate || '-',
      sortable: true,
    },
    {
      name: 'Created',
      selector: (row) =>
        new Date(row.created_at).toLocaleString('es-ES', {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <button className="btn btn-sm btn-primary" onClick={() => setSelectedTask(row)}>
          📄 Detail
        </button>
      ),

      ignoreRowClick: true,
    },
  ];

  const customStyles = {
    headCells: { style: { fontWeight: 'bold', fontSize: '14px' } },
    cells: { style: { wordBreak: 'break-word', whiteSpace: 'normal' } },
  };

  return (
    <>
      <div className="mb-3">
        <input
          type="text"
          placeholder="🔍 search by title ..."
          className="form-control"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <DataTable
          title="Task List"
          columns={columns}
          data={filteredTasks}
          pagination
          highlightOnHover
          striped
          fixedHeader
          persistTableHead
          responsive
          customStyles={customStyles}
        />
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => {
            setSelectedTask(null);
            reloadTasks();
          }}
          onChange={(updatedTask) => setSelectedTask(updatedTask)}
          onSave={(task) => {
            setSelectedTask(null);
            reloadTasks();
          }}
        />
      )}
    </>
  );
}
