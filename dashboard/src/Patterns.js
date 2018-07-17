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
        data = data.filter(d => d.from.url.match(this.state.criteria.fromShow));
      }
      catch (Exception){
        console.log('Invalid regex [' + Exception + ']');
      }
    }
    if (this.state.criteria.fromHide.length > 0) {
      try {
        data = data.filter(d => !d.from.url.match(this.state.criteria.fromHide));
      }
      catch (Exception) {
        console.log('Invalid regex [' + Exception + ']');
      }
    }
    if (this.state.criteria.toShow.length > 0) {
      try {
        data = data.filter(d => d.to.url.match(this.state.criteria.toShow));
      }
      catch (Exception){
        console.log('Invalid regex [' + Exception + ']');
      }
    }
    if (this.state.criteria.toHide.length > 0) {
      try {
        data = data.filter(d => !d.to.url.match(this.state.criteria.toHide));
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
        <div>This is computed taking Tomcat logs and counting how many times a certain pair of URLs has been requested in the same sequence (the pair of URLs is counted only if requested from the same ip/user). It filters raw and useless URLs like sources [.js files, download of .xml files, dwr requests, etc], and this leads to a real result of a UX-path pattern. For instance, if a user requests URL b from URL a, and the load of b requires the load of 1.js and 2.js, the pair patterns should look like the following: {"{ from : a, to : 1.js }, { from : 1.js, to : 2.js }, { from : 2.js, to : b }"}, but in the end it will be effectively only {"{ from : a, to : b }"}
        </div>
        <br/><br/>
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
              dataKey={(datum) => datum.from.url + '->' + datum.to.url}
              rawData={this.filterData(this.state.data)}
              sort={this.sort}
              loading={this.state.isLoading}
              headers={[
                <th key="th-from">From</th>,
                <th key="th-from-method">Method</th>,
                <th key="th-to">To</th>,
                <th key="th-to-method">Method</th>,
                <th key="th-count">Count</th>,
              ]}
          >
            {/* {from, to, count} */}
            <Col data={(datum) => datum.from.url} width='35%' />
            <Col data={(datum) => datum.from.method} width='12%' />
            <Col data={(datum) => datum.to.url} width='35%' />
            <Col data={(datum) => datum.to.method} width='12%' />
            <Col data={(datum) => datum.count} width='6%' />
          </Table>
        </section>
      </div>
    );
  }
}

export default Patterns;
