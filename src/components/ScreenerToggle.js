/**
 * Created by jzheng on 6/10/17.
 */
import React from 'react';
import PropTypes from 'prop-types'
import Toggle from 'react-toggle'

const ScreenerToggle = (props) => (
    <div class="toggle-container">
        <div class="toggle-desc">{props.label}</div>
        <Toggle

            defaultChecked={props.defaultChecked}
            onChange={props.controlFunc} />
    </div>

);

ScreenerToggle.propTypes = {
    defaultChecked: PropTypes.bool.isRequired,
    
    controlFunc: PropTypes.func.isRequired,
};

export default ScreenerToggle;