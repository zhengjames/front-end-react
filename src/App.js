import React, { Component } from 'react'
import '../node_modules/spectre.css/dist/spectre.min.css'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import MacdFormContainer from './containers/MacdFormContainer'
import StochasticFormContainer from './containers/StochasticFormContainer.js'
import StockTickersFormContainer from './containers/StockTickersFormContainer.js'
import {
    updateTickers, updateMacdToggleOnOff, updateStochasticToggleOnOff,
    updateTickerErrorValidation
} from "./actions/stockTickersAction"
import {connect} from "react-redux"
import {Button, Glyphicon} from 'react-bootstrap'
import logger from 'react-logger'
import RequestBuilder from './util/RequestBuilder'
import {run, ruleRunner, required, mustMatch, minLength, mustBeNumber} from './validation/ruleRunner.js'
import {updateMacdErrorValidation, updateStochasticErrorValidation} from './actions/stockTickersAction'

require('./styles.css');
@connect((store) => {
    return {
        tickerString: store.ticker.tickerString,
        isValidTicker: store.ticker.isValid,
        isEnabledMacd: store.macd.isEnabled,
        macdStore: store.macd,
        stochasticStore : store.stochastic,
        tickerStore: store.ticker,
    }
})
class App extends Component {

    constructor(props) {
        super(props);
        this.enabledLabelClasses = ["react-tabs__tab", "screener-tab_is_enabled"];
        this.disabledLabelClasses = ["react-tabs__tab", "screener-tab_is_disabled"];
        this.unsatisfLabelClasses = ["react-tabs__tab", "screener-tab_is_unsatisfied"];
        this.state = {
            stochasticEnabled : true,
            //by default use the css that indicates enabled
            macdTabClassNames: (this.props.isEnabledMacd == true) ?
                this.enabledLabelClasses : this.disabledLabelClasses,

            stochasticTabClassNames: this.enabledLabelClasses,

            tickersTabClassNames: (this.props.isValidTicker == true) ?
                this.enabledLabelClasses : this.unsatisfLabelClasses
        };

        this.handleMacdStatusOnToggle = this.handleMacdStatusOnToggle.bind(this);
        this.handleStochasticStatusOnToggle = this.handleStochasticStatusOnToggle.bind(this);
        this.handleTickerStatusOnToggle = this.handleTickerStatusOnToggle.bind(this);
        this.submitRequest = this.submitRequest.bind(this);
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
                        <Tab > apple stock </Tab>
                        <li className="react-tabs__tab" id="submit_button" onClick={this.submitRequest}>
                            Submit<Glyphicon glyph="chevron-right" /></li>
                    </TabList>
                    <TabPanel>
                        <div id="macd_tab_content">
                            <MacdFormContainer
                                handleIsEnabledToggle={this.handleMacdStatusOnToggle}
                                test1={this.state.test}
                            />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div id="stochastic_tab_content">
                            <StochasticFormContainer
                                handleIsEnabledToggle={this.handleStochasticStatusOnToggle}/>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div id="stock_tickers_tab_content">
                            <StockTickersFormContainer
                            isEnabled={this.props.isValidTicker}
                            tickerString={this.props.tickerString}
                            handleIsEnabledToggle={this.handleTickerStatusOnToggle}/>
                        </div>
                    </TabPanel>
                    <TabPanel>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }

    handleMacdStatusOnToggle(isEnabled) {
        this.props.dispatch(updateMacdToggleOnOff(isEnabled));
        //enhance only
        if (isEnabled) {
            this.setState({macdTabClassNames:this.enabledLabelClasses});
        } else {
            this.setState({macdTabClassNames:this.disabledLabelClasses});
        }
    }

    handleStochasticStatusOnToggle(isEnabled) {
        this.props.dispatch(updateStochasticToggleOnOff(isEnabled));
        if (isEnabled) {
            this.setState({stochasticTabClassNames:this.enabledLabelClasses});
        } else {
            this.setState({stochasticTabClassNames:this.disabledLabelClasses});
        }
    }

    handleTickerStatusOnToggle(payload) {
        //handle states of App
        var tickersEnabled = payload.isValid;

        if (tickersEnabled) {
            this.setState({tickersTabClassNames: this.enabledLabelClasses});
        } else {
            this.setState({tickersTabClassNames: this.unsatisfLabelClasses});
        }

        //update store
        this.props.dispatch(updateTickers({"isValid": payload.isValid,
            "tickerString": payload.tickerString}));
    }

    submitRequest() {

        //show error if needed
        var isAllRequiredFormValid = this.validateActiveTabs();

        if (!isAllRequiredFormValid) {
            return;
        }

        var completedRequest = {
            tickers_arr: RequestBuilder.buildTickerRequest(this.props.tickerStore)
        };
        var screener_arr = [];
        if (this.props.macdStore.isEnabled) {
            screener_arr =  screener_arr.concat(RequestBuilder.buildMacdRequest(this.props.macdStore))
        }
        if (this.props.stochasticStore.isEnabled) {
            screener_arr = screener_arr.concat(RequestBuilder.buildStochasticRequest(this.props.stochasticStore))
        }
        completedRequest['screener_arr'] = screener_arr;

        logger.log('completed request is ', completedRequest);
        console.log('completed request is ', JSON.stringify(completedRequest));

    }

    validateActiveTabs() {
        var newMacdValidationErrors = {validationErrors:
            run(this.props.macdStore, this.props.macdStore.fieldValidations),
            //after clicking submit, it will show error
            showErrors: this.props.macdStore.isEnabled};
        //merge current prop and new validation
        this.setState(
            Object.assign(
                {macdTabClassNames: this.retrieveCurrentTabClass(
                    newMacdValidationErrors, this.state.macdTabClassNames)}),
                () => this.props.dispatch(updateMacdErrorValidation(newMacdValidationErrors))
        );

        var newStochasticValidationErrors = {validationErrors:
            run(this.props.stochasticStore, this.props.stochasticStore.fieldValidations),
            //after clicking submit, it will show error
            showErrors: this.props.stochasticStore.isEnabled};

        this.setState(
            Object.assign(
                {stochasticTabClassNames: this.retrieveCurrentTabClass(
                    newStochasticValidationErrors, this.state.stochasticTabClassNames)}),
            () => this.props.dispatch(updateStochasticErrorValidation(newStochasticValidationErrors)));

        var newTickerValidationErrors = {validationErrors:
            run(this.props.tickerStore, this.props.tickerStore.fieldValidations),
            //after clicking submit, it will show error
            showErrors: true};

        this.props.dispatch(updateTickerErrorValidation(newTickerValidationErrors));

        var isMacdEnabled = this.props.macdStore.isEnabled;
        var isStochEnabled = this.props.stochasticStore.isEnabled;
        //can we send the request?
        if (    //macd screener is either valid or not being used
            (Object.keys(newMacdValidationErrors.validationErrors).length == 0 || !isMacdEnabled)
                //stochastic screener is either valid or not being used
            && (Object.keys(newStochasticValidationErrors.validationErrors).length == 0 || !isStochEnabled)
                //we always need some tickers
            && Object.keys(newTickerValidationErrors.validationErrors).length == 0
                //at least one screener must be enabled
            && (isMacdEnabled || isStochEnabled)) {
            return true;
        }

        return false;
    }

    retrieveCurrentTabClass(prop, currentClass) {
        if (!prop.showErrors) {
            return this.disabledLabelClasses;
        } else if (prop.showErrors && Object.keys(prop.validationErrors).length > 0) {
            return this.unsatisfLabelClasses;
        } else {
            return this.enabledLabelClasses;
        }
    }
}

export default App;
