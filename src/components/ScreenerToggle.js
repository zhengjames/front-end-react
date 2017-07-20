/**
 * Created by jzheng on 6/10/17.
 */
import React from 'react';
import PropTypes from 'prop-types'
import Toggle from 'react-toggle'

const ScreenerToggle = (props) => (

    <div className="toggle-container">
        <div className="toggle-desc">{props.label}</div>
        <Toggle
            onChange={props.controlFunc}
            checked={props.checked}/>
    </div>

);

ScreenerToggle.propTypes = {
    controlFunc: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired
};

export default ScreenerToggle;