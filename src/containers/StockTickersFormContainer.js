import React, {Component} from 'react';
import TextArea from '../components/TextArea';

import ScreenerFormContainer from './ScreenerFormContainer'
import {connect} from 'react-redux'
import {updateTickers} from '../actions/stockTickersAction'
import logger from 'react-logger'
import OptionallyDisplayed from '../components/OptionallyDisplayed'

class StockTickersFormContainer extends ScreenerFormContainer {
	constructor(props) {
		super(props);
		this.formContainerDisabledClassName = "unsatisfied_screener_form_container";
        this.handleFormClassName = this.handleFormClassName.bind(this);
        console.log("constructor of stockTickerFormContainer tickerString is" + this.props.tickerString);
		this.state = {
			formContainerClassName: '',
		};
        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleFormClassName = this.handleFormClassName.bind(this);
        this.createUpdatePayloadAndDispatch = this.createUpdatePayloadAndDispatch.bind(this);
	}

    componentDidMount() {
        this.setState({
            formContainerClassName: (true == this.props.isValid) ?
                this.formContainerEnabledClassName : this.formContainerDisabledClassName
        });
    }


    handleTextInput(e) {
		//trim spaces
		var tickerStr = e.target.value;
        var isValid = false;
        //make sure input is csv valid like TSEM, or AZN, BMY
        if (tickerStr.match(/^([a-z0-9A-Z]+\s*(\s*,\s*[a-z0-9A-Z]+\s*)*|[a-z0-9A-Z]+\s*(\s*,\s*[a-z0-9A-Z]+\s*)*,\s*)$/)) {
        	isValid = true;
        }
        console.log('isValid: ', isValid);
		//call parent class to update ticker information and if is of valid format
		this.props.handleIsEnabledToggle({"isValid": isValid,
		"tickerString": e.target.value});
        this.createUpdatePayloadAndDispatch(tickerStr, isValid);
		this.handleFormClassName(isValid);
	}

    createUpdatePayloadAndDispatch(validTickerString, isValid) {
		var payload = {
			tickerString : validTickerString,
			isValid: isValid
		};
		this.props.dispatch(updateTickers(payload));
	}

	handleClearForm(e) {
		e.preventDefault();
		this.setState({
		});
	}

    handleFormClassName(isValid) {
		console.log("is valid is ", isValid);
        if (isValid) {
            this.state.formContainerClassName = this.formContainerEnabledClassName;
        } else {
            this.state.formContainerClassName = this.formContainerDisabledClassName;
        }
    }

	render() {
		return (
			<form className={this.state.formContainerClassName} onSubmit={this.handleFormSubmit}>
				<TextArea
					inputType={'text'}
					title={'Please enter stock tickers in comma separated format'}
					rows={5}
					resize={false}
					name={'tickers'}
					controlFunc={this.handleTextInput}
					placeholder={'AMZN, APPl, NVDA...'}
					content={this.props.tickerString}
				/>
				<OptionallyDisplayed display={this.props.showErrors && !this.props.isValid}>
					<div className="validation-error">
						<span className="text">{this.props.errorText}</span>
					</div>
				</OptionallyDisplayed>
			</form>
		);
	}

	generateRequestJson() {
		var jsonRequest = {
			tickers_arr :  this.props.tickerString.split(',')
		};
		logger.log('StickTickersFormContainer created json request', jsonRequest);
		return jsonRequest;
	}
}

export default connect( (store) => {
    return {
        isValid: store.ticker.isValid,
        tickerString: store.ticker.tickerString,
        showErrors: store.ticker.showErrors,
        errorText: store.ticker.errorText
    }
}) (StockTickersFormContainer);
