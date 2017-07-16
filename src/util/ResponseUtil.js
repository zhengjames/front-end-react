/**
 * Created by jzheng on 7/13/17.
 */

import ResultDisplay from "../components/ResultDisplay";
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
     Do all ticker results in array pass?
     */
    static isArrayResultPassed(resultArray) {
        if (resultArray == null) {
            return false;
        }

        for (var i = 0; i < resultArray.length; i++) {
            if (!this.isResultPassed(resultArray[i])) {
                return false;
            }
        }

        return true;
    }

    /*
        Convert server response format to ui displayable format
        so ui component can display comprehensive result to customers
        @param {String} ticker name
        @param {Array} screened results, each screener's result is an elem in the array
        example: [{"__type__": "MACD", "pass": false, "prediction": 9999}]
     */
    static convertToComprehensiveFormat(ticker, resultArr) {
        var comprehensiveResponse = {};
        comprehensiveResponse['ticker'] = ticker != null ? ticker.toUpperCase() : 'UNKNOWN';
        resultArr.map((result, index) => {
            if ('__type__' in result) {
                switch (result['__type__']) {
                    case 'MACD':

                        comprehensiveResponse['MACD'] = {
                            pass: this.sanitizeVariable(result['pass']),
                            result: `Cross in ${this.sanitizeVariable(result['prediction'])} days`
                        };
                        break;
                    case 'STOCHASTIC':
                        comprehensiveResponse['STOCHASTIC'] = {
                            pass: this.sanitizeVariable(result['pass']),
                            result:
                                    `Current fast moving average: ${result['current_value'][0]['FAST_MA']} \n
                                    Current slow moving average: ${result['current_value'][0]['SLOW_MA']}`
                        };
                        break;
                }
            }
        })
    }

    static sanitizeVariable(variable, expectedVarClass) {
        switch (expectedVarClass.name) {
            case 'Integer':
            case 'Float':
            case 'Double':
                (variable == null || variable.name != expectedVarClass.name ) ?
                    (9999) : variable;
                break;
            case 'String':
                (variable == null || variable.name != expectedVarClass.name) ?
                    ('UNKNOWN') : variable;
        }
    }
}

export default ResponseUtil
