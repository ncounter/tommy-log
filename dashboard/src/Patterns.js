import React, { Component } from 'react';
import { TextInput } from './Fields';
import { Table, Col } from './Table';
import Utils from './Utils';

class Patterns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      criteria:
        {
          fromShow: '',
          fromHide: '',
          toShow: '',
          toHide: ''
        },
      isLoading: false
    };

    ['filterInOutChange', 'filterData']
      .forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    this.props.setTitle('Frequent patterns workflow');
  }

  componentDidMount() {
    let url = 'patterns.json';

    this.setState({isLoading: true});

    if(!Utils.linkCheck(url)) {
      this.setState({ data: [], isLoading : false });
      return;
    }

    fetch(url)
    .then(res => res.json())
    .then((jsonData) => {
      this.setState({ data: jsonData, isLoading: false });
    })
    .catch(err => { throw err });
  }

  filterInOutChange(newCriteria, filterKey) {
    this.setState((prevState) => {
      const criteria = prevState.criteria;
      criteria[filterKey] = newCriteria
      return (
        {
          criteria : criteria
        }
      )
    });
  }

  filterData(data) {
    if (this.state.criteria.fromShow.length > 0) {
      try {
        data = data.filter(d => d.from.match(this.state.criteria.fromShow));
      }
      catch (Exception){
        console.log('Invalid regex [' + Exception + ']');
      }
    }
    if (this.state.criteria.fromHide.length > 0) {
      try {
        data = data.filter(d => !d.from.match(this.state.criteria.fromHide));
      }
      catch (Exception) {
        console.log('Invalid regex [' + Exception + ']');
      }
    }
    if (this.state.criteria.toShow.length > 0) {
      try {
        data = data.filter(d => d.to.match(this.state.criteria.toShow));
      }
      catch (Exception){
        console.log('Invalid regex [' + Exception + ']');
      }
    }
    if (this.state.criteria.toHide.length > 0) {
      try {
        data = data.filter(d => !d.to.match(this.state.criteria.toHide));
      }
      catch (Exception) {
        console.log('Invalid regex [' + Exception + ']');
      }
    }
    return data;
  }

  sort(rawData) {
    return rawData.sort((d1, d2) => d1.count < d2.count)
  }

  render() {
    return (
      <div className="patterns">
        <aside>
          <h3>Filters</h3>
          <TextInput
              type='text'
              name='criteriaFromShow'
              initialValue={this.state.criteria.fromShow}
              placeholder='[use regex]'
              onChange={(value) => this.filterInOutChange(value, 'fromShow')}
              label={'Show rows with "From" matching'}
              classStyle={'d-inline-block ' + (Utils.validateRegEx(this.state.criteria.fromShow) ? '' : 'error')}
          />
          <TextInput
              type='text'
              name='criteriaFromHide'
              initialValue={this.state.criteria.fromHide}
              placeholder='[use regex]'
              onChange={(value) => this.filterInOutChange(value, 'fromHide')}
              label={'Hide rows with "From" matching'}
              classStyle={'d-inline-block ' + (Utils.validateRegEx(this.state.criteria.fromHide) ? '' : 'error')}
          />
          <TextInput
              type='text'
              name='criteriaToShow'
              initialValue={this.state.criteria.toShow}
              placeholder='[use regex]'
              onChange={(value) => this.filterInOutChange(value, 'toShow')}
              label={'Show rows with "To" matching'}
              classStyle={'d-inline-block ' + (Utils.validateRegEx(this.state.criteria.toShow) ? '' : 'error')}
          />
          <TextInput
              type='text'
              name='criteriaToHide'
              initialValue={this.state.criteria.toHide}
              placeholder='[use regex]'
              onChange={(value) => this.filterInOutChange(value, 'toHide')}
              label={'Hide rows with "To" matching'}
              classStyle={'d-inline-block ' + (Utils.validateRegEx(this.state.criteria.toHide) ? '' : 'error')}
          />
        </aside>
        <section>
          <Table
              dataKey={(datum) => datum.from + '->' + datum.to}
              rawData={this.filterData(this.state.data)}
              sort={this.sort}
              loading={this.state.isLoading}
              headers={[
                <th key="th-from">From</th>,
                <th key="th-to">To</th>,
                <th key="th-count">Count</th>,
              ]}
          >
            {/* {from, to, count} */}
            <Col data={(datum) => datum.from} width='40%' />
            <Col data={(datum) => datum.to} width='40%' />
            <Col data={(datum) => datum.count} width='20%' />
          </Table>
        </section>
      </div>
    );
  }
}

export default Patterns;
