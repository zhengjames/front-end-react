import React, {Component} from 'react';
import Select from '../components/Select';
import '../react-toggle.css'
import request from 'superagent'
import ScreenerToggle from '../components/ScreenerToggle'
import ScreenerFormContainer from './ScreenerFormContainer'
import {connect} from 'react-redux'
import {updateStochastic} from '../actions/stockTickersAction'
import {run, ruleRunner, required, mustMatch, minLength, between0and100} from '../validation/ruleRunner.js'
import DisplayableSingleInput from "../components/DisplayableSingleInput";
import logger from 'react-logger';


@connect( (store) => {
    return {
        isEnabled: store.stochastic.isEnabled,
		screenerSubtypeSelected: store.stochastic.screenerSubtypeSelected,
        triggerTypeSelected: store.stochastic.triggerTypeSelected,
        triggerDirectionSelected: store.stochastic.triggerDirectionSelected,
        triggerWithinDaysSelected: store.stochastic.triggerWithinDaysSelected,
		triggerTarget: store.stochastic.triggerTarget,
		triggerLowerBound: store.stochastic.triggerLowerBound,
		triggerUpperBound: store.stochastic.triggerUpperBound
    }
})
class StochasticFormContainer extends ScreenerFormContainer {
	constructor(props) {
		super(props);
		this.fieldValidations = [
            ruleRunner('screenerSubtypeSelected', 'Screener subtype', required),
            ruleRunner("triggerDirectionSelected", "Trigger direction", required),
            ruleRunner("triggerTypeSelected", "Trigger type selected", required),
            ruleRunner("triggerLowerBound", "Lower Bound", required, between0and100),
            ruleRunner("triggerUpperBound", "Upper Bound", required, between0and100)

        ];
        this.varToDescMap = {};
		this.state = {
			//feature is currently off
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
			//flags wether upper and lower bound should be displayed both at once
            triggerDirectionIsBetween: false,
			triggerTarget: this.props.triggerTarget,
			triggerUpperBound: this.props.triggerUpperBound,
			triggerLowerBound: this.props.triggerLowerBound,

			//when user enters wrong input this will contain errors
            validationErrors: {},
		};
        this.handleClearForm = this.handleClearForm.bind(this);
        this.shouldDisplayTwoBounds = this.shouldDisplayTwoBounds(this);
        this.placeHolderText = {
            'screenerSubtypeSelected' : 'Choose the type of stochastic screener',
			'triggerTypeSelected' : 'Choose cause of trigger',
			'triggerDirectionSelected' : 'Choose trigger direction'
		};
	}
	componentDidMount() {
        //setup the drop down options to be displayed
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

					// //is it on predict mode? feature currently OFF
					predictiveScreeningSelected: this.variables.isPredictiveScreening,
                    triggerWithinDaysSelected: this.variables.triggerWithinDays[0],
				});

            });
	}

	//will be called by parent
    createUpdatePayloadAndDispatch() {
        var payload = {
        	isEnabled: this.state.isEnabled,
            screenerSubtypeSelected: this.state.screenerSubtypeSelected,
            triggerTypeSelected: this.state.triggerTypeSelected,
            triggerDirectionSelected: this.state.triggerDirectionSelected,
			triggerUpperBound : this.state.triggerUpperBound,
			triggerLowerBound : this.state.triggerLowerBound,
			triggerTarget : this.state.triggerTarget,
			validationErrors: this.state.validationErrors,
			showErrors: this.state.showErrors
        };

        console.log("stochastic new payload to be dispatch ", payload);

        this.props.dispatch(updateStochastic(payload))
    }

    shouldDisplayTwoBounds() {
		return this.state.triggerDirectionSelected == 'BETWEEN';
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
				<DisplayableSingleInput
					title={'Enter bound, 0 to 100'}
					inputType={'number'}
					name={'triggerTarget'}
					controlFunc={this.handleSelect}
					content={this.state.triggerTarget}
					showError={this.state.showErrors}
					display={this.state.triggerDirectionSelected == 'ABOVE'
					|| this.state.triggerDirectionSelected == 'BELOW'}
					errorText={(this.state.triggerDirectionSelected == 'ABOVE'
                    || this.state.triggerDirectionSelected == 'BELOW') ?
						this.errorFor('triggerTarget') : null }
				/>
				<DisplayableSingleInput
					title={'Enter lower bound 0 to 100'}
					inputType={'number'}
					name={'triggerLowerBound'}
					controlFunc={this.handleSelect}
					content={this.state.triggerLowerBound}
					showError={this.state.showErrors}
					display={this.state.triggerDirectionSelected == 'BETWEEN'}
					errorText={(this.state.triggerDirectionSelected == 'BETWEEN') ?
						this.errorFor('triggerLowerBound') : null}

				/>
                <DisplayableSingleInput
					title={'Enter upper bound 0 to 100'}
					inputType={'number'}
					name={'triggerUpperBound'}
					controlFunc={this.handleSelect}
					content={this.state.triggerUpperBound}
					showError={this.state.showErrors}
					display={this.state.triggerDirectionSelected == 'BETWEEN'}
					errorText={this.state.triggerDirectionSelected == 'BETWEEN' ?
						this.errorFor('triggerUpperBound') : null}

				/>

                <button
                    className="btn btn-link float-left"
                    onClick={this.handleClearForm}>Clear</button>
			</form>
		);
	}

	generateRequestJson() {
		var jsonRequest = {
            __type__: 'STOCHASTIC_OSCILLATOR',
            __subtype__: this.state.screenerSubtypeSelected,
            trigger_cause: this.state.triggerTypeSelected
        }
		if (this.state.triggerDirectionIsBetween) {
            jsonRequest['upper_bound'] = this.state.triggerUpperBound;
            jsonRequest['lower_bound'] = this.state.triggerLowerBound;
        } else {
			jsonRequest['trigger_target'] = this.state.triggerTarget;
		}
		jsonRequest['trigger_direction'] = this.state.triggerDirectionSelected;

		logger.log('StochasticFormContainer created json request', jsonRequest);
		return jsonRequest;
	}
}

export default StochasticFormContainer;
