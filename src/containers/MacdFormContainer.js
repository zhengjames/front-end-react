import React, {Component} from 'react';
import SingleInput from '../components/SingleInput';
import Select from '../components/Select';
import ScreenerToggle from '../components/ScreenerToggle'

import ScreenerFormContainer from './ScreenerFormContainer';
import { connect } from 'react-redux'
import {updateMacd, updateMacdErrorValidation, updateToDefaultFormSettings} from '../actions/stockTickersAction'
import logger from 'react-logger'
import {run, ruleRunner, required, mustMatch, minLength, mustBeNumber} from '../validation/ruleRunner.js'
import dataJson from '../resource/data/macd.json'

class MacdFormContainer extends ScreenerFormContainer {
	constructor(props) {
		logger.log('constructing MacdFormContainer');
		super(props);
		this.varToDescMap = {};
		this.state = {
			triggerTypes: [],
			directions: [],
			tickers: '',
			tickersArr:[],
			triggerWithinDays: '',
			formContainerClassName : this.props.isEnabled ?
				this.formContainerEnabledClassName : this.formContainerDisabledClassName,
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
        this.setState({
            triggerTypes: dataJson.variables.triggerTypes,
            directions: dataJson.variables.directions,
        });
    }

	//setup payload of current states and update all at once in store
	createUpdatePayloadAndDispatch(payload) {
		logger.log('macd new payload to be dispatch ', payload);

		this.props.dispatch(updateMacd(payload));

        var newMacdValidationErrors = {validationErrors:
            run(payload, this.props.myStore.fieldValidations),
			showErrors: this.props.showErrors};

        this.props.dispatch(updateMacdErrorValidation(newMacdValidationErrors))
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
				<div className='screener_header'>MACD prediction screener</div>

				<ScreenerToggle
					label='Screener'
					controlFunc={this.handleIsEnabledToggle}
					checked={this.props.isEnabled}
				/>

				<Select
					name='triggerTypeSelected'
					placeholder={this.placeHolderText.triggerTypeSelected}
					title={'Trigger within the number of days?'}
					controlFunc={this.handleSelect}
					options={this.state.triggerTypes}
					selectedOption={this.props.triggerTypeSelected}
					errorText={this.props.validationErrors.triggerTypeSelected}
					showError={this.props.showErrors && this.props.isEnabled}
				/>
				<Select
					label={'Trigger direction'}
					name='triggerDirectionSelected'
					placeholder={this.placeHolderText.triggerDirectionSelected}
					controlFunc={this.handleSelect}
					options={this.state.directions}
					selectedOption={this.props.triggerDirectionSelected}
					errorText={this.errorFor('triggerDirectionSelected')}
					showError={this.props.showErrors && this.props.isEnabled}/>
				<SingleInput
					inputType={'number'}
					title={'Trigger within the number of days?'}
					name='triggerWithinDaysInput'
					controlFunc={this.handleSelect}
					content={this.props.triggerWithinDaysInput}
					placeholder={this.placeHolderText.triggerWithinDaysInput}
					errorText={this.errorFor('triggerWithinDaysInput')}
					showError={this.props.showErrors && this.props.isEnabled}/>
                <button
                    className='btn btn-link'
                    onClick={this.handleClearForm}>Clear</button>

				<button
					className='btn btn-link float-right'
					onClick={this.setDefaultSettings}
				> Default</button>
			</form>
		);
	}

    generateRequestJson() {
        var jsonRequest = {
            __type__: 'MACD_SCREENER',
        trigger_cause : this.props.triggerTypeSelected,
        trigger_direction : this.props.triggerDirectionSelected,
        trigger_in_n_days : this.props.triggerWithinDaysInput
    };

        logger.log('MACDFormContainer return json request ', jsonRequest);
    	return jsonRequest;
	}
}

export default connect( (store) => {
    return {
        myStore: store.macd,
        isEnabled: store.macd.isEnabled,
        triggerTypeSelected: store.macd.triggerTypeSelected,
        triggerDirectionSelected: store.macd.triggerDirectionSelected,
        triggerWithinDaysInput: store.macd.triggerWithinDaysInput,
        showErrors: store.macd.showErrors,
        validationErrors: store.macd.validationErrors

    }
}) (MacdFormContainer)
