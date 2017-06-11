import React, {Component} from 'react';
import CheckboxOrRadioGroup from '../components/CheckboxOrRadioGroup';
import SingleInput from '../components/SingleInput';
import TextArea from '../components/TextArea';
import Select from '../components/Select';
import ScreenerToggle from '../components/ScreenerToggle'
import request from 'superagent'
import Toggle from 'react-toggle'
import ScreenerFormContainer from './ScreenerFormContainer';
class MacdFormContainer extends ScreenerFormContainer {
	constructor(props) {
		super(props);
		this.varToDescMap = {};
		this.state = {
			triggerTypes: [],
			triggerTypeSelected: '',
			directions: [],
			tickers: '',
			tickersArr:[],
			directionSelected: '',
			triggerWithinDays: 10,
		};
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleClearForm = this.handleClearForm.bind(this);
		this.handleTriggerTypeSelect = this.handleTriggerTypeSelect.bind(this);
		this.handleDirectionSelection = this.handleDirectionSelection.bind(this);
        this.handleTriggerWithinDaysChange = this.handleTriggerWithinDaysChange.bind(this);
        this.handleTextInput = this.handleTextInput.bind(this);

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

    handleTriggerTypeSelect(e) {
        this.setState({ triggerTypeSelected: e.target.value }, () => console.log('trigger type', this.state.triggerTypeSelected));
    }
	handleDirectionSelection(e) {
		this.setState({ directionSelected: e.target.value }, () => console.log('directions', this.state.directionSelected));
	}
	handleTriggerWithinDaysChange(e) {
        this.setState({triggerWithinDays: e.target.value}, () => console.log('trigger within n days', this.state.triggerWithinDays));
    }
    handleTextInput(e) {
        this.setState({tickers: e.target.value}, () => console.log('text input', this.state.tickers));
        const textArray = e.target.value.split(', ');

        console.log(textArray);
        this.setState({tickersArr: textArray}, () => console.log('tickers array', this.state.tickersArr));
	}

	handleClearForm(e) {
		e.preventDefault();
		this.setState({
			triggerTypeSelected: this.variables.triggerTypes[0],
			directionSelected: this.variables.directions[0],
			triggerWithinDays: this.variables.triggerWithinDays,
		});
	}

	handleFormSubmit(e) {
        e.preventDefault();


        const formPayload = {
        	"tickers_arr": this.state.tickersArr,
			"screener_arr": [{
            "__type__": "MACD",
            "trigger_cause": this.state.triggerTypeSelected,
            "trigger_direction": this.state.directionSelected,
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
			<form className="container" onSubmit={this.handleFormSubmit}>
				<h5>MACD prediction screener</h5>

				<ScreenerToggle
					label="Screener"
					defaultChecked={this.isOn}
					controlFunc={this.handleIsOnClick} />
				<Select
					name={'trigger type'}
					placeholder={'Choose the type of trigger'}
					title={'Trigger within the number of days?'}
					controlFunc={this.handleTriggerTypeSelect}
					options={this.state.triggerTypes}
					selectedOption={this.state.triggerTypeSelected} />
				<Select
					label={'Trigger direction'}
					name={'direction'}
					placeholder={'Choose the trigger direction'}
					controlFunc={this.handleDirectionSelection}
					options={this.state.directions}
					selectedOption={this.state.directionSelected} />
				<SingleInput
					inputType={'number'}
					title={'Trigger within the number of days?'}
					name={'triggerWithinDays'}
					controlFunc={this.handleTriggerWithinDaysChange}
					content={this.state.triggerWithinDays}
					placeholder={'Enter number of days before triggered'} />

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

export default MacdFormContainer;