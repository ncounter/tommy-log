import React, { Component } from 'react';
import { Table, Col } from './Table';

class Patterns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoading: false
    };

    []
      .forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    this.props.setTitle('Frequent patterns');
  }

  componentDidMount() {
    let url = 'patterns.json';

    this.setState({isLoading: true});
    fetch(url)
    .then(res => res.json())
    .then((jsonData) => {
      this.setState({ data: jsonData, isLoading: false });
    })
    .catch(err => { throw err });
  }

  filterData(data) {
    return data;
  }

  normalizedData() {
    if (this.state.data) {
      const keys = Object.keys(this.state.data);
      return this.filterData(keys);
    }
    return []
  }

  render() {
    return (
      <div className="patterns">
        <aside>
          <h3>Filters</h3>
        </aside>
        <section>
          <Table
              keys={this.normalizedData()}
              rawMap={this.state.data}
              loading={this.state.isLoading}
              headers={[
                <th key="th-ip">IP</th>,
                <th key="th-fromto">Pattern</th>,
              ]}
          >
            <Col data={(datum, key) => key} width='20%' />
            <Col
                // {ip:{fromUrl:{toUrl:X}}}
                data={(datum, key) =>
                    Object.keys(datum[key]) // {fromUrl:{toUrl:X}}
                        .map(fromUrl =>
                          Object.keys(datum[key][fromUrl]) // {toUrl:X}
                              .map(toUrl =>
                                  <div key={key + '-' + fromUrl + '-' + toUrl}>
                                    {fromUrl} --> {toUrl} [{datum[key][fromUrl][toUrl]}]
                                    <hr/>
                                  </div>
                              )
                        )
                }
                width='80%'
            />
          </Table>
        </section>
      </div>
    );
  }
}

export default Patterns;
