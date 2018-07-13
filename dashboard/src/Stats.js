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
      criteria: {
        show: '',
        hide: ''
      },
      hiddenCriteria: Object.values(PATTERN_CRITERIA),
      isLoading: false
    };

    ['filterInOutChange', 'filterData']
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

  toggleHiddenCriteria(criteria) {
    this.setState({ hiddenCriteria: Utils.toggleElementFromArray(criteria, this.state.hiddenCriteria) });
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
      this.state.hiddenCriteria.forEach(c => data = data.filter(d => !Object.keys(d)[0].match(c)));
    }
    return data;
  }

  sort(rawData) {
    return rawData.sort((d1, d2) => !(Object.values(d1)[0] > Object.values(d2)[0]))
  }

  render() {
    return (
      <div className="stats">
        <div>This is computed taking Tomcat logs and counting how many times a certain URL has been requested.
          It includes raw and useless URLs like sources [.js files, download of .xml files, dwr requests, etc]</div>
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

export default Stats;
