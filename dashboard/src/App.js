import React, { Component } from 'react';
import './App.css';
import Dashboard from './Dashboard';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'App'
    }
  }

  setTitle(newTitle) {
    this.setState({
      title: newTitle
    });
  }

  render() {
    return (
      <div>
        <header>
          <h3>{this.state.title}</h3>
        </header>
        <Dashboard setTitle={(title) => this.setTitle(title)} />
      </div>
    );
  }
}

export default App;
