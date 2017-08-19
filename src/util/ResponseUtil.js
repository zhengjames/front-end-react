/**
 * Created by jzheng on 7/13/17.
 */

import ResultDisplay from "../components/ScreeningResultDisplay";
class ResponseUtil {
    /*
     Does ticker result pass?
     */
    static isResultPassed(resultJson) {
        if (resultJson == null) {
            return false;
        }

        return resultJson['pass'];
    }

    /*
     Do all ticker results in map pass?
     */
    static isAllResultsPassed(result) {
        if (result == null) {
            return false;
        }
        var passedAllScreening = true;
        Object.keys(result).map((k) => {
            if (!this.isResultPassed(result[k])) {
                passedAllScreening = false;
        }});

        return passedAllScreening;
    }

    /*
        Convert server response format to ui displayable format
        so ui component can display comprehensive result to customers
        @param {String} ticker name
        @param {Array} screened results, each screener's result is an elem in the array
        example: {
                    "aapl": {
                    "STOCHASTIC_OSCILLATOR": {
                    "pass": false,
                    "__type__": "STOCHASTIC_OSCILLATOR",
                    "__subtype__": "RSI",
                    "calculated_map": {
                    "SLOW_MA": 99.99999999999999,
                    "FAST_MA": 99.99999999999999
                    }
                    },
                    "MACD": {
                    "__type__": "MACD",
                    "pass": false,
                    "prediction": 9999
                    }
                    }
                }


     */
    static convertToComprehensiveFormat(ticker, resultsMap) {
        var comprehensiveResponse = {};
        comprehensiveResponse['TICKER'] = ticker != null ? ticker.toUpperCase() : 'UNKNOWN';
        comprehensiveResponse['ALL_SCREENER_PASS'] = this.isAllResultsPassed(resultsMap);
        Object.keys(resultsMap).map((screenerNameKey, index) => {
            if (screenerNameKey) {
                switch (screenerNameKey) {
                    case 'MACD':
                        var macdResults = resultsMap['MACD'];
                        comprehensiveResponse['MACD_PASS'] = this.sanitizeVariable(macdResults['pass'], 'Boolean');
                        comprehensiveResponse['MACD_PREDICTION'] = this.sanitizeVariable(macdResults['prediction'], 'Integer');
                        break;
                    case 'STOCHASTIC':
                    case 'STOCHASTIC_OSCILLATOR':
                        var stochResults = resultsMap['STOCHASTIC_OSCILLATOR'];
                        comprehensiveResponse['STOCHASTIC_PASS'] = this.sanitizeVariable(stochResults['pass'], 'Boolean');
                        comprehensiveResponse['STOCHASTIC_RESULT_FAST_MA'] = stochResults['calculated_map']['FAST_MA'];
                        comprehensiveResponse['STOCHASTIC_RESULT_SLOW_MA'] = stochResults['calculated_map']['SLOW_MA'];
                        break;
                }
            }
        });

        return comprehensiveResponse;
    }

    static sanitizeVariable(variable, expectedVarClass) {
        switch (expectedVarClass.toUpperCase()) {
            case 'INTEGER':
            case 'FLOAT':
            case 'DOUBLE':
                return (variable == null) ?
                    (9999) : variable;
            case 'BOOLEAN':
                return (variable == null || (variable != true && variable != false)) ?
                    false : variable;

            case 'STRING':
                return (variable == null) ?
                    ('UNKNOWN') : variable;
        }
    }
}

export default ResponseUtil
