import React, { Component } from 'react';

class Pagination extends Component {
  render() {
    const lastPage = Math.ceil(this.props.dataLength / this.props.itemsPerPage);
    let arrPages = [];
    for (var i = 1; i <= lastPage; i++) {
      arrPages.push(i)
    }
    return (
      <div className="pagination">
        <div className="d-inline-block text-left" style={{width: '50%'}}>
          <select name="itemsPerPage"
              onChange={(e) => this.props.onChangeItemsPerPage(parseInt(e.target.value, 10))}
              value={this.props.itemsPerPage}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
          &nbsp;
          <span>items</span>
          &nbsp;
          {((this.props.currentPage - 1) * this.props.itemsPerPage) + 1}
          &nbsp;
          <span>-</span>
          &nbsp;
          {
            this.props.currentPage === lastPage ?
              this.props.dataLength
              :
              ((this.props.currentPage - 1) * this.props.itemsPerPage) + this.props.itemsPerPage
          }
          &nbsp;[of&nbsp;{this.props.dataLength}&nbsp;items]
        </div>
        <div className="d-inline-block text-right" style={{width: '50%'}}>
          <span>page&nbsp;
            {
              lastPage > 1 ?
                <select
                    onChange={(e) => this.props.onChangePage(parseInt(e.target.value, 10))}
                    value={this.props.currentPage}>
                  {arrPages.map(p => <option key={'page-' + p} value={p}>{p}</option>)}
                </select>
                : lastPage
            }
            &nbsp;of {lastPage}
          </span>
          &nbsp;
          <div className="d-inline-block button-group">
            <button disabled={this.props.currentPage > 1 ? '' : 'disabled'}
                onClick={() => this.props.onChangePage(parseInt(1, 10))}>First</button>
            <button disabled={this.props.currentPage > 1 ? '' : 'disabled'}
                onClick={() => this.props.onChangePage(parseInt(this.props.currentPage - 1, 10))}>Prev</button>
            <button disabled={this.props.currentPage < lastPage ? '' : 'disabled'}
                onClick={() => this.props.onChangePage(parseInt(this.props.currentPage + 1, 10))}>Next</button>
            <button disabled={this.props.currentPage < lastPage ? '' : 'disabled'}
                onClick={() => this.props.onChangePage(parseInt(lastPage, 10))}>Last</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Pagination;