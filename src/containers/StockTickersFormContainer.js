import React, {Component} from 'react';
import CheckboxOrRadioGroup from '../components/CheckboxOrRadioGroup';
import SingleInput from '../components/SingleInput';
import TextArea from '../components/TextArea';
import Select from '../components/Select';
import request from 'superagent'
import Toggle from 'react-toggle'
import ScreenerFormContainer from './ScreenerFormContainer'
import {connect} from 'react-redux'

@connect( (store) => {
    return {
        isValid: store.ticker.isValid,
        tickerString: store.ticker.tickerString,
    }
})
class StockTickersFormContainer extends ScreenerFormContainer {
	constructor(props) {
		super(props);
		this.formContainerDisabledClassName = "container unsatisfied_screener_form_container";
        this.handleFormClassName = this.handleFormClassName.bind(this);
        console.log("constructor of stockTickerFormContainer tickerString is" + this.props.tickerString)
		this.state = {
			formContainerClassName: ''
		};
        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleFormClassName = this.handleFormClassName.bind(this);
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
        if (tickerStr.match(/^([a-z0-9A-Z]+\s*(\s*,\s*[a-z0-9A-Z]+\s*)*|[a-z0-9A-Z]+\s*(\s*,\s*[a-z0-9A-Z]+\s*)*,)$/)) {
        	isValid = true;
		}
        console.log('isValid: ', isValid);
		//call parent class to update ticker information and if is of valid format
		this.props.handleIsEnabledToggle({"isValid": isValid,
		"tickerString": e.target.value});
		this.handleFormClassName(isValid);
	}

	handleClearForm(e) {
		e.preventDefault();
		this.setState({
		});
	}

    handleFormClassName(isValid) {
		console.log("is valid is ", isValid)
        if (isValid) {
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
					content={this.props.tickerString}
				/>
			</form>
		);
	}
}

export default StockTickersFormContainer;
