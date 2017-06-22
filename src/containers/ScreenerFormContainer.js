import React, {Component} from 'react';
import CheckboxOrRadioGroup from '../components/CheckboxOrRadioGroup';
import SingleInput from '../components/SingleInput';
import TextArea from '../components/TextArea';
import Select from '../components/Select';

class ScreenerFormContainer extends Component {
    constructor(props) {
        super(props);
        this.handleIsEnabledToggle = this.handleIsEnabledToggle.bind(this);
        this.handleFormClassName = this.handleFormClassName.bind(this);
        this.formContainerEnabledClassName = "container enabled_screener_form_container";
        this.formContainerDisabledClassName = "container disabled_screener_form_container";

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
