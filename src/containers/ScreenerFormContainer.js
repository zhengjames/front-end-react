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
        this.generateRequestJson = this.generateRequestJson.bind(this);
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
        var newState = update(this.props, {
            [targetName] : {$set: targetValue}
        });

        this.createUpdatePayloadAndDispatch({[targetName]:targetValue});
    }

    errorFor(field) {
        if (this.props.validationErrors == undefined || field == '' || this.props.validationErrors[field] == undefined) {
            return "";
        }

        return this.props.validationErrors[field];
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

    generateRequestJson(){};
}

export default ScreenerFormContainer;
