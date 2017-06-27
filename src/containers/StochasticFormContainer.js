import React, {Component} from 'react';
import CheckboxOrRadioGroup from '../components/CheckboxOrRadioGroup';
import SingleInput from '../components/SingleInput';
import TextArea from '../components/TextArea';
import Select from '../components/Select';
import '../react-toggle.css'
import request from 'superagent'
import ScreenerToggle from '../components/ScreenerToggle'
import ScreenerFormContainer from './ScreenerFormContainer'
import {connect} from 'react-redux'
import {updateStochastic} from '../actions/stockTickersAction'
import {run, ruleRunner, required, mustMatch, minLength} from '../validation/ruleRunner.js'


const fieldValidations = [
    ruleRunner('screenerSubtypeSelected', 'Screener subtype', required),
    ruleRunner("triggerDirectionSelected", "Trigger direction", required),
    ruleRunner("triggerTypeSelected", "Trigger type selected", required)
];

@connect( (store) => {
    return {
        isEnabled: store.stochastic.isEnabled,
		screenerSubtypeSelected: store.stochastic.screenerSubtypeSelected,
        triggerTypeSelected: store.stochastic.triggerTypeSelected,
        triggerDirectionSelected: store.stochastic.triggerDirectionSelected,
        triggerWithinDaysSelected: store.stochastic.triggerWithinDaysSelected
    }
})
class StochasticFormContainer extends ScreenerFormContainer {
	constructor(props) {
		super(props);
		this.fieldValidations = [
            ruleRunner('screenerSubtypeSelected', 'Screener subtype', required),
            ruleRunner("triggerDirectionSelected", "Trigger direction", required),
            ruleRunner("triggerTypeSelected", "Trigger type selected", required)
        ];
        this.varToDescMap = {};
		this.state = {
			isPredictiveScreening: null,
			screenerSubtypes: [],
			screenerSubtypeSelected: this.props.screenerSubtypeSelected,
            triggerTypes: [],
            triggerTypeSelected: this.props.triggerTypeSelected,
			directions: [],
			triggerDirectionSelected: this.props.triggerDirectionSelected,
			triggerWithinDays: [],
			triggerWithinDaysSelected: '',
            formContainerClassName : this.props.isEnabled ?
                this.formContainerEnabledClassName : this.formContainerDisabledClassName,
            showErrors: false,
            validationErrors: {}
		};
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.placeHolderText = {
            'screenerSubtypeSelected' : 'Choose the type of stochastic screener',
			'triggerTypeSelected' : 'Choose cause of trigger',
			'triggerDirectionSelected' : 'Choose trigger direction'
		};
	}
	componentDidMount() {
		fetch('../resource/data/stochastic_rsi.json')
			.then(res => res.json())
			.then(data => {
				this.variables = data.variables;
				this.varToDescMap = data.varToDescMap;
				this.setState({
					//index 0 means default option
					//RSI or classic stochastic?
					screenerSubtypes: this.variables.screenerSubtypes,
					// //fast cross slow?
                    triggerTypes: this.variables.triggerTypes,
					// //above, below, between?
					directions: this.variables.directions,
					// //days until triggered?
					triggerWithinDays: this.variables.triggerWithinDays,
					triggerWithinDaysSelected: this.variables.triggerWithinDays[0],
					// //is it on predict mode?
					predictiveScreeningSelected: this.variables.isPredictiveScreening
				});

            });
	}

    createUpdatePayloadAndDispatch() {
        var payload = {
        	isEnabled: this.state.isEnabled,
            screenerSubtypeSelected: this.state.screenerSubtypeSelected,
            triggerTypeSelected: this.state.triggerTypeSelected,
            triggerDirectionSelected: this.state.triggerDirectionSelected,
			validationErrors: this.state.validationErrors,
			showErrors: this.state.showErrors
        };

        console.log("stochastic new payload to be dispatch ", payload);

        this.props.dispatch(updateStochastic(payload))
    }

	handleClearForm(e) {
		e.preventDefault();
		this.setState({
			screenerSubtypeSelected: '',
			triggerdirectionSelected: '',
			triggerTypeSelected: '',
			triggerWithinDaysSelected: '',
			predictiveScreeningSelected: ''

		}, () => this.createUpdatePayloadAndDispatch());
	}

    handleFormSubmit(e) {
        e.preventDefault();
        //if enabled then show error
        this.setState({showErrors: this.props.isEnabled});
        var validationError = run(this.state, fieldValidations);
        this.setState({validationErrors: validationError});
    }

	render() {
		return (
			<form className={this.state.formContainerClassName} onSubmit={this.handleFormSubmit}>
				<h5 className="screener_header">Stochastic prediction screener</h5>
				<ScreenerToggle
					label="Screener"
					defaultChecked={this.props.isEnabled}
					controlFunc={this.handleIsEnabledToggle} />
				<Select
					name='screenerSubtypeSelected'
					placeholder={this.placeHolderText.screenerSubtypeSelected}
					options={this.state.screenerSubtypes}
					controlFunc={this.handleSelect}
					selectedOption={this.props.screenerSubtypeSelected}
					errorText={this.errorFor('screenerSubtypeSelected')}
					showError={this.state.showErrors && this.props.isEnabled}

				/>
				<Select
					name='triggerTypeSelected'
					placeholder={this.placeHolderText.triggerTypeSelected}
					controlFunc={this.handleSelect}
					options={this.state.triggerTypes}
					selectedOption={this.props.triggerTypeSelected}
					errorText={this.errorFor('triggerTypeSelected')}
					showError={this.state.showErrors}
				/>

                <Select
					name='triggerDirectionSelected'
					placeholder={this.placeHolderText.triggerDirectionSelected}
					controlFunc={this.handleSelect}
					options={this.state.directions}
					selectedOption={this.props.triggerDirectionSelected}
					errorText={this.errorFor('triggerDirectionSelected')}
					showError={this.state.showErrors}
				/>

                {/*<SingleInput*/}
					{/*title={'Number of days before trigger'}*/}
					{/*inputType={'number'}*/}
					{/*name={'triggerWithinDays'}*/}
					{/*controlFunc={this.handleTriggerWithinDaysChange}*/}
					{/*content={this.state.triggerWithinDaysSelected}*/}
					{/*placeholder={'Enter number of days before triggered'} />*/}

                <button
                    className="btn btn-link float-left"
                    onClick={this.handleClearForm}>Clear</button>
			</form>
		);
	}
}

export default StochasticFormContainer;
