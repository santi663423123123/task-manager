import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { fetchStatuses, createTask, fetchTasks, calculateSubtaskEstimates } from '../api/task';
import { fetchPriorities } from '../api/priority';
import { fetchStates } from '../api/state';
import Select from 'react-select';

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [creationDate, setCreationDate] = useState('');

  const [priorities, setPriorities] = useState([]);
  const [states, setStates] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  const [priority, setPriority] = useState(null);
  const [state, setState] = useState(null);
  const [selectedSubtasks, setSelectedSubtasks] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const closeModal = () => {
    setTitle('');
    setDescription('');
    setEstimatedValue('');
    setCreationDate('');
    setPriority(null);
    setState(null);
    setSelectedSubtasks([]);
    setShowModal(false);
    setErrorMsg('');
  };

  useEffect(() => {
    async function loadOptions() {
      try {
        const [priorityData, stateData, taskData] = await Promise.all([
          fetchPriorities(),
          fetchStates(),
          fetchTasks(),
        ]);

        setPriorities(priorityData);
        setStates(stateData);
        setAllTasks(taskData);
      } catch (error) {
        console.error('Error loading options', error);
      }
    }

    if (showModal) {
      loadOptions();
    }
  }, [showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!title.trim()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const newTask = await createTask({
        title,
        description,
        estimatedValue,
        creationDate,
        priority: priority?.value ?? '',
        status: state?.value ?? '',
        subtasks: selectedSubtasks.map((t) => t.value),
      });
      onCreate(newTask);
      closeModal();
    } catch (error) {
      console.error('❌ Error creando la tarea:', error);
      setErrorMsg('❌ Error creating task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="success"
        onClick={() => setShowModal(true)}
        className="mb-2 mb-md-0 ms-0 ms-md-3 w-100 w-md-auto text-nowrap"
      >
        <span className="d-none d-sm-inline">➕ Add Task</span>
        <span className="d-inline d-sm-none">➕</span>
      </Button>

      <Modal show={showModal} onHide={closeModal} centered backdrop="static" keyboard>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                min="0"
                placeholder="Estimated value (not negative)"
                value={estimatedValue}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || Number(value) >= 0) {
                    setEstimatedValue(value);
                  }
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Select
                value={priority}
                onChange={setPriority}
                options={priorities.map((p) => ({
                  value: p.id,
                  label: p.nombre,
                  color: p.color,
                }))}
                placeholder="Priority"
                getOptionLabel={(e) => (
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
                )}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Select
                value={state}
                onChange={setState}
                options={states.map((s) => ({
                  value: s.id,
                  label: s.nombre,
                  color: s.color,
                }))}
                placeholder="State"
                getOptionLabel={(e) => (
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
                )}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <label className="mb-1">Subtasks</label>
              <Select
                isMulti
                value={selectedSubtasks}
                onChange={setSelectedSubtasks}
                options={allTasks.map((task) => ({
                  value: task.id,
                  label: `#${task.id} ${task.titulo}`,
                  stateColor: task.state?.color ?? '#999',
                  stateLabel: task.state?.nombre ?? 'No state',
                  priorityColor: task.priority?.color ?? '#999',
                  priorityLabel: task.priority?.nombre ?? 'No priority',
                }))}
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
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
