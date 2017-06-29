import React from 'react';
import PropTypes from 'prop-types'
import OptionallyDisplayed from './OptionallyDisplayed'


class DisplayableSingleInput extends React.Component {
    constructor(props) {
        super(props);
        this.shouldDisplayError = this.shouldDisplayError.bind(this);
    }

    shouldDisplayError() {
        return this.props.showError && this.props.errorText !== "";
    }

    render() {
        return (this.props.display === true) ?
			<div className="form-group">
				<label className="form-label">{this.props.title}</label>
				<input
					className="form-input"
					name={this.props.name}
					type={this.props.inputType}
					value={this.props.content}
					onChange={this.props.controlFunc}
					placeholder={this.props.placeholder}/>
				<OptionallyDisplayed display={this.shouldDisplayError()}>
					<div className="validation-error">
						<span className="text">{this.props.errorText}</span>
					</div>
				</OptionallyDisplayed>
			</div> : null;
    };
}

DisplayableSingleInput.propTypes = {
    inputType: PropTypes.oneOf(['number', 'text']).isRequired,
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    controlFunc: PropTypes.func.isRequired,
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    placeholder: PropTypes.string,

};

export default DisplayableSingleInput;