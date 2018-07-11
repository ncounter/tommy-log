import React, { Component } from 'react';
import { Table, Col } from './Table';
import Utils from './Utils';

class Patterns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoading: false
    };

    ['filterData']
      .forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    this.props.setTitle('Frequent patterns');
  }

  componentDidMount() {
    let url = 'patterns.json';

    this.setState({isLoading: true});

    if(!Utils.linkCheck(url)) {
      this.setState({ data: {}, isLoading : false });
      return;
    }

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

  render() {
    return (
      <div className="patterns">
        <aside>
          <h3>Filters</h3>
        </aside>
        <section>
          <Table
              keys={Utils.normalizeData(this.state.data, this.filterData)}
              rawMap={this.state.data}
              loading={this.state.isLoading}
              headers={[
                <th key="th-fromto">Pattern</th>,
                <th key="th-count">Count</th>,
              ]}
          >
            <Col
                // {from, to, count}
                data={(datum, key) =>
                    <div key={key}>
                      {datum[key].from} --> {datum[key].to}
                    </div>
                }
                width='80%'
            />
            <Col data={(datum, key) => datum[key].count} width='20%' />
          </Table>
        </section>
      </div>
    );
  }
}

export default Patterns;
