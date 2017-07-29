import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from "react-redux"
import store from "./store"
import {BrowserRouter as Router, Route, NavLink} from "react-router-dom"
import TextArea from "./components/TextArea"
import Home from './Home'
import Submit from './Submit'
import AppProvider from './components/AppProvider'

ReactDOM.render(

        <Router>
            <div>
                <nav className="navbar navbar-default navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">Project name</a>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <li className="active"><NavLink to="/">Home</NavLink></li>
                                <li><NavLink to="/predict">Predict</NavLink></li>
                                <li><a href="#contact">Contact</a></li>
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
                                    <ul className="dropdown-menu">
                                        <li><a href="#">Action</a></li>
                                        <li><a href="#">Another action</a></li>
                                        <li><a href="#">Something else here</a></li>
                                        <li role="separator" className="divider"></li>
                                        <li className="dropdown-header">Nav header</li>
                                        <li><a href="#">Separated link</a></li>
                                        <li><a href="#">One more separated link</a></li>
                                    </ul>
                                </li>
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                <li><a href="../navbar/">Default</a></li>
                                <li className="active"><a href="./">Static top <span className="sr-only">(current)</span></a></li>
                                <li><a href="../navbar-fixed-top/">Fixed top</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <Route exact path="/" component={Home}/>
                <Route path="/predict" component={AppProvider}/>
            </div>
        </Router>,
document.getElementById('root')
);

/**
 *         <Provider store={store}>
 <App/>
 </Provider>

 <div>
 <nav className="navbar navbar-default navbar-static-top">
 <div className="container">
 <div className="navbar-header">
 <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
 <span className="sr-only">Toggle navigation</span>
 <span className="icon-bar"></span>
 <span className="icon-bar"></span>
 <span className="icon-bar"></span>
 </button>
 <a className="navbar-brand" href="#">Project name</a>
 </div>
 <div id="navbar" className="navbar-collapse collapse">
 <ul className="nav navbar-nav">
 <li className="active"><NavLink to="/">Home</NavLink></li>
 <li><NavLink to="/submit">Submit</NavLink></li>
 <li><a href="#contact">Contact</a></li>
 <li className="dropdown">
 <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
 <ul className="dropdown-menu">
 <li><a href="#">Action</a></li>
 <li><a href="#">Another action</a></li>
 <li><a href="#">Something else here</a></li>
 <li role="separator" className="divider"></li>
 <li className="dropdown-header">Nav header</li>
 <li><a href="#">Separated link</a></li>
 <li><a href="#">One more separated link</a></li>
 </ul>
 </li>
 </ul>
 <ul className="nav navbar-nav navbar-right">
 <li><a href="../navbar/">Default</a></li>
 <li className="active"><a href="./">Static top <span className="sr-only">(current)</span></a></li>
 <li><a href="../navbar-fixed-top/">Fixed top</a></li>
 </ul>
 </div>
 </div>
 </nav>
 <Route exact path="/" component={Home}/>
 <Route path="/submit" component={Submit}/>
 </div>
 */
