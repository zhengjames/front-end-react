import React, {Component} from 'react';
import SingleInput from '../components/SingleInput';
import Select from '../components/Select';
import ScreenerToggle from '../components/ScreenerToggle'

import ScreenerFormContainer from './ScreenerFormContainer';
import { connect } from 'react-redux'
import {updateMacd} from '../actions/stockTickersAction'
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
                <button
                    className='btn btn-link float-left'
                    onClick={this.handleClearForm}>Clear</button>
			</form>
		);
	}

    generateRequestJson() {
        var jsonRequest = {
            __type__: 'MACD_SCREENER',
        trigger_cause : this.state.triggerTypeSelected,
        trigger_direction : this.state.triggerDirectionSelected,
        trigger_in_n_days : this.state.triggerWithinDaysInput
    };

        logger.log('MACDFormContainer return json request ', jsonRequest);
    	return jsonRequest;
	}
}

export default MacdFormContainer;
