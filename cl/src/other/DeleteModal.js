
import Modal from "../error/Modal";
import Button from "./Button";
import classes from "./DeleteModal.module.css";
const DeleteModal = (props) => {
    return  <Modal
    onCancel={props.onClear}
    header={`${props.heading}`}
    show={true}
    footer={<div className={classes.buttons}><Button onClick={props.onClick}>Yes</Button> <Button onClick={props.onClose}>Cancel</Button></div>}
    >
    <p>{props.error}</p>
  </Modal>
};

export default DeleteModal;