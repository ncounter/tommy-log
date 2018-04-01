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
          >
            <Col data={(datum, key) => key} width='65%' />
            <Col data={(datum, key) => Object.keys(datum[key]).map(t => <div key={t}>{t} - {datum[key][t]}</div>)} width='35%' />
          </Table>
        </section>
      </div>
    );
  }
}

export default Patterns;
