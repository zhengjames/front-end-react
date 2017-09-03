import React, { Component } from 'react'
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
import {Glyphicon} from 'react-bootstrap'
import logger from 'react-logger'
import RequestBuilder from './util/RequestBuilder'
import {run} from './validation/ruleRunner.js'
import {updateMacdErrorValidation, updateStochasticErrorValidation} from './actions/stockTickersAction'
import request from 'superagent'
import ResponseUtil from './util/ResponseUtil'
import ScreeningResultDisplay from "./components/ScreeningResultDisplay";
import {BrowserRouter, NavLink, Router, Route} from 'react-router-dom'
import TradingviewChart from './components/TradingviewChart'

require('./resource/css/animations.css');
require('./resource/css/spectre.min.css');
require('./resource/css/styles.css');


class App extends Component {

    constructor(props) {
        super(props);
        /**
         * constants to control css for tabs
         */
        this.enabledLabelClasses = ["react-tabs__tab", "screener-tab_is_enabled"];
        this.disabledLabelClasses = ["react-tabs__tab", "screener-tab_is_disabled"];
        this.unsatisfLabelClasses = ["react-tabs__tab", "screener-tab_is_unsatisfied"];
        this.state = {
            stochasticEnabled : true,
            macdEnabled : true,
            //by default use the css that indicates enabled
            macdTabClassNames: (this.props.isEnabledMacd == true) ?
                this.enabledLabelClasses : this.disabledLabelClasses,

            stochasticTabClassNames: this.enabledLabelClasses,

            tickersTabClassNames: (this.props.isValidTicker == true) ?
                this.enabledLabelClasses : this.unsatisfLabelClasses,
            screenedResponse: {},
            failedScreeningResults: {},
            passedScreeningResults: {},
            shouldDisplayResults: false,
            responseError: false,
            isSubmitting: false,
            submitButtonText: 'Submit',
            submitButtonClassName: 'react-tabs__tab',
            formClassName: '',
            chart: <div></div>
        };

        this.handleMacdStatusOnToggle = this.handleMacdStatusOnToggle.bind(this);
        this.handleStochasticStatusOnToggle = this.handleStochasticStatusOnToggle.bind(this);
        this.handleTickerStatusOnToggle = this.handleTickerStatusOnToggle.bind(this);
        this.submitRequest = this.submitRequest.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.createStatesBySubmittingStatus = this.createStatesBySubmittingStatus.bind(this);
        this.createChart = this.createChart.bind(this);
    }

    render() {
        return (
            <BrowserRouter>
            <div className={this.state.formClassName}>
                {this.state.responseError ? <p>Error please try again</p> : null }

                <Tabs>
                    <TabList>
                        <Tab className={this.state.macdTabClassNames}>MACD</Tab>
                        <Tab className={this.state.stochasticTabClassNames}>Stochastic RSI</Tab>
                        <Tab className={this.state.tickersTabClassNames}> Stock Tickers</Tab>
                        <li className={this.state.submitButtonClassName} id="submit_button" onClick={this.submitRequest}>
                            {this.state.submitButtonText} <Glyphicon glyph="chevron-right" /></li>
                    </TabList>
                    <TabPanel>
                        <div id="macd_tab_content">
                            <MacdFormContainer
                                handleIsEnabledToggle={this.handleMacdStatusOnToggle}
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
                </Tabs>
                <ScreeningResultDisplay
                    shouldDisplay={this.state.shouldDisplayResults}
                    passedScreeningResults={this.state.passedScreeningResults}
                    failedScreeningResults={this.state.failedScreeningResults}
                    shouldDisplayMacd={this.state.macdEnabled}
                    shouldDisplayStochastic={this.state.stochasticEnabled}
                />
            </div>
            </BrowserRouter>
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
        this.setState({macdEnabled: isEnabled});
    }

    handleStochasticStatusOnToggle(isEnabled) {
        this.props.dispatch(updateStochasticToggleOnOff(isEnabled));
        if (isEnabled) {
            this.setState({stochasticTabClassNames:this.enabledLabelClasses});
        } else {
            this.setState({stochasticTabClassNames:this.disabledLabelClasses});
        }
        this.setState({stochasticEnabled: isEnabled});
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

    /**
     * When user presses submit button
     * 1. collect all user form inputs
     * 2. create request using inputs
     * 3. call server and display response
     */
    submitRequest() {
        // show error if needed
        var isAllRequiredFormValid = this.validateActiveTabs();

        if (!isAllRequiredFormValid) {
            return;
        }

        var screening_request = {
            tickers_arr: RequestBuilder.buildTickerRequest(this.props.tickerStore.tickerString)
        };
        var screener_arr = [];
        if (this.props.macdStore.isEnabled) {
            screener_arr = screener_arr.concat(RequestBuilder.buildMacdRequest(this.props.macdStore))
        }
        if (this.props.stochasticStore.isEnabled) {
            screener_arr = screener_arr.concat(RequestBuilder.buildStochasticRequest(this.props.stochasticStore))
        }
        screening_request['screener_arr'] = screener_arr;

        logger.log('completed request is ', screening_request);
        console.log('completed request is ', JSON.stringify(screening_request));
        this.setState(this.createStatesBySubmittingStatus(true), () =>
        {
            request.post('http://127.0.0.1:8070/screen')
                .withCredentials()
                .send(screening_request)
                .end(this.handleResponse);
        });
    }

    /**
     * changes state flag of app to determing whether app should
     * display 'Submit' or 'Submitting'
     * @param status true/false
     * @returns {state:value}
     */
    createStatesBySubmittingStatus(status) {
        //if form is submitting
        if (status) {
            return {
                submitButtonText: 'Submitting...',
                submitButtonClassName: 'react-tabs__tab blink'
            }
        } else {
            return {
                submitButtonText: 'Submit',
                submitButtonClassName: 'react-tabs__tab'
            }
        }
    }

    handleResponse(error, response) {
        if (error != null) {
            this.setState({responseError: true});
            this.setState(this.createStatesBySubmittingStatus(false));
            logger.log('server response with error ', error);
            return
        }

        this.setState({responseError: false});

        console.log('server response: ', response);
        this.setState({screenedResponse: response['text']});
        var responseJson = JSON.parse(response['text']);
        var passedResult = {};
        var failedResult = {};

        /**
         * put the tickers that passed screening first
         */
        Object.keys(responseJson).map((tickerKey) => {
            if (tickerKey in responseJson &&
                ResponseUtil.isAllResultsPassed(responseJson[tickerKey])) {
                passedResult[tickerKey] = responseJson[tickerKey]
            } else {
                failedResult[tickerKey] = responseJson[tickerKey]
            }
        });

        this.setState(Object.assign({}, {
            shouldDisplayResults: true,
            failedScreeningResults: failedResult,
            passedScreeningResults: passedResult
        }, this.createStatesBySubmittingStatus(false)));
    }

    /**
     * make sure all the enabled forms are valid
     * ignores disable forms because user does not desire to use that screener
     * @returns {boolean}
     */
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

    createChart(ticker) {
        this.setState(
            {
                chart: <TradingviewChart ticker={ticker}/>
            }
        )
    }
}

export default connect((store) => {
    return {
        tickerString: store.ticker.tickerString,
        isValidTicker: store.ticker.isValid,
        isEnabledMacd: store.macd.isEnabled,
        macdStore: store.macd,
        stochasticStore : store.stochastic,
        tickerStore: store.ticker,
    }
}) (App)
