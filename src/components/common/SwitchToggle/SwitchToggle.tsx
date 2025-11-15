import Form from "react-bootstrap/Form";
import "./SwitchToggle.scss";

const SwitchToggle = ({
  label,
  className,
  onClick,
}: {
  label?: string | number;
  className?: string;
  onClick?: any;
}) => {
  return (
    <Form.Check
      className={`switch ${className || ""}`}
      type="switch"
      id="custom-switch"
      label={label}
      onClick={onClick}
    />
  );
};

export default SwitchToggle;
