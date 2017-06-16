import React, {Component} from 'react';
import CheckboxOrRadioGroup from '../components/CheckboxOrRadioGroup';
import SingleInput from '../components/SingleInput';
import TextArea from '../components/TextArea';
import Select from '../components/Select';
import request from 'superagent'
import Toggle from 'react-toggle'
import ScreenerFormContainer from './ScreenerFormContainer'

class StockTickersFormContainer extends ScreenerFormContainer {
	constructor(props) {
		super(props);
		this.formContainerDisabledClassName = "container unsatisfied_screener_form_container";
        this.handleFormClassName = this.handleFormClassName.bind(this);
		this.state = {
			stockTickers:'',
			tickerArr:[],
            formContainerClassName : this.formContainerDisabledClassName
		};

        this.handleTextInput = this.handleTextInput.bind(this);

	}


    handleTextInput(e) {
		this.state.stockTickers = e.target.value;
        console.log('text input: ', this.state.stockTickers);
        this.state.stockTickers = this.state.stockTickers.replace(/\s+/g, '');
        var isValid = false;
        if (this.state.stockTickers.match(/^[a-z]+(,[a-z]+)*$/)) {
        	isValid = true;
            console.log('isValid: ', isValid);
		}
		this.props.handleIsEnabledToggle(isValid);
		this.handleFormClassName(isValid);
	}

	handleClearForm(e) {
		e.preventDefault();
		this.setState({
		});
	}

    handleFormClassName(isEnabled) {
        if (isEnabled) {
            this.state.formContainerClassName = this.formContainerEnabledClassName;
        } else {
            this.state.formContainerClassName = this.formContainerDisabledClassName;
        }
    }

	render() {
		return (
			<form className={this.state.formContainerClassName} onSubmit={this.handleFormSubmit}>
				<h5>Please enter stock tickers in comma separated format</h5>
				<TextArea
					inputType={'text'}
					title={'Please enter stock tickers in comma separated format'}
					rows={5}
					resize={false}
					name={'tickers'}
					controlFunc={this.handleTextInput}
					placeholder={'AMZ, APPl, NVDA...'} />
			</form>
		);
	}
}

export default StockTickersFormContainer;
