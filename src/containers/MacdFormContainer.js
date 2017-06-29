import React, {Component} from 'react';
import CheckboxOrRadioGroup from '../components/CheckboxOrRadioGroup';
import SingleInput from '../components/SingleInput';
import TextArea from '../components/TextArea';
import Select from '../components/Select';
import ScreenerToggle from '../components/ScreenerToggle'
import request from 'superagent'
import Toggle from 'react-toggle'
import ScreenerFormContainer from './ScreenerFormContainer';
import { connect } from 'react-redux'
import {updateMacd} from '../actions/stockTickersAction'
import update from 'immutability-helper'
import logger from 'react-logger'
import {run, ruleRunner, required, mustMatch, minLength, mustBeNumber} from '../validation/ruleRunner.js'

@connect( (store) => {
	return {
		isEnabled: store.macd.isEnabled,
		triggerTypeSelected: store.macd.triggerTypeSelected,
		triggerDirectionSelected: store.macd.triggerDirectionSelected,
		triggerWithinDaysInput: store.macd.triggerWithinDaysInput
	}
})

class MacdFormContainer extends ScreenerFormContainer {
	constructor(props) {
		super(props);
        this.fieldValidations = [
            ruleRunner("triggerTypeSelected", "triggerType", required),
            ruleRunner("triggerDirectionSelected", "triggerDirection", required),
            ruleRunner("triggerWithinDaysInput", "triggerWithinDays", required)
        ];
		this.varToDescMap = {};
		this.state = {
			triggerTypes: [],
			triggerTypeSelected: this.props.triggerTypeSelected,
			directions: [],
			tickers: '',
			tickersArr:[],
			triggerDirectionSelected: this.props.triggerDirectionSelected,
			triggerWithinDaysInput: this.props.triggerWithinDaysInput,
			triggerWithinDays: '',
			formContainerClassName : this.props.isEnabled ?
				this.formContainerEnabledClassName : this.formContainerDisabledClassName,
			showErrors: false,
			validationErrors: {}
		};
		this.placeHolderText = {
			'triggerTypeSelected' : 'Choose the type of trigger',
			'triggerDirectionSelected' : 'Choose the trigger direction',
			'triggerWithinDaysInput' : 'Enter number of days before triggered'
		};

		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleClearForm = this.handleClearForm.bind(this);
	}

	componentDidMount() {
		fetch('../resource/data/macd.json')
			.then(res => res.json())
			.then(data => {
				this.variables = data.variables;
				this.varToDescMap = data.varToDescMap;
				this.setState({
					triggerTypes: this.variables.triggerTypes,
					directions: this.variables.directions,
				});
                console.log(this.state.triggerTypes[0]);

            });
	}

	//setup payload of current states and update all at once in store
	createUpdatePayloadAndDispatch() {
		var payload = {
            isEnabled: this.state.isEnabled,
            triggerTypeSelected: this.state.triggerTypeSelected,
            triggerDirectionSelected: this.state.triggerDirectionSelected,
            triggerWithinDaysInput: this.state.triggerWithinDaysInput,
            validationErrors: this.state.validationErrors,
            showErrors: this.state.showErrors
		};

		logger.log('macd new payload to be dispatch ', payload);

		this.props.dispatch(updateMacd(payload));
	}

	handleClearForm(e) {
		e.preventDefault();
        console.log(document.querySelectorAll('div.react-tabs ul.react-tabs__tab-list li.react-tabs__tab'));

        this.setState({
			triggerTypeSelected: '',
			triggerDirectionSelected: '',
			triggerWithinDaysInput: '',
		}, () => this.createUpdatePayloadAndDispatch());
	}

	handleFormSubmit(e) {
        e.preventDefault();
        //if enabled then show error
		this.setState({showErrors: this.props.isEnabled});
		var validationError = run(this.state, this.fieldValidations);
		this.setState({validationErrors: validationError});
    }

	render() {
		return (
			<form className={this.state.formContainerClassName} onSubmit={this.handleFormSubmit}>
				<h5 className='screener_header'>MACD prediction screener</h5>

				<ScreenerToggle
					label='Screener'
					defaultChecked={this.props.isEnabled}
					controlFunc={this.handleIsEnabledToggle} />
				<Select
					name='triggerTypeSelected'
					placeholder={this.placeHolderText.triggerTypeSelected}
					title={'Trigger within the number of days?'}
					controlFunc={this.handleSelect}
					options={this.state.triggerTypes}
					selectedOption={this.props.triggerTypeSelected}
					errorText={this.errorFor('triggerTypeSelected')}
					showError={this.state.showErrors && this.props.isEnabled}
				/>
				<Select
					label={'Trigger direction'}
					name='triggerDirectionSelected'
					placeholder={this.placeHolderText.triggerDirectionSelected}
					controlFunc={this.handleSelect}
					options={this.state.directions}
					selectedOption={this.props.triggerDirectionSelected}
					errorText={this.errorFor('triggerDirectionSelected')}
					showError={this.state.showErrors && this.props.isEnabled}/>
				<SingleInput
					inputType={'number'}
					title={'Trigger within the number of days?'}
					name='triggerWithinDaysInput'
					controlFunc={this.handleSelect}
					content={this.props.triggerWithinDaysInput}
					placeholder={this.placeHolderText.triggerWithinDaysInput}
					errorText={this.errorFor('triggerWithinDaysInput')}
					showError={this.state.showErrors && this.props.isEnabled}/>
				<input
					type='submit'
					className='btn btn-primary float-right'
					onClick={this.handleFormSubmit}
					value='Submit'/>
                <button
                    className='btn btn-link float-left'
                    onClick={this.handleClearForm}>Clear</button>
			</form>
		);
	}
}

export default MacdFormContainer;
