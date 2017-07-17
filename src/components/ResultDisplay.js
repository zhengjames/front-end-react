/**
 * Created by jzheng on 7/14/17.
 */
import React from 'react';
import PropTypes from 'prop-types'
import { Button, Table } from 'react-bootstrap'
import ResponseUtil from "../util/ResponseUtil";

const ResultDisplay = (props) => (
    <Table responsive>
        <thead>
        <tr>
            <th>#</th>
            <th>Ticker</th>
            <th>Screening result</th>
            <th>Macd result</th>
            <th>Stochastic result </th>
        </tr>
        </thead>
        <tbody>
        {Object.keys(props.failedScreeningResults).map((tickerKey, index) => {
            var displayableMap = ResponseUtil.convertToComprehensiveFormat(tickerKey, props.failedScreeningResults[tickerKey]);
            return (
                <tr key={index}>
                    <td>{index}</td>
                    <td>{tickerKey}</td>
                    <td>failed</td>
                    <td>{'MACD' in displayableMap ? displayableMap['MACD']['results'] : 'UNKNOWN'}</td>
                    <td>{'STOCHASTIC' in displayableMap ? displayableMap['STOCHASTIC']['results'] : 'UNKNOWN'}</td>
                </tr>
            )
        })
        }
        </tbody>
    </Table>
);

export default ResultDisplay;