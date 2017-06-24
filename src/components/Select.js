import React from 'react';
import PropTypes from 'prop-types'
import OptionallyDisplayed from './OptionallyDisplayed'

class Select extends React.Component {

	constructor(props) {
		super(props);
		this.shouldDisplayError = this.shouldDisplayError.bind(this);
	}

	shouldDisplayError() {
		return this.props.showError && this.props.errorText !== "";
	}

	render() {
		return (
			<div className="form-group">
				<select
					value={this.props.selectedOption}
					onChange={this.props.controlFunc}
					name={this.props.name}
					className="form-select">
					<option>{this.props.placeholder}</option>
                    {this.props.options.map(option => {
                        return (
							<option
								key={option}
								value={option}>{option}</option>
                        );
                    })}
				</select>
				<OptionallyDisplayed display={this.shouldDisplayError()}>
					<div className="validation-error">
						<span className="text">{this.props.errorText}</span>
					</div>
				</OptionallyDisplayed>
			</div>
		)
	}
};

Select.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    selectedOption: PropTypes.string,
    controlFunc: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
	errorText: PropTypes.string,
	showError: PropTypes.bool
};

export default Select;