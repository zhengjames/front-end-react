import React, {Component} from 'react';
import update from 'immutability-helper'
import {run, ruleRunner, required, mustMatch, minLength} from '../validation/ruleRunner.js'


class ScreenerFormContainer extends Component {
    constructor(props) {
        super(props);
        this.handleIsEnabledToggle = this.handleIsEnabledToggle.bind(this);
        this.handleFormClassName = this.handleFormClassName.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.errorFor = this.errorFor.bind(this);
        this.formContainerEnabledClassName = "container enabled_screener_form_container";
        this.formContainerDisabledClassName = "container disabled_screener_form_container";

    }

    /*
     Handle when user select one of the options
     */
    handleSelect(e) {
        var targetValue = e.target.value;
        //target.name is the variable of selected option
        var targetName = e.target.name;
        //if it is placeholder set variable to ''
        if(targetValue == this.placeHolderText[targetName]) {
            targetValue = '';
        }
        var newState = update(this.state, {
            [targetName] : {$set: targetValue}
        });
        this.setState(newState,
            () => {
                this.createUpdatePayloadAndDispatch();
                this.state.validationErrors = run(this.state, this.fieldValidations);
            });
    }

    errorFor(field) {
        return this.state.validationErrors[field] || "";
    }

    //calls parent class function
    handleIsEnabledToggle(e) {
        //on change flips boolean
        this.props.handleIsEnabledToggle(!this.props.isEnabled);
        console.log("Screener isEnabled is ", this.props.isEnabled);
        this.handleFormClassName(!this.props.isEnabled);
    }

    handleFormClassName(isEnabled) {
        if (isEnabled) {
            this.state.formContainerClassName = this.formContainerEnabledClassName;
        } else {
            this.state.formContainerClassName = this.formContainerDisabledClassName;
        }
    }
}

export default ScreenerFormContainer;
