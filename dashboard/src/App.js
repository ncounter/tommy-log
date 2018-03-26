import React, { Component } from 'react';
import './App.css';
import Dashboard from './Dashboard';
import Patterns from './Patterns';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'App',
      page: '#Dashboard'
    }
  }

  componentWillMount() {
    if (window.location.hash) {
      this.setState({page: window.location.hash});
    }
  }

  setTitle(newTitle) {
    this.setState({
      title: newTitle
    });
  }

  currentPage(pageId) {
    this.setState({
      page: pageId
    });
  }

  render() {
    return (
      <div>
        <header>
          <h3>{this.state.title}</h3>
        </header>
        <div>
          <a href="#Dashboard" onClick={() => this.currentPage('#Dashboard')}>Dashboard</a>&nbsp;
          <a href="#Patterns" onClick={() => this.currentPage('#Patterns')}>Patterns</a>
        </div>
        {
          this.state.page === '#Dashboard' ?
            <Dashboard setTitle={(title) => this.setTitle(title)} />
            : <Patterns setTitle={(title) => this.setTitle(title)} />
        }
      </div>
    );
  }
}

export default App;
