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
          show: '',
          hide: '',
        },
      patternCriteriaOut: '',
      isLoading: false
    };

    ['filterInOutChange', 'filterData']
      .forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    this.props.setTitle('Which known routes have been hit the most, and which never?');
  }

  componentDidMount() {
    let url = 'known-urls.json';

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
    if (this.state.criteria.show.length > 0) {
      try {
        data = data.filter(d => d.match(this.state.criteria.show));
      }
      catch (Exception){
        console.log('Invalid regex [' + Exception + ']');
      }
    }
    if (this.state.criteria.hide.length > 0) {
      try {
        data = data.filter(d => !d.match(this.state.criteria.hide));
      }
      catch (Exception) {
        console.log('Invalid regex [' + Exception + ']');
      }
    }
    return data;
  }

  sort(rawData) {
    return rawData.sort((d1, d2) => d1.toLowerCase() > d2.toLowerCase())
  }

  render() {
    return (
      <div className="patterns">
        <aside>
          <h3>Filters</h3>
          <TextInput
              type='text'
              name='criteriaShow'
              initialValue={this.state.criteria.show}
              placeholder='[use regex]'
              onChange={(value) => this.filterInOutChange(value, 'show')}
              label={'Show rows with "URL" matching'}
              classStyle={'d-inline-block ' + (Utils.validateRegEx(this.state.criteria.show) ? '' : 'error')}
          />
          <TextInput
              type='text'
              name='criteriaHide'
              initialValue={this.state.criteria.hide}
              placeholder='[use regex]'
              onChange={(value) => this.filterInOutChange(value, 'hide')}
              label={'Hide rows with "URL" matching'}
              classStyle={'d-inline-block ' + (Utils.validateRegEx(this.state.criteria.hide) ? '' : 'error')}
          />
        </aside>
        <section>
          <Table
              dataKey={(datum) => datum}
              rawData={this.filterData(this.state.data)}
              sort={this.sort}
              loading={this.state.isLoading}
              headers={[
                <th key="th-from">Url</th>
              ]}
          >
            {/* ["url"] */}
            <Col data={(datum) => datum} width='100%' />
          </Table>
        </section>
      </div>
    );
  }
}

export default Patterns;
