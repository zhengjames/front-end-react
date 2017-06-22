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
				this.formContainerEnabledClassName : this.formContainerDisabledClassName
		};

		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleClearForm = this.handleClearForm.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
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

	//setup payload of current states and update all at once in store
	createUpdatePayloadAndDispatch() {
		var payload = {
            isEnabled: this.state.isEnabled,
            triggerTypeSelected: this.state.triggerTypeSelected,
            triggerDirectionSelected: this.state.triggerDirectionSelected,
            triggerWithinDaysInput: this.state.triggerWithinDaysInput
		};

		console.log('macd new payload to be dispatch ', payload);

		this.props.dispatch(updateMacd(payload))
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


        const formPayload = {
        	'tickers_arr': this.state.tickersArr,
			'screener_arr': [{
            '__type__': 'MACD',
            'trigger_cause': this.state.triggerTypeSelected,
            'trigger_direction': this.state.triggerDirectionSelected,
            'trigger_in_n_days': this.state.triggerWithinDays}]
        };

        console.log(JSON.stringify(formPayload));


        request.post('http://localhost:8070/screen')
            .set('Content-Type', 'application/json')
            .send(formPayload)

            .end(function(err, res) {
                if (err || !res.ok) {
                    console.log('response error');
                } else {
                    console.log(JSON.stringify(res.body));
                }
            });
    }

	render() {
		return (
			<form className={this.state.formContainerClassName} onSubmit={this.handleFormSubmit}>
				<h5 className='screener_header'>MACD prediction screener</h5>

				<ScreenerToggle
					label='Screener'
					defaultChecked={this.props.isEnabled}
					controlFunc={this.handleSelect} />
				<Select
					name='triggerTypeSelected'
					placeholder={'Choose the type of trigger'}
					title={'Trigger within the number of days?'}
					controlFunc={this.handleSelect}
					options={this.state.triggerTypes}
					selectedOption={this.props.triggerTypeSelected} />
				<Select
					label={'Trigger direction'}
					name='triggerDirectionSelected'
					placeholder={'Choose the trigger direction'}
					controlFunc={this.handleSelect}
					options={this.state.directions}
					selectedOption={this.props.triggerDirectionSelected} />
				<SingleInput
					inputType={'number'}
					title={'Trigger within the number of days?'}
					name='triggerWithinDaysInput'
					controlFunc={this.handleSelect}
					content={this.props.triggerWithinDaysInput}
					placeholder={'Enter number of days before triggered'} />

				<input
					type='submit'
					className='btn btn-primary float-right'
					value='Submit'/>
                <button
                    className='btn btn-link float-left'
                    onClick={this.handleClearForm}>Clear form</button>
			</form>
		);
	}
}

export default MacdFormContainer;
