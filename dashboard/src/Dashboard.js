import React, { Component } from 'react';
import Loading from './Loading';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentWillMount() {
    this.props.setTitle('How many times your urls have been hitten?');
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
                Object.keys(serverData)
                    .sort((j, k) => !(serverData[j] > serverData[k]))
                    .map(k =>
                      <tr key={k}>
                        <td>{k}</td>
                        <td className='center'>{serverData[k]}</td>
                      </tr>
                    )
                :
                <tr>
                  <td colSpan="2">
                    <Loading altText='loading...' />
                  </td>
                </tr>
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
