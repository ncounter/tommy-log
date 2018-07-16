import React, { Component } from 'react';
import './App.css';
import Stats from './Stats';
import Patterns from './Patterns';
import KnownRoutes from './KnownRoutes';

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
    let pageContent;
    switch(this.state.page) {
      case "#Stats": pageContent = <Stats setTitle={(title) => this.setTitle(title)} />; break;
      case "#Patterns": pageContent = <Patterns setTitle={(title) => this.setTitle(title)} />; break;
      case "#KnownRoutes": pageContent = <KnownRoutes setTitle={(title) => this.setTitle(title)} />; break;
    }

    return (
      <div>
        <header>
          <menu>
            <ul className='menu'>
              <li>
                <a className={'menu-item ' + (this.state.page === '#Stats' ? 'active' : '')}
                    href="#Stats" onClick={() => this.currentPage('#Stats')}>Raw Stats</a>
              </li>
              <li>
                <a className={'menu-item ' + (this.state.page === '#KnownRoutes' ? 'active' : '')}
                    href="#KnownRoutes" onClick={() => this.currentPage('#KnownRoutes')}>Known route stats</a>
              </li>
              <li>
                <a className={'menu-item ' + (this.state.page === '#Patterns' ? 'active' : '')}
                    href="#Patterns" onClick={() => this.currentPage('#Patterns')}>Refined Patterns</a>
              </li>
            </ul>
          </menu>
        </header>
        <div className="page-title">{this.state.title}</div>
        {pageContent}
      </div>
    );
  }
}

export default App;
