import React, {Component} from 'react';
import CheckboxOrRadioGroup from '../components/CheckboxOrRadioGroup';
import SingleInput from '../components/SingleInput';
import TextArea from '../components/TextArea';
import Select from '../components/Select';
import '../react-toggle.css'
import request from 'superagent'
import ScreenerToggle from '../components/ScreenerToggle'
import ScreenerFormContainer from './ScreenerFormContainer'
class StochasticFormContainer extends ScreenerFormContainer {
	constructor(props) {
		super(props);
		this.varToDescMap = {};
		this.state = {
			isPredictiveScreening: null,
			screenerSubtypes: [],
			screenerSubtypeSelected: '',
            triggerTypes: [],
            triggerTypeSelected: '',
			directions: [],
			directionSelected: '',
			triggerWithinDays: [],
			triggerWithinDaysSelected: '',
		};

        this.handleTriggerPredictiveScreeningSelect = this.handleTriggerPredictiveScreeningSelect.bind(this);
        this.handleScreenerSubtypesSelect = this.handleScreenerSubtypesSelect.bind(this);
        this.handleDirectionsSelect = this.handleDirectionsSelect.bind(this);
        this.handleTriggerWithinDaysChange = this.handleTriggerWithinDaysChange.bind(this);
        this.handleTriggerTypesSelect = this.handleTriggerTypesSelect.bind(this);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
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
					screenerSubtypeSelected: '',
					// //fast cross slow?
                    triggerTypes: this.variables.triggerTypes,
					triggerTypeSelected: '',
					// //above, below, between?
					directions: this.variables.directions,
					directionSelected: '',
					// //days until triggered?
					triggerWithinDays: this.variables.triggerWithinDays,
					triggerWithinDaysSelected: this.variables.triggerWithinDays[0],
					// //is it on predict mode?
					predictiveScreeningSelected: this.variables.isPredictiveScreening
				});
                console.log(this.state.triggerTypes[0]);

            });
	}

    handleTriggerPredictiveScreeningSelect(e) {
        //just toggle between on and off
        // this.setState({predictiveScreeningSelected: !this.state.predictiveScreeningSelected});
    }
    handleScreenerSubtypesSelect(e) {
		this.setState({screenerSubtypeSelected: e.target.value}, () => console.log('screener subtype ', this.state.screenerSubtypeSelected));
    }
    handleTriggerTypesSelect(e) {
        this.setState({triggerTypeSelected: e.target.value}, () => console.log('trigger type selected', this.state.triggerTypeSelected));
    }
    handleDirectionsSelect(e) {
        this.setState({ directionSelected: e.target.value }, () => console.log('directions', this.state.directionSelected));
    }
    handleTriggerWithinDaysChange(e) {
        this.setState({triggerWithinDaysSelected: e.target.value}, () => console.log('trigger within n days', this.state.triggerWithinDaysSelected));
    }

	handleClearForm(e) {
		e.preventDefault();
		this.setState({
			triggerSubtypeSelected: this.variables.triggerTypes[0],
			directionSelected: this.variables.directions[0],
			triggerWithinDays: this.variables.triggerWithinDays[0],
			predictiveScreeningSelected: this.variables.isPredictiveScreening[0],

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
				<h5>Stochastic prediction screener</h5>
				<ScreenerToggle
					label="Screener"
					defaultChecked={this.props.isEnabled}
					controlFunc={this.handleIsEnabledToggle} />
				<Select
					name="stochastic type"
					placeholder='Choose the type of stochastic screener'
					options={this.state.screenerSubtypes}
					controlFunc={this.handleScreenerSubtypesSelect}/>
				<Select
					name={'trigger type'}
					placeholder={'Choose cause of trigger'}
					controlFunc={this.handleTriggerTypesSelect}
					options={this.state.triggerTypes}
					selectedOption={this.state.triggerTypeSelected} />

                <Select
					name={'direction'}
					placeholder={'Choose trigger direction'}
					controlFunc={this.handleDirectionsSelect}
					options={this.state.directions}
					selectedOption={this.state.directionSelected} />

                <SingleInput
					title={'Number of days before trigger'}
					inputType={'number'}
					name={'triggerWithinDays'}
					controlFunc={this.handleTriggerWithinDaysChange}
					content={this.state.triggerWithinDaysSelected}
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

export default StochasticFormContainer;
