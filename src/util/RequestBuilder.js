/**
 * Created by jzheng on 7/1/17.
 */

import logger from 'react-logger'
class RequestBuilder {
    /*
        input macd store
     */
    static buildMacdRequest(macd) {
        var jsonRequest = {
            __type__: 'MACD',
            trigger_cause : macd.triggerTypeSelected,
            trigger_direction : macd.triggerDirectionSelected,
            trigger_in_n_days : parseInt(macd.triggerWithinDaysInput)
        };
        logger.log('built macdRequest ', jsonRequest);
        return jsonRequest
    }   

    /*
        input stochastic store
     */
    static buildStochasticRequest(stochastic) {
        if (!stochastic.isEnabled) {
            return;
        }

        var jsonRequest = {
            __type__: 'STOCHASTIC_OSCILLATOR',
            __subtype__: stochastic.screenerSubtypeSelected,
            trigger_cause: stochastic.triggerTypeSelected,
            trigger_direction: stochastic.triggerDirectionSelected
        };

        if (stochastic.triggerDirectionSelected == 'BETWEEN') {
            jsonRequest['upper_bound'] = parseInt(stochastic.triggerUpperBound);
            jsonRequest['lower_bound'] = parseInt(stochastic.triggerLowerBound);
        } else {
            jsonRequest['trigger_target'] = parseInt(stochastic.triggerTarget);
        }

        logger.log('built stochastic ', jsonRequest);
        return jsonRequest
    }
    /*
        input ticker store
     */
    static buildTickerRequest(tickerString) {
        tickerString = tickerString.replace(/\s/g,'');
        var jsonRequest = tickerString.split(',');

        logger.log('built tickers ', jsonRequest);
        return jsonRequest
    }
}

export default RequestBuilder