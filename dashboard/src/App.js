import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './Dashboard';

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <h3>How many times your app urls have been hitten?</h3>
        </header>
        <Dashboard />
      </div>
    );
  }
}

export default App;
