import React, { Component } from 'react';
import Loading from './Loading';
import { TextInput, Toggle } from './Fields';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      urlCriteria: '',
      urlCriteriaOut: '',
      urlHideDownload: true,
      urlHideDwr: true
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

  urlHideDownload(isActive) {
    this.setState({ urlHideDownload: isActive });
  }

  urlHideDwr(isActive) {
    this.setState({ urlHideDwr: isActive });
  }

  filterData() {
    var data = Object.keys(this.state.data);
    if (this.state.urlCriteria.length > 0) {
      data = data.filter(d => d.includes(this.state.urlCriteria));
    }
    if (this.state.urlCriteriaOut.length > 0) {
      data = data.filter(d => !d.includes(this.state.urlCriteriaOut));
    }
    if (this.state.urlHideDownload) {
      data = data.filter(d => !d.includes('/rhn/manager/download/'));
    }
    if (this.state.urlHideDwr) {
      data = data.filter(d => !d.includes('/rhn/dwr/'));
    }
    return data;
  }

  normalizedData() {
    return this.filterData();
  }

  render() {
    const serverData = this.state.data;
    let data = [];
    if (serverData) {
      data = this.normalizedData(serverData);
    }
    return (
      <div className="dashboard">
        <aside>
          <h3>Filters</h3>
          <TextInput
              type='text'
              name='urlCriteria'
              initialValue={this.state.urlCriteria}
              placeholder='keep-in by url'
              onChange={this.urlFilter}
              label={'filter-in by url'}
              classStyle='d-inline-block'
          />
          <TextInput
              type='text'
              name='urlCriteriaOut'
              initialValue={this.state.urlCriteriaOut}
              placeholder='exclude by url'
              onChange={this.urlFilterOut}
              label={'filter-out by url'}
              classStyle='d-inline-block'
          />
          <Toggle
              name='urlHideDownload'
              initialValue={this.state.urlHideDownload}
              onChange={(isChecked) => this.urlHideDownload(isChecked)}
              label={'hide \'/rhn/manager/download/\' urls'}
              classStyle='d-inline-block'
          />
          <Toggle
              name='urlHideDwr'
              initialValue={this.state.urlHideDwr}
              onChange={(isChecked) => this.urlHideDwr(isChecked)}
              label={'hide \'/rhn/dwr/\' download'}
              classStyle='d-inline-block'
          />
        </aside>
        <section>
          <table>
            <colgroup>
              <col width="85%"/>
              <col width="15%"/>
            </colgroup>
            <thead>
              <tr>
                <th>url [{data.length}]</th>
                <th className="center">count</th>
              </tr>
            </thead>
            <tbody>
              {
                serverData ?
                  data.sort((j, k) => !(serverData[j] > serverData[k]))
                      .map((k, index) =>
                        <tr className={index % 2 == 0 ? 'even-row' : 'odd-row'} key={k}>
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
