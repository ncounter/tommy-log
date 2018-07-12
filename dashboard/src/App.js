import React, { Component } from 'react';
import './App.css';
import Stats from './Stats';
import Patterns from './Patterns';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'App',
      page: '#Stats'
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
          <menu>
            <ul className='menu'>
              <li>
                <a className={'menu-item ' + (this.state.page === '#Stats' ? 'active' : '')}
                    href="#Stats" onClick={() => this.currentPage('#Stats')}>Stats</a>
              </li>
              <li>
                <a className={'menu-item ' + (this.state.page === '#Patterns' ? 'active' : '')}
                    href="#Patterns" onClick={() => this.currentPage('#Patterns')}>Patterns</a>
              </li>
            </ul>
          </menu>
        </header>
        <div className="page-title">{this.state.title}</div>
        {
          this.state.page === '#Stats' ?
            <Stats setTitle={(title) => this.setTitle(title)} />
            : <Patterns setTitle={(title) => this.setTitle(title)} />
        }
      </div>
    );
  }
}

export default App;
