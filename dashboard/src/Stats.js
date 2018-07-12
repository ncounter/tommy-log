import React, { Component } from 'react';
import { TextInput, Toggle } from './Fields';
import { Table, Col } from './Table';
import Utils from './Utils';

const PATTERN_CRITERIA = {
  download : /.*(download).*/i,
  dwr : /.*(dwr).*/i,
  api: /.*(rpc\/api).*/i
}

class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      urlCriteria: '',
      urlCriteriaOut: '',
      hiddenCriteria: Object.values(PATTERN_CRITERIA),
      isLoading: false
    };

    ['urlFilter', 'urlFilterOut', 'filterData']
      .forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    this.props.setTitle('How many times your urls have been hitten?');
  }

  componentDidMount() {
    let url = 'stats.json';

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

  urlFilter(criteria) {
    this.setState({ urlCriteria: criteria });
  }

  urlFilterOut(criteria) {
    this.setState({ urlCriteriaOut: criteria });
  }

  toggleHiddenCriteria(criteria) {
    this.setState({ hiddenCriteria: Utils.toggleElementFromArray(criteria, this.state.hiddenCriteria) });
  }

  filterData(data) {
    if (this.state.urlCriteria.length > 0) {
      try {
        data = data.filter(d => Object.keys(d)[0].match(this.state.urlCriteria));
      }
      catch (Exception){
        console.log('Invalid regex [' + Exception + ']');
      }
    }
    if (this.state.urlCriteriaOut.length > 0) {
      try {
        data = data.filter(d => !Object.keys(d)[0].match(this.state.urlCriteriaOut));
      }
      catch (Exception) {
        console.log('Invalid regex [' + Exception + ']');
      }
    }
    this.state.hiddenCriteria.forEach(c => data = data.filter(d => !Object.keys(d)[0].match(c)));
    return data;
  }

  sort(rawData) {
    return rawData.sort((d1, d2) => !(Object.values(d1)[0] > Object.values(d2)[0]))
  }

  render() {
    return (
      <div className="stats">
        <aside>
          <h3>Filters</h3>
          <TextInput
              type='text'
              name='urlCriteria'
              initialValue={this.state.urlCriteria}
              placeholder='[use regex]'
              onChange={this.urlFilter}
              label={'Filter-in by url'}
              classStyle={'d-inline-block ' + (Utils.validateRegEx(this.state.urlCriteria) ? '' : 'error')}
          />
          <TextInput
              type='text'
              name='urlCriteriaOut'
              initialValue={this.state.urlCriteriaOut}
              placeholder='[use regex]'
              onChange={this.urlFilterOut}
              label={'Filter-out by url'}
              classStyle={'d-inline-block ' + (Utils.validateRegEx(this.state.urlCriteriaOut) ? '' : 'error')}
          />
          {
            Object.keys(PATTERN_CRITERIA).map(c =>
              <Toggle
                  key={c + '-toggler'}
                  name={c + '-toggler'}
                  initialValue={this.state.hiddenCriteria.includes(PATTERN_CRITERIA[c])}
                  onChange={() => this.toggleHiddenCriteria(PATTERN_CRITERIA[c])}
                  label={'Hide ' + PATTERN_CRITERIA[c] + ' urls'}
                  classStyle='d-inline-block'
              />
            )
          }
        </aside>
        <section>
          <Table
              rawData={this.filterData(this.state.data)}
              sort={this.sort}
              loading={this.state.isLoading}
              headers={[
                <th key="th-url">Url</th>,
                <th key="th-count" className="center">Count</th>
              ]}
          >
            <Col data={(datum) => Object.keys(datum)} width='65%' />
            <Col data={(datum) => Object.values(datum)} className='center' width='35%' />
          </Table>
        </section>
      </div>
    );
  }
}

export default Stats;
