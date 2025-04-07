import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { fetchTasks, updateTask, deleteTask, calculateSubtaskEstimates } from '../api/task';
import { fetchPriorities } from '../api/priority';
import { fetchStates } from '../api/state';
import { FaTrash } from 'react-icons/fa';
import ConfirmationDialog from './confirmation_dialog';

export default function TaskDetailModal({ task, onClose, onChange, onSave }) {
  const [states, setStates] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [selectedSubtasks, setSelectedSubtasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  const [pendingEstimate, setPendingEstimate] = useState(0);
  const [inProgressEstimate, setInProgressEstimate] = useState(0);
  const [totalEstimate, setTotalEstimate] = useState(0);

  useEffect(() => {
    async function updateEstimates() {
      try {
        const subtaskIds = selectedSubtasks.map((s) => s.value);

        const [pendingResult, inProgressResult, totalResult] = await Promise.all([
          calculateSubtaskEstimates(subtaskIds, ['Backlog', 'Unstarted']),
          calculateSubtaskEstimates(subtaskIds, ['Started']),
          calculateSubtaskEstimates(subtaskIds, ['ALL']),
        ]);

        setPendingEstimate(pendingResult.totalEstimate);
        setInProgressEstimate(inProgressResult.totalEstimate);
        setTotalEstimate(totalResult.totalEstimate);
      } catch (err) {
        console.error('Error calculating estimates:', err);
      }
    }

    if (selectedSubtasks.length > 0) {
      updateEstimates();
    } else {
      setPendingEstimate(0);
      setInProgressEstimate(0);
      setTotalEstimate(0);
    }
  }, [selectedSubtasks]);

  const [confirmation, setConfirmation] = useState({
    show: false,
    action: '',
    message: '',
  });

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      onChange?.();
      onClose?.();
    } catch (err) {
      alert('⚠️ Error Deleting Task:\n' + err.message);
      console.error('Error deleting task', err);
    }
  };

  const buildAncestorSet = (taskId, tasks, visited = new Set()) => {
    if (visited.has(taskId)) return;
    visited.add(taskId);

    for (const t of tasks) {
      if (
        t.subtasks?.some((s) => {
          const subId = s.subtask?.id ?? s.tarea_id ?? s.id;
          return subId === taskId;
        })
      ) {
        buildAncestorSet(t.id, tasks, visited);
      }
    }

    return visited;
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [priorityData, stateData, taskData] = await Promise.all([
          fetchPriorities(),
          fetchStates(),
          fetchTasks(),
        ]);

        setStates(stateData);
        setPriorities(priorityData);
        setAllTasks(taskData);

        const selected =
          task.subtasks
            ?.map((sub) => {
              const subtaskId = sub.subtask?.id ?? sub.tarea_id ?? sub.id;
              const fullTask = taskData.find((t) => t.id === subtaskId);

              if (!fullTask) return null;

              return {
                value: fullTask.id,
                label: `#${fullTask.id} ${fullTask.title || fullTask.titulo || 'No title'}`,
                stateColor: fullTask.state?.color ?? '#999',
                stateLabel: fullTask.state?.nombre ?? 'No state',
                priorityColor: fullTask.priority?.color ?? '#999',
                priorityLabel: fullTask.priority?.nombre ?? 'No priority',
              };
            })
            .filter(Boolean) || [];
        setSelectedSubtasks(selected);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    }

    if (task) {
      loadData();
    }
  }, [task]);

  if (!task) return null;

  const stateOptions = states.map((s) => ({
    value: s.nombre,
    label: s.nombre,
    color: s.color,
  }));

  const priorityOptions = priorities.map((p) => ({
    value: p.nombre,
    label: p.nombre,
    color: p.color,
  }));

  const getOptionLabel = (e) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          backgroundColor: e.color,
          width: 10,
          height: 10,
          borderRadius: '50%',
          marginRight: 8,
        }}
      />
      {e.label}
    </div>
  );

  const subtaskOptions = (() => {
    const ancestorIds = buildAncestorSet(task.id, allTasks) || new Set();
    return allTasks
      .filter((t) => t.id !== task.id && !ancestorIds.has(t.id))
      .map((task) => ({
        value: task.id,
        label: `#${task.id} ${task.titulo}`,
        stateColor: task.state?.color ?? '#999',
        stateLabel: task.state?.nombre ?? 'No state',
        priorityColor: task.priority?.color ?? '#999',
        priorityLabel: task.priority?.nombre ?? 'No priority',
      }));
  })();

  return (
    <Modal show={true} onHide={onClose} centered backdrop="static" keyboard>
      <Modal.Header closeButton>
        <Modal.Title>📝 Task #{task.id}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Title:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={task.title}
              onChange={(e) => onChange({ ...task, title: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Description:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={task.description}
              onChange={(e) => onChange({ ...task, description: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Status:</strong>
            </Form.Label>
            <Select
              value={stateOptions.find((opt) => opt.value === task.status)}
              onChange={(selected) =>
                onChange({
                  ...task,
                  status: selected.value,
                  statusColor: selected.color,
                })
              }
              options={stateOptions}
              placeholder="Select state"
              getOptionLabel={getOptionLabel}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Priority:</strong>
            </Form.Label>
            <Select
              value={priorityOptions.find((opt) => opt.value === task.priority)}
              onChange={(selected) =>
                onChange({
                  ...task,
                  priority: selected.value,
                  priorityColor: selected.color,
                })
              }
              options={priorityOptions}
              placeholder="Select priority"
              getOptionLabel={getOptionLabel}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Estimation (minutes):</strong>
            </Form.Label>
            <Form.Control
              type="number"
              value={task.estimate || ''}
              onChange={(e) =>
                onChange({
                  ...task,
                  estimate: parseInt(e.target.value),
                })
              }
              min="0"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Created at:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={new Date(task.created_at).toLocaleString('es-ES', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Last Update:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={
                task.updated_at
                  ? new Date(task.updated_at).toLocaleString('es-ES', {
                      year: '2-digit',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'No updates'
              }
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Subtasks:</strong>
            </Form.Label>
            <Select
              isMulti
              value={selectedSubtasks}
              onChange={(selected) => {
                setSelectedSubtasks(selected);
                const updatedSubtasks = selected.map((opt) => ({
                  id: opt.value,
                }));
                onChange({
                  ...task,
                  subtasks: updatedSubtasks,
                });
              }}
              options={subtaskOptions}
              getOptionLabel={(e) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{e.label}</span>
                  <div style={{ fontSize: '0.8em', display: 'flex', gap: '1em' }}>
                    <span style={{ color: e.stateColor }}>{e.stateLabel}</span>
                    <span style={{ color: e.priorityColor }}>{e.priorityLabel}</span>
                  </div>
                </div>
              )}
              placeholder="Select subtasks for this task"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <strong>📈 Subtask Estimates:</strong>
            </Form.Label>
            <div className="table-responsive">
              <table className="table table-bordered table-sm mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Status</th>
                    <th>Description</th>
                    <th>Estimate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>⏳ Pending</td>
                    <td>Backlog, Unstarted</td>
                    <td>{pendingEstimate.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>🚧 In Progress</td>
                    <td>Started</td>
                    <td>{inProgressEstimate.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>📊 Total</td>
                    <td>All subtasks</td>
                    <td>{totalEstimate.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => {
            setConfirmation({
              show: true,
              action: () => handleDeleteTask(task.id),
              message: `Are you sure you want to delete task #${task.id}?`,
            });
          }}
        >
          <FaTrash style={{ marginRight: 6 }} />
          Delete
        </Button>

        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={() => {
            setConfirmation({
              show: true,
              message: `Are you sure you want to Update task #${task.id}?`,
              action: async () => {
                try {
                  const updated = await updateTask(task.id, {
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    subtasks: selectedSubtasks.map((t) => t.value),
                  });
                  onSave?.(updated);
                  onClose();
                } catch (err) {
                  alert('⚠️ Error Updating Task:\n' + err.message);
                  console.error('❌ Error al actualizar tarea:', err);
                }
              },
            });
          }}
        >
          Update
        </Button>
        <ConfirmationDialog
          show={confirmation.show}
          message={confirmation.message}
          onCancel={() => setConfirmation({ ...confirmation, show: false })}
          onConfirm={() => {
            confirmation.action?.();
            setConfirmation({ ...confirmation, show: false });
          }}
        />
      </Modal.Footer>
    </Modal>
  );
}
