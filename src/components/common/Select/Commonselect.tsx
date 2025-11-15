import { Form } from 'react-bootstrap';
import './Commonselect.scss';
import Select from 'react-select';

const Commonselect = (
    { className, label, reactSelectClassName, placeholder, defaultValue, onChange, options, menuIsOpen, isSearchable }: any
) => {
    return (
        <>
            <Form.Group className={`common_select ${className} `}>
                {label && <Form.Label>{label}</Form.Label>}
                <div className="common_select_inner">
                    <Select
                        classNamePrefix="react-select"
                        className={`react-select ${reactSelectClassName}`}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        onChange={onChange}
                        options={options}
                        menuIsOpen={menuIsOpen}
                        isSearchable={!isSearchable}
                    />
                </div>
            </Form.Group>
        </>
    )
}

export default Commonselect