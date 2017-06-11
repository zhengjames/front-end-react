import React, { Component } from 'react';
import '../node_modules/spectre.css/dist/spectre.min.css';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
import 'react-tabs/style/react-tabs.css';
require('./styles.css');
import FormContainer from './containers/ScreenerFormContainer';
import MacdFormContainer from './containers/MacdFormContainer.js'
import StochasticFormContainer from './containers/StochasticFormContainer.js'



class App extends Component {
    render() {
        return (
            <div>
                <h1>React Tabs</h1>
                <p>
                    <a href="https://github.com/reactjs/react-tabs/blob/gh-pages/example/main.js">Demo Source</a>
                </p>

                <Tabs>
                    <TabList>
                        <Tab>MACD</Tab>
                        <Tab>Stochastic RSI</Tab>
                    </TabList>
                    <TabPanel>
                    <div id="macd_tab_content">
                        <MacdFormContainer/>
                    </div>
                    </TabPanel>
                    <TabPanel>
                        <div id="macd_tab_content">
                            <StochasticFormContainer/>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}

export default App;
