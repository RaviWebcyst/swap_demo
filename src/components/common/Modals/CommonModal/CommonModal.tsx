import { Modal } from "react-bootstrap";
import "./CommonModal.scss";
import { ReactNode } from "react";

interface propTypes {
  show?: boolean;
  className?: string;
  handleClose?: () => void;
  heading?: string;
  hideCloseButton?: boolean;
  children?: ReactNode;
  status?: string;
  footer?: ReactNode | undefined;
}

const CommonModal = (props: propTypes) => {
  return (
    <>
      <Modal
        className={`custom_modal ${props.className || ""}`}
        centered
        backdrop={
          props?.className == "select_token_modal" ? undefined : "static"
        }
        show={props.show}
        onHide={props.handleClose}
      >
        {props.heading && (
          <Modal.Header
            closeButton={
              props?.status != "in-progress" ? !props.hideCloseButton : false
            }
          >
            <Modal.Title>{props.heading}</Modal.Title>
          </Modal.Header>
        )}
        <Modal.Body>{props.children}</Modal.Body>
         {props.footer && (
          <Modal.Footer className="d-flex justify-content-center">
           { props.footer }
          </Modal.Footer> 
        )}
      </Modal>
    </>
  );
};

export default CommonModal;
