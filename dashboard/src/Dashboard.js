import React, { Component } from 'react';
import Loading from './Loading';
import TextInput from './Fields';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      urlCriteria: '',
      urlCriteriaOut: ''
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

  filterData() {
    var data = Object.keys(this.state.data);
    if (this.state.urlCriteria.length > 0) {
      data = data.filter(d => d.includes(this.state.urlCriteria));
    }
    if (this.state.urlCriteriaOut.length > 0) {
      data = data.filter(d => !d.includes(this.state.urlCriteriaOut));
    }
    return data;
  }

  normalizedData() {
    return this.filterData();
  }

  render() {
    const serverData = this.state.data;
    return (
      <div className="dashboard">
        <TextInput
            type='text'
            name='urlCriteria'
            initialValue={this.state.urlCriteria}
            placeholder='keep-in by url'
            onChange={this.urlFilter}
            label={'filter-in by url'}
            classStyle='d-inline-block'
        />
        &nbsp;
        <TextInput
            type='text'
            name='urlCriteriaOut'
            initialValue={this.state.urlCriteriaOut}
            placeholder='exclude by url'
            onChange={this.urlFilterOut}
            label={'filter-out by url'}
            classStyle='d-inline-block'
        />
        <table>
          <colgroup>
            <col width="85%"/>
            <col width="15%"/>
          </colgroup>
          <thead>
            <tr>
              <th>url</th>
              <th className="center">count</th>
            </tr>
          </thead>
          <tbody>
            {
              serverData ?
                this.normalizedData(serverData)
                    .sort((j, k) => !(serverData[j] > serverData[k]))
                    .map(k =>
                      <tr key={k}>
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
      </div>
    );
  }
}

export default Dashboard;
