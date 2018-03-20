import React, { Component } from 'react';

class Loading extends Component {
  render() {
    return (
      <div className="loading">
        <img className="icon" src="/loading.gif" alt={this.props.altText} />
      </div>
    )
  }
}

export default Loading;
