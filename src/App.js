import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ConnectedReduxTest, rootReducer, initialState } from './ReduxTest'
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import DragTest from './DragTest'
import DragFirebaseTest from './DragFirebaseTest'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';



// Store creation

const store = createStore(rootReducer, initialState);

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        {/* <ConnectedReduxTest /> */}
        {/* <Route exact path='/' component={`<div>App</div>`} /> */}
        <Route exact path='/redux-test' component={ConnectedReduxTest} />
        <Route exact path='/drag-test' component={DragTest} />
        <Route exact path='/drag-firebase-test' component={DragFirebaseTest} />
      </Router>
    </Provider>
  );
}


