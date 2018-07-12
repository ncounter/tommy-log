import React, { Component } from 'react';
import Loading from './Loading';
import Pagination from './Pagination';

export class Col extends Component {
  render() {
    return (
      <td className={this.props.className}>
        {this.props.data}
      </td>
    )
  }
}

export class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      itemsPerPage: 10
    };

    ['changePage', 'changeItemsPerPage']
    .forEach(method => this[method] = this[method].bind(this));
  }

  changePage(page) {
    this.setState({currentPage : page})
  }

  changeItemsPerPage(itemsPerPage) {
    var newCurrentPage = this.state.currentPage;
    const newLastPage = Math.ceil(this.currentData().length / itemsPerPage);
    if (newLastPage < newCurrentPage) {
      newCurrentPage = newLastPage;
    }
    this.setState({itemsPerPage: itemsPerPage, currentPage: newCurrentPage});
  }

  paginatedData(data) {
    return data.slice((this.state.currentPage - 1) * this.state.itemsPerPage, this.state.currentPage * this.state.itemsPerPage)
  }

  currentData() {
    return this.props.rawData || []
  }

  render() {
    return (
      <table>
        <colgroup>
          {this.props.children.map((c, i) => <col key={i} width={c.props.width} />)}
        </colgroup>
        <thead>
          <tr className='toolbar'>
            <th colSpan={this.props.headers.length}>
              <Pagination
                  dataLength={this.currentData().length}
                  currentPage={this.state.currentPage}
                  itemsPerPage={this.state.itemsPerPage}
                  onChangePage={this.changePage}
                  onChangeItemsPerPage={this.changeItemsPerPage}
              />
            </th>
          </tr>
          <tr className='col-header'>
            {
              this.props.headers.map(h => h)
            }
          </tr>
        </thead>
        <tbody>
          {
            !this.props.loading ?
              this.currentData().length > 0 ?
                this.paginatedData(this.props.sort(this.currentData()))
                    .map((datum, index) =>
                      <tr className={index % 2 === 0 ? 'even-row' : 'odd-row'} key={Object.keys(datum)[0]}>
                        {
                          this.props.children.map((c, i) =>
                            <Col key={c + i} className={c.props.className}
                              data={c.props.data(datum)}
                            />
                          )
                        }
                      </tr>
                    )
                :
                <tr>
                  <td colSpan={this.props.headers.length}>
                    <span>No data available</span>
                  </td>
                </tr>
              :
              <tr>
                <td colSpan={this.props.headers.length}>
                  <Loading altText='loading...' />
                </td>
              </tr>
          }
        </tbody>
        <tfoot>
          <tr className='toolbar'>
            <td colSpan={this.props.headers.length}>
              <Pagination
                  dataLength={this.currentData().length}
                  currentPage={this.state.currentPage}
                  itemsPerPage={this.state.itemsPerPage}
                  onChangePage={this.changePage}
                  onChangeItemsPerPage={this.changeItemsPerPage}
              />
            </td>
          </tr>
        </tfoot>
      </table>
    )
  }
}
