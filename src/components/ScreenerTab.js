/**
 * Created by jzheng on 6/11/17.
 */
import Tab from 'react-tabs'
class ScreenerTab {
    constructor(props) {
        this.state.isOn = props.isOn;

        this.handleIsOnToggle = this.handleIsOnToggle.bind(this);

    }

    componentDidMount() {
        this.setState(
            {isOn: true}
        );
    }

    handleIsOnToggle(e) {
        this.state.isOn = !this.state.isOn;
        if (this.state.isOn) {

        }
        console.log("ScreenerTab state isOn ", this.state.isOn);
    }


}


export default ScreenerTab;