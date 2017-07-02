/**
 * Created by jzheng on 7/1/17.
 */

import logger from 'react-logger'
class RequestBuilder {
    static buildMacdRequest(macd) {
        var jsonRequest = {
            __type__: 'MACD_SCREENER',
            trigger_cause : macd.triggerTypeSelected,
            trigger_direction : macd.triggerDirectionSelected,
            trigger_in_n_days : macd.triggerWithinDaysInput
        };
        logger.log('built macdRequest ', jsonRequest);
        return jsonRequest
    }   
    
    static buildStochasticReqeust(stochastic) {
        var jsonRequest = {
            __type__: 'STOCHASTIC_OSCILLATOR',
            __subtype__: stochastic.screenerSubtypeSelected,
            trigger_cause: stochastic.triggerTypeSelected
        };

        if (stochastic.triggerDirectionIsBetween) {
            jsonRequest['upper_bound'] = stochastic.triggerUpperBound;
            jsonRequest['lower_bound'] = stochastic.triggerLowerBound;
        } else {
            jsonRequest['trigger_target'] = stochastic.triggerTarget;
        }

        logger.log('built stochastic ', jsonRequest);
        return jsonRequest
    }

    static buildTickerRequest(tickerStore) {
        var jsonRequest = {
            tickers : tickerStore.tickerString.split(',')
        }

        logger.log('built tickers ', jsonRequest);
        return jsonRequest
    }
}

export default RequestBuilder