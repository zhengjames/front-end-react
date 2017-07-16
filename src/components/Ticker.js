/**
 * Created by jzheng on 7/13/17.
 */
import React from 'react';
import PropTypes from 'prop-types'

const Ticker = (props) => (
    <div>
        {props.ticker}
    </div>
);

Ticker.propTypes = {
    ticker: PropTypes.string
}

export default Ticker;