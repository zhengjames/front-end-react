import React, { Component } from 'react';
import PropTypes from 'prop-types'
import '../node_modules/spectre.css/dist/spectre.min.css';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
import 'react-tabs/style/react-tabs.css';
require('./styles.css');
import FormContainer from './containers/ScreenerFormContainer';
import MacdFormContainer from './containers/MacdFormContainer.js'
import StochasticFormContainer from './containers/StochasticFormContainer.js'
import ScreenerTab from './components/ScreenerTab'



class App extends Component {

    constructor(props) {
        super(props)
        //used to control cross component communications
        // if (this.state.stochasticEnabled) {
        //     this.state.stochasticTabClassNames = ["react-tabs__tab", "screener-tab_is_on"];
        // }
        this.notEnabledLabelClasses = ["react-tabs__tab"];
        this.enabledLabelClasses = ["react-tabs__tab", "screener-tab_is_on"];
        this.handleMacdIsOnToggle = this.handleMacdIsOnToggle.bind(this);
        this.state = {
            macdEnabled : true,
            stochasticEnabled : true,
            macdTabClassNames: this.enabledLabelClasses,
        }
    }

    render() {
        return (
            <div>
                <h1>React Tabs</h1>
                <p>
                    <a href="https://github.com/reactjs/react-tabs/blob/gh-pages/example/main.js">Demo Source</a>
                </p>

                <Tabs>
                    <TabList>
                        <Tab className={this.state.macdTabClassNames}>MACD</Tab>
                        <Tab>Stochastic RSI</Tab>
                    </TabList>
                    <TabPanel>
                    <div id="macd_tab_content">
                        <MacdFormContainer
                            isOn={this.state.macdEnabled}
                            handleIsOnToggle={this.handleMacdIsOnToggle}
                        />
                    </div>
                    </TabPanel>
                    <TabPanel>
                        <div id="stochastic_tab_content">
                            <StochasticFormContainer/>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }

    handleMacdIsOnToggle(isOn) {
        this.state.macdEnabled = isOn;
        if (isOn) {
            this.setState({macdTabClassNames:this.enabledLabelClasses});
        } else {
            this.setState({macdTabClassNames:this.notEnabledLabelClasses});
        }
    }
}

export default App;
