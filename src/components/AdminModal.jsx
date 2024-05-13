/* eslint-disable react/prop-types */
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

export default function AdminModal({
  open,
  decision,
  onApprove,
  onDecline,
  message,
  onChangeMessage,
}) {
  if (!open) {
    return null;
  }

  return (
    <>
      {/* <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal">
            <div className="modal-header">
              {decision ? <h2>Refusal</h2> : <h2>Approval</h2>}
              <p>
                Are you sure you want to{" "}
                {decision ? "refuse and delete" : "approve"} this request ?
              </p>
            </div>
            <div className="modal-body">
              {decision && (
                <textarea
                  value={message}
                  onChange={onChangeMessage}
                  placeholder={
                    !decision
                      ? "Add more info about your request..."
                      : "Your reason for denial of the request..."
                  }
                />
              )}
            </div>
            <div className="modal-footer">
              <button className="active-button" onClick={onApprove}>
                Yes
              </button>
              <button className="close-button" onClick={onDecline}>
                No
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <Modal show={open} onHide={onDecline}>
        <Modal.Header closeButton>
          <Modal.Title>{decision ? <h1>Refusal</h1> : <h1>Approval</h1>}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Modal.Body>
          <h2>Are you sure you want to{" "}
                {decision ? "refuse and delete" : "approve"} this request ?</h2>
        </Modal.Body>
        {decision && (
          <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Additional info</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder='Type your reason for denial of this request...' onChange={onChangeMessage} value={message}/>
            </Form.Group>                
              )}
            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onDecline}>
            No
          </Button>
          <Button variant="dark" onClick={onApprove}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
