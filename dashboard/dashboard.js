const Dashboard = React.createClass({
  getInitialState: function() {
    return {
      data: null
    }
  },

  componentDidMount: function() {
    let url = 'stats.json';

    fetch(url)
    .then(res => res.json())
    .then((jsonData) => {
      this.setState({ data: jsonData });
    })
    .catch(err => { throw err });
  },

  render: function() {
    const serverData = this.state.data;
    return (
      <div>
        <div>{ serverData ? 'loaded' : 'not loaded yet' }</div>
        <table>
          <thead>
            <tr>
              <th>url</th>
              <th>count</th>
            </tr>
          </thead>
          <tbody>
            {
              serverData ?
              Object.keys(serverData).map(k => <tr key={k}><td>{k}</td><td className='center'>{serverData[k]}</td></tr>)
              : null
            }
          </tbody>
        </table>
      </div>
    );
  }
});

ReactDOM.render(
  <Dashboard />,
  document.getElementById('dashboard')
);
