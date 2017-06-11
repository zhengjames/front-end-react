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

        this.notEnabledLabelClasses = ["react-tabs__tab"];
        this.enhancedLabelClasses = ["react-tabs__tab", "screener-tab_is_disabled"];
        this.state = {
            //by default enable the two
            macdEnabled : true,
            stochasticEnabled : true,
            //by default use the css that indicates enabled
            macdTabClassNames: this.notEnabledLabelClasses,
            stochasticTabClassNames: this.notEnabledLabelClasses
        }

        this.handleMacdStatusOnToggle = this.handleMacdStatusOnToggle.bind(this);
        this.handleStochasticStatusOnToggle = this.handleStochasticStatusOnToggle.bind(this);
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
                        <Tab className={this.state.stochasticTabClassNames}>Stochastic RSI</Tab>
                    </TabList>
                    <TabPanel>
                        <div id="macd_tab_content">
                            <MacdFormContainer
                                isEnabled={this.state.macdEnabled}
                                handleIsEnabledToggle={this.handleMacdStatusOnToggle}
                            />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div id="stochastic_tab_content">
                            <StochasticFormContainer
                                isEnabled={this.state.stochasticEnabled}
                                handleIsEnabledToggle={this.handleStochasticStatusOnToggle}/>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }

    handleMacdStatusOnToggle(isEnabled) {
        this.state.macdEnabled = isEnabled;
        //enhance only
        if (isEnabled) {
            this.setState({macdTabClassNames:this.notEnabledLabelClasses});
        } else {
            this.setState({macdTabClassNames:this.enhancedLabelClasses});
        }
    }

    handleStochasticStatusOnToggle(isEnabled) {
        this.state.stochasticEnabled = isEnabled;
        if (isEnabled) {
            this.setState({stochasticTabClassNames:this.notEnabledLabelClasses});
        } else {
            this.setState({stochasticTabClassNames:this.enhancedLabelClasses});
        }
    }
}

export default App;
