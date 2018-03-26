import React, { Component } from 'react';
import Loading from './Loading';

class Patterns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };

    []
      .forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    this.props.setTitle('Frequent patterns');
  }

  componentDidMount() {
    let url = 'patterns.json';

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
        <aside>
          <h3>Filters</h3>
        </aside>
        <section>
          <table>
            <colgroup>
              <col width="65%"/>
              <col width="35%"/>
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
                  Object.keys(serverData).map((k, index) =>
                        <tr className={index % 2 == 0 ? 'even-row' : 'odd-row'} key={k}>
                          <td>{k}</td>
                          <td className=''>
                            {
                              Object.keys(serverData[k]).map(t =>
                                  <div>{t} - {serverData[k][t]}</div>
                              )
                            }
                          </td>
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
        </section>
      </div>
    );
  }
}

export default Patterns;
