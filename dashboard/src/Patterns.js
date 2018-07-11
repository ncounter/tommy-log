import React, { Component } from 'react';
import { TextInput } from './Fields';
import { Table, Col } from './Table';
import Utils from './Utils';

class Patterns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      criteria:
        {
          from: '',
          fromOut: '',
          to: '',
          toOut: ''
        },
      patternCriteriaOut: '',
      isLoading: false
    };

    ['filterFrom', 'filterOutFrom', 'filterData']
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

  filterFrom(newCriteria) {
    this.setState((prevState) => {
      return (
        {
          criteria :
            {
              from: newCriteria,
              fromOut: prevState.criteria.fromOut,
              to: prevState.criteria.to,
              toOut: prevState.criteria.toOut,
            }
        }
      )
    });
  }

  filterOutFrom(newCriteria) {
    this.setState((prevState) => {
      return (
        {
          criteria :
            {
              from: prevState.criteria.from,
              fromOut: newCriteria,
              to: prevState.criteria.to,
              toOut: prevState.criteria.toOut,
            }
        }
      )
    });
  }

  filterData(data) {
    if (this.state.criteria.from.length > 0) {
      try {
        data = data.filter(d => d.from.match(this.state.criteria.from));
      }
      catch (Exception){
        console.log('Invalid regex [' + Exception + ']');
      }
    }
    if (this.state.criteria.fromOut.length > 0) {
      try {
        data = data.filter(d => !d.from.match(this.state.criteria.fromOut));
      }
      catch (Exception) {
        console.log('Invalid regex [' + Exception + ']');
      }
    }

    return data;
  }

  sort(keys, rawData) {
    return keys.sort((j, k) => !(rawData[j].count > rawData[k].count))
  }

  render() {
    return (
      <div className="patterns">
        <aside>
          <h3>Filters</h3>
          <TextInput
              type='text'
              name='criteriaFrom'
              initialValue={this.state.criteria.from}
              placeholder='[use regex]'
              onChange={this.filterFrom}
              label={'Filter-in by FromUrl'}
              classStyle={'d-inline-block ' + (Utils.validateRegEx(this.state.criteria.from) ? '' : 'error')}
          />
          <TextInput
              type='text'
              name='criteriaFromOut'
              initialValue={this.state.criteria.fromOut}
              placeholder='[use regex]'
              onChange={this.filterOutFrom}
              label={'Filter-out by FromUrl'}
              classStyle={'d-inline-block ' + (Utils.validateRegEx(this.state.criteria.fromOut) ? '' : 'error')}
          />
        </aside>
        <section>
          <Table
              keys={Utils.getKeys(this.filterData(this.state.data))}
              rawMap={this.state.data}
              sort={this.sort}
              loading={this.state.isLoading}
              headers={[
                <th key="th-from">From</th>,
                <th key="th-to">To</th>,
                <th key="th-count">Count</th>,
              ]}
          >
            {/* {from, to, count} */}
            <Col data={(datum, key) => datum[key].from} width='40%' />
            <Col data={(datum, key) => datum[key].to} width='40%' />
            <Col data={(datum, key) => datum[key].count} width='20%' />
          </Table>
        </section>
      </div>
    );
  }
}

export default Patterns;
