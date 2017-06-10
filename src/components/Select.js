import React from 'react';
import PropTypes from 'prop-types'

const Select = (props) => (
	<div className="form-group">
		<select
			value={props.selectedOption}
			onChange={props.controlFunc}
			className="form-select">
			<option>{props.placeholder}</option>
            {props.options.map(option => {
                return (
					<option
						key={option}
						value={option}>{option}</option>
                );
            })}
		</select>
	</div>
);

Select.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    selectedOption: PropTypes.string,
    controlFunc: PropTypes.func.isRequired,
    placeholder: PropTypes.string
};

export default Select;