import { Modal, Button } from 'react-bootstrap';

export default function ConfirmationDialog({ show, message, onCancel, onConfirm }) {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      backdrop={true}
      backdropClassName="custom-backdrop"
      style={{ zIndex: 1060 }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
