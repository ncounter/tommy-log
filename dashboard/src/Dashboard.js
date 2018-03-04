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
      <div className="dashboard">
        <table>
          <colgroup>
            <col width="85%"/>
            <col width="15%"/>
          </colgroup>
          <thead>
            <tr>
              <th>url</th>
              <th className="center">count</th>
            </tr>
          </thead>
          <tbody>
            {
              serverData ?
              Object.keys(serverData).map(k => <tr key={k}><td>{k}</td><td className='center'>{serverData[k]}</td></tr>)
              : <tr><td colSpan="2" className="loading"><img className="icon" src="/loading.gif" alt="loading.." /></td></tr>
            }
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default Dashboard;
