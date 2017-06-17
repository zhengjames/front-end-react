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
        console.log("constructor of stockTickerFormContainer tickerString is" + this.props.tickerString)
		this.state = {
			tickerStr:this.props.tickerString,
			tickerArr:[],
			isValid:this.props.isEnabled,
		};


        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleFormClassName = this.handleFormClassName.bind(this);
        //update the css class for container based on previous results
        this.handleFormClassName();
	}


    handleTextInput(e) {
		this.state.tickerStr = e.target.value;
		//trim spaces
        this.state.tickerStr = this.state.tickerStr.replace(/\s+/g, '');
        if (this.state.tickerStr.match(/^[a-z]+(,[a-z]+)*$/)) {
        	this.state.isValid = true;
            console.log('isValid: ', this.state.isValid);
		}
		//call parent class to update ticker information and if is of valid format
		this.props.handleIsEnabledToggle({"isValid":this.state.isValid,
		"tickerString": this.state.tickerStr});
		this.handleFormClassName();
	}

	handleClearForm(e) {
		e.preventDefault();
		this.setState({
		});
	}

    handleFormClassName() {
		console.log("is valid is ", this.state.isValid)
        if (this.state.isValid) {
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
					placeholder={'AMZ, APPl, NVDA...'}
					content={this.state.tickerStr}
				/>
			</form>
		);
	}
}

export default StockTickersFormContainer;
