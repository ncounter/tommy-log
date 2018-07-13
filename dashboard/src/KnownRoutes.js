import React, { Component } from 'react';
import { TextInput } from './Fields';
import { Table, Col } from './Table';
import Utils from './Utils';

class Patterns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      criteria: {
        show: '',
        hide: ''
      },
      isLoading: false
    };

    ['filterInOutChange', 'filterData']
      .forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    this.props.setTitle('Which known routes have been hit the most, and which never?');
  }

  componentDidMount() {
    let urlKnown = 'known-urls.json';
    let urlStats = 'stats.json';

    this.setState({isLoading: true});

    if(!Utils.linkCheck(urlKnown) || !Utils.linkCheck(urlStats)) {
      this.setState({ data: [], isLoading : false });
      return;
    }

    fetch(urlKnown)
    .then(res => res.json())
    .then((jsonDataKnown) => {
      fetch(urlStats)
      .then(res2 => res2.json())
      .then((jsonDataStats) => {
        const statsKeys = jsonDataStats.map(s => Object.keys(s)[0].toString());
        const hitUrlsMap = jsonDataStats.filter(s => jsonDataKnown.includes(Object.keys(s)[0]));
        const neverHitUrls = jsonDataKnown.filter(k => !statsKeys.includes(k));
        const neverHitUrlsMap = neverHitUrls.map(n => {
          let obj = {};
          obj[n] = 0;
          return obj;
        });
        const matchedData = [...hitUrlsMap, ...neverHitUrlsMap];
        this.setState({ data: matchedData, isLoading: false });
      })
      .catch(err2 => { throw err2 });
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
    if (data && data.length > 0) {
      if (this.state.criteria.show.length > 0) {
        try {
          data = data.filter(d => Object.keys(d)[0].match(this.state.criteria.show));
        }
        catch (Exception){
          console.log('Invalid regex [' + Exception + ']');
        }
      }
      if (this.state.criteria.hide.length > 0) {
        try {
          data = data.filter(d => !Object.keys(d)[0].match(this.state.criteria.hide));
        }
        catch (Exception) {
          console.log('Invalid regex [' + Exception + ']');
        }
      }
    }
    return data;
  }

  sort(rawData) {
    return rawData.sort((d1, d2) => !(Object.values(d1)[0] > Object.values(d2)[0]))
  }

  render() {
    return (
      <div className="patterns">
        <div>This is computed taking all known URLs in advance (from such a map.xml file for instance) where all possible mapped routes are listed, then extracting how many times each route has been hit by users matching this computation on top of Tomcat logs [see Raw Stats tab].</div>
        <br/><br/>
        <aside>
          <h3>Filters</h3>
          <TextInput
              type='text'
              name='criteriaShow'
              initialValue={this.state.criteria.show}
              placeholder='[use regex]'
              onChange={(value) => this.filterInOutChange(value, 'show')}
              label={'Show URLs matching'}
              classStyle={'d-inline-block ' + (Utils.validateRegEx(this.state.criteria.show) ? '' : 'error')}
          />
          <TextInput
              type='text'
              name='criteriaHide'
              initialValue={this.state.criteria.hide}
              placeholder='[use regex]'
              onChange={(value) => this.filterInOutChange(value, 'hide')}
              label={'Hide URLs matching'}
              classStyle={'d-inline-block ' + (Utils.validateRegEx(this.state.criteria.hide) ? '' : 'error')}
          />
        </aside>
        <section>
        <Table
              dataKey={(datum) => Object.keys(datum)[0]}
              rawData={this.filterData(this.state.data)}
              sort={this.sort}
              loading={this.state.isLoading}
              headers={[
                <th key="th-url">URL</th>,
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

export default Patterns;
