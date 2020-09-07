import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ConnectedReduxTest, rootReducer, initialState } from './ReduxTest'
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import DragTest from './DragTest'


// Store creation

const store = createStore(rootReducer, initialState);

export default function App() {
  return (
    <Provider store={store}>
      {/* <ConnectedReduxTest /> */}
      <DragTest />
    </Provider>
  );
}


