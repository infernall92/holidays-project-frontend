/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';

export default function MyModal({
  open,
  onSubmit,
  onClose,
  days,
  // eslint-disable-next-line react/prop-types
  message,
  onChangeMessage,
}) {
  // if (!open) {
  //   return null;
  // }

  return <>
    {/* <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal">
          <div className="modal-header">
            <h2>Your Request</h2>
          </div>
          <div className="modal-body">
            {days.length > 0 ? <p>for days</p> : null}
            {days.map((day) => (
              <li key={day.day}>
                {day.day} - {day.month} - {day.year}
              </li>
            ))}
            <textarea
              value={message}
              onChange={onChangeMessage}
              placeholder="Add more info about your request..."
              required
            />
          </div>
          <div className="modal-footer">
            <button className="active-button" onClick={onSubmit}>Send request</button>
            <button className="close-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div> */}
    <div className={`modal ${open ? 'modal-open' : ''}`}>
    <Modal show={open} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Your request for days</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <ListGroup>
              {days.map((day, index) => <ListGroup.Item key={index}>{day.day}-{day.month}-{day.year}</ListGroup.Item>)}
            </ListGroup>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Additional info</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder='Add a note to your request...' onChange={onChangeMessage} value={message}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="dark" onClick={onSubmit}>
            Send request
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
  </>
}
