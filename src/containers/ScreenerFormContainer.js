import React, {Component} from 'react';
import CheckboxOrRadioGroup from '../components/CheckboxOrRadioGroup';
import SingleInput from '../components/SingleInput';
import TextArea from '../components/TextArea';
import Select from '../components/Select';

class ScreenerFormContainer extends Component {
    constructor(props) {
        super(props);
        this.isOn = true;
        this.handleIsOnClick = this.handleIsOnClick.bind(this);
    }

    handleIsOnClick(e) {
        this.isOn = !this.isOn;
        console.log("Screener isOn is ", this.isOn)
    }
}

export default ScreenerFormContainer;
