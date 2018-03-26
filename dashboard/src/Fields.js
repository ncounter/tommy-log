import React, { Component } from 'react';

export class TextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue
    };

    ['handleChange']
      .forEach(method => this[method] = this[method].bind(this));
  }

  handleChange(e) {
    this.setState({value: e.target.value});
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div className={'form-field-wrapper ' + this.props.classStyle} >
        <label>{this.props.label}</label>
        <input
            type={this.props.type}
            name={this.props.name}
            value={this.state.value}
            onChange={this.handleChange}
            placeholder={this.props.placeholder}
        />
      </div>
    )
  }
}

export class Toggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.initialValue
    };

    ['handleChange']
      .forEach(method => this[method] = this[method].bind(this));
  }

  handleChange() {
    const checkedNow = !this.state.checked;
    this.setState({checked: checkedNow});
    this.props.onChange(checkedNow);
  }

  render() {
    return (
      <div className={'form-field-wrapper ' + this.props.classStyle} >
        <label for={this.props.name}>{this.props.label}</label>
        <input
            type='checkbox'
            id={this.props.name}
            name={this.props.name}
            checked={this.state.checked ? 'checked' : ''}
            onChange={this.handleChange}
        />
      </div>
    )
  }
}
