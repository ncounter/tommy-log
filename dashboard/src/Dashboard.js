import React, { Component } from 'react';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    let url = 'stats.json';

    fetch(url)
    .then(res => res.json())
    .then((jsonData) => {
      this.setState({ data: jsonData });
    })
    .catch(err => { throw err });
  }

  render() {
    const serverData = this.state.data;
    return (
      <div className="App-intro">
        <div>{ serverData ? 'loaded' : 'not loaded yet' }</div>
        <table>
          <thead>
            <tr>
              <th>url</th>
              <th>count</th>
            </tr>
          </thead>
          <tbody>
            {
              serverData ?
              Object.keys(serverData).map(k => <tr key={k}><td>{k}</td><td className='center'>{serverData[k]}</td></tr>)
              : null
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default Dashboard;
