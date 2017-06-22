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
import update from 'immutability-helper'



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
                this.formContainerEnabledClassName : this.formContainerDisabledClassName
		};
        this.handleSelect = this.handleSelect.bind(this);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.createUpdatePayloadAndDispatch = this.createUpdatePayloadAndDispatch.bind(this);
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

    /*
    	Handle when user select one of the options
    */
	handleSelect(e) {
		var newState = update(this.state, {
				[e.target.name] : {$set: e.target.value}
		});
		this.setState(newState,
			() => this.createUpdatePayloadAndDispatch());

	}

    createUpdatePayloadAndDispatch() {
        var payload = {
            screenerSubtypeSelected: this.state.screenerSubtypeSelected,
            triggerTypeSelected: this.state.triggerTypeSelected,
            triggerDirectionSelected: this.state.triggerDirectionSelected
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


        const formPayload = {
        	"tickers_arr": this.state.tickersArr,
			"screener_arr": [{
            "__type__": "MACD",
            "trigger_cause": this.state.triggerTypeSelected,
            "trigger_direction": this.state.triggerDirectionSelected,
            "trigger_in_n_days": this.state.triggerWithinDays}]
        };

        console.log(JSON.stringify(formPayload));


        request.post('http://localhost:8070/screen')
            .set('Content-Type', 'application/json')
            .send(formPayload)

            .end(function(err, res) {
                if (err || !res.ok) {
                    console.log("response error");
                } else {
                    console.log(JSON.stringify(res.body));
                }
            });
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
					placeholder='Choose the type of stochastic screener'
					options={this.state.screenerSubtypes}
					controlFunc={this.handleSelect}
					selectedOption={this.props.screenerSubtypeSelected}
				/>
				<Select
					name='triggerTypeSelected'
					placeholder={'Choose cause of trigger'}
					controlFunc={this.handleSelect}
					options={this.state.triggerTypes}
					selectedOption={this.props.triggerTypeSelected} />

                <Select
					name='triggerDirectionSelected'
					placeholder={'Choose trigger direction'}
					controlFunc={this.handleSelect}
					options={this.state.directions}
					selectedOption={this.props.triggerDirectionSelected} />

                {/*<SingleInput*/}
					{/*title={'Number of days before trigger'}*/}
					{/*inputType={'number'}*/}
					{/*name={'triggerWithinDays'}*/}
					{/*controlFunc={this.handleTriggerWithinDaysChange}*/}
					{/*content={this.state.triggerWithinDaysSelected}*/}
					{/*placeholder={'Enter number of days before triggered'} />*/}

                <input
					type="submit"
					className="btn btn-primary float-right"
					value="Submit"/>
                <button
                    className="btn btn-link float-left"
                    onClick={this.handleClearForm}>Clear form</button>
			</form>
		);
	}
}

export default StochasticFormContainer;
