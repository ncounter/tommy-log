import React, { Component } from 'react';
import Loading from './Loading';
import Pagination from './Pagination';

class Patterns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      currentPage: 1,
      itemsPerPage: 10
    };

    ['changePage', 'changeItemsPerPage']
      .forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    this.props.setTitle('Frequent patterns');
  }

  componentDidMount() {
    let url = 'patterns.json';

    fetch(url)
    .then(res => res.json())
    .then((jsonData) => {
      this.setState({ data: jsonData });
    })
    .catch(err => { throw err });
  }

  changePage(page) {
    this.setState({currentPage : page})
  }

  changeItemsPerPage(itemsPerPage) {
    this.setState({itemsPerPage: itemsPerPage});
  }

  filterData(data) {
    return data;
  }

  paginatedData(data) {
    return data.slice((this.state.currentPage - 1) * this.state.itemsPerPage, this.state.currentPage * this.state.itemsPerPage)
  }

  normalizedData() {
    const keys = Object.keys(this.state.data);
    return this.filterData(keys);
  }

  render() {
    const serverData = this.state.data;
    let data = [];
    let dataLength = 0;
    if (serverData) {
      data = this.normalizedData();
      dataLength = data.length;
    }
    return (
      <div className="patterns">
        <aside>
          <h3>Filters</h3>
        </aside>
        <section>
          <table>
            <colgroup>
              <col width="65%"/>
              <col width="35%"/>
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
                  this.paginatedData(data).map((k, index) =>
                        <tr className={index % 2 === 0 ? 'even-row' : 'odd-row'} key={k}>
                          <td>{k}</td>
                          <td className=''>
                            {
                              Object.keys(serverData[k]).map(t =>
                                  <div>{t} - {serverData[k][t]}</div>
                              )
                            }
                          </td>
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
                <td colSpan={2}>
                  <Pagination
                      dataLength={dataLength}
                      currentPage={this.state.currentPage}
                      itemsPerPage={this.state.itemsPerPage}
                      onChangePage={this.changePage}
                      onChangeItemsPerPage={this.changeItemsPerPage}
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </section>
      </div>
    );
  }
}

export default Patterns;
