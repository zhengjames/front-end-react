/**
 * Created by jzheng on 7/29/17.
 */
import React, {Component} from 'react';
import {Provider} from 'react-redux'
import store from '../store'
import App from '../App'

class AppProvider extends Component {

    render() {
        return (
            <Provider store={store}>
                <App/>
            </Provider>
        )
    }
}

export default AppProvider;