import React, { Component } from 'react';
import { TextInput, Toggle } from './Fields';
import { Table, Col } from './Table';
import Utils from './Utils';

class Patterns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      patternCriteria: '',
      patternCriteriaOut: '',
      isLoading: false
    };

    ['patternFilter', 'patternFilterOut', 'filterData']
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

  patternFilter(criteria) {
    this.setState({ patternCriteria: criteria });
  }

  patternFilterOut(criteria) {
    this.setState({ patternCriteriaOut: criteria });
  }

  filterData(data) {
    if (this.state.patternCriteria.length > 0) {
      try {
        data = data.filter(d => d.match(this.state.patternCriteria));
      }
      catch (Exception){
        console.log('Invalid regex [' + Exception + ']');
      }
    }
    if (this.state.patternCriteriaOut.length > 0) {
      try {
        data = data.filter(d => !d.match(this.state.patternCriteriaOut));
      }
      catch (Exception) {
        console.log('Invalid regex [' + Exception + ']');
      }
    }

    return data;
  }

  render() {
    return (
      <div className="patterns">
        <aside>
          <h3>Filters</h3>
          <TextInput
              type='text'
              name='urlCriteria'
              initialValue={this.state.patternCriteria}
              placeholder='[use regex]'
              onChange={this.patternFilter}
              label={'Filter-in by pattern'}
              classStyle={'d-inline-block ' + (Utils.validateRegEx(this.state.patternCriteria) ? '' : 'error')}
          />
          <TextInput
              type='text'
              name='patternCriteriaOut'
              initialValue={this.state.patternCriteriaOut}
              placeholder='[use regex]'
              onChange={this.patternFilterOut}
              label={'Filter-out by pattern'}
              classStyle={'d-inline-block ' + (Utils.validateRegEx(this.state.patternCriteriaOut) ? '' : 'error')}
          />
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
