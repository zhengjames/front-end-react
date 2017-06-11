import React, {Component} from 'react';
import CheckboxOrRadioGroup from '../components/CheckboxOrRadioGroup';
import SingleInput from '../components/SingleInput';
import TextArea from '../components/TextArea';
import Select from '../components/Select';

class ScreenerFormContainer extends Component {
    constructor(props) {
        super(props);
        this.handleIsOnClick = this.handleIsOnClick.bind(this);
    }

    //calls parent class function
    handleIsOnClick(e) {
        this.props.handleIsOnToggle(!this.props.isOn);
        console.log("Screener isOn is ", this.props.isOn)
    }
}

export default ScreenerFormContainer;
