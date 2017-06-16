import React, { Component } from 'react';
import '../node_modules/spectre.css/dist/spectre.min.css';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
import 'react-tabs/style/react-tabs.css';
require('./styles.css');
import MacdFormContainer from './containers/MacdFormContainer.js'
import StochasticFormContainer from './containers/StochasticFormContainer.js'
import StockTickersFormContainer from './containers/StockTickersFormContainer.js'



class App extends Component {

    constructor(props) {
        super(props)

        this.enabledLabelClasses = ["react-tabs__tab", "screener-tab_is_enabled"];
        this.disabledLabelClasses = ["react-tabs__tab", "screener-tab_is_disabled"];
        this.unsatisfLabelClasses = ["react-tabs__tab", "screener-tab_is_unsatisfied"];
        this.state = {
            //by default enable the two
            macdEnabled : true,
            stochasticEnabled : true,
            tickersEnabled : false,
            //by default use the css that indicates enabled
            macdTabClassNames: this.enabledLabelClasses,
            stochasticTabClassNames: this.enabledLabelClasses,
            tickersTabClassNames: this.unsatisfLabelClasses

        }

        this.handleMacdStatusOnToggle = this.handleMacdStatusOnToggle.bind(this);
        this.handleStochasticStatusOnToggle = this.handleStochasticStatusOnToggle.bind(this);
        this.handleTickerStatusOnToggle = this.handleTickerStatusOnToggle.bind(this);
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
                        <Tab className={this.state.tickersTabClassNames}> Stock Tickers</Tab>
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
                    <TabPanel>
                        <div id="stock_tickers_tab_content">
                            <StockTickersFormContainer
                            isEnabled={this.state.tickersEnabled}
                            handleIsEnabledToggle={this.handleTickerStatusOnToggle}/>
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
            this.setState({macdTabClassNames:this.enabledLabelClasses});
        } else {
            this.setState({macdTabClassNames:this.disabledLabelClasses});
        }
    }

    handleStochasticStatusOnToggle(isEnabled) {
        this.state.stochasticEnabled = isEnabled;
        if (isEnabled) {
            this.setState({stochasticTabClassNames:this.enabledLabelClasses});
        } else {
            this.setState({stochasticTabClassNames:this.disabledLabelClasses});
        }
    }

    handleTickerStatusOnToggle(isEnabled) {
        this.state.tickersEnabled = isEnabled;
        if (isEnabled) {
            this.setState({tickersTabClassNames: this.enabledLabelClasses});
        } else {
            this.setState({tickersTabClassNames: this.unsatisfLabelClasses});
        }
    }
}

export default App;
