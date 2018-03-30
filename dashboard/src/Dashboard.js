import React, { Component } from 'react';
import Loading from './Loading';
import { TextInput, Toggle } from './Fields';

const PATTERN_CRITERIA = {
  download : /.*(download).*/i,
  dwr : /.*(dwr).*/i,
  api: /.*(rpc\/api).*/i
}

function toggleElementFromArray(element, array) {
  if (array.includes(element)) {
    array = array.filter(e => e !== element);
  }
  else {
    array = array.concat([element]);
  }
  return array;
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      urlCriteria: '',
      urlCriteriaOut: '',
      hiddenCriteria: Object.values(PATTERN_CRITERIA),
    };

    ['urlFilter', 'urlFilterOut']
      .forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    this.props.setTitle('How many times your urls have been hitten?');
  }

  componentDidMount() {
    let url = 'stats.json';

    fetch(url)
    .then(res => res.json())
    .then((jsonData) => {
      this.setState({ data: jsonData });
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
    this.setState({ hiddenCriteria: toggleElementFromArray(criteria, this.state.hiddenCriteria) });
  }

  validateRegEx(exp) {
    try {
      ''.match(exp);
    }
    catch (Exception){
      return false;
    }
    return true;
  }

  filterData() {
    var data = Object.keys(this.state.data);
    if (this.state.urlCriteria.length > 0) {
      try {
        data = data.filter(d => d.match(this.state.urlCriteria));
      }
      catch (Exception){
        console.log('Invalid regex [' + Exception + ']');
      }
    }
    if (this.state.urlCriteriaOut.length > 0) {
      try {
        data = data.filter(d => !d.match(this.state.urlCriteriaOut));
      }
      catch (Exception) {
        console.log('Invalid regex [' + Exception + ']');
      }
    }

    this.state.hiddenCriteria.forEach(c => data = data.filter(d => !d.match(c)));

    return data;
  }

  normalizedData() {
    return this.filterData();
  }

  render() {
    const serverData = this.state.data;
    let data = [];
    if (serverData) {
      data = this.normalizedData();
    }
    return (
      <div className="dashboard">
        <aside>
          <h3>Filters</h3>
          <TextInput
              type='text'
              name='urlCriteria'
              initialValue={this.state.urlCriteria}
              placeholder='[use regex]'
              onChange={this.urlFilter}
              label={'Filter-in by url'}
              classStyle={'d-inline-block ' + (this.validateRegEx(this.state.urlCriteria) ? '' : 'error')}
          />
          <TextInput
              type='text'
              name='urlCriteriaOut'
              initialValue={this.state.urlCriteriaOut}
              placeholder='[use regex]'
              onChange={this.urlFilterOut}
              label={'Filter-out by url'}
              classStyle={'d-inline-block ' + (this.validateRegEx(this.state.urlCriteriaOut) ? '' : 'error')}
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
          <table>
            <colgroup>
              <col width="85%"/>
              <col width="15%"/>
            </colgroup>
            <thead>
              <tr>
                <th>Url [{data.length}]</th>
                <th className="center">Count</th>
              </tr>
            </thead>
            <tbody>
              {
                serverData ?
                  data.sort((j, k) => !(serverData[j] > serverData[k]))
                      .map((k, index) =>
                        <tr className={index % 2 === 0 ? 'even-row' : 'odd-row'} key={k}>
                          <td>{k}</td>
                          <td className='center'>{serverData[k]}</td>
                        </tr>
                      )
                  :
                  <tr>
                    <td colSpan="2">
                      <Loading altText='loading...' />
                    </td>
                  </tr>
              }
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </section>
      </div>
    );
  }
}

export default Dashboard;
