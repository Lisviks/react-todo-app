import React, { Component } from 'react';

class PageLimit extends Component {
  state = {
    pageLimit: 5,
  };

  handleChange = (e) => {
    this.setState({ pageLimit: e.target.value });
  };

  handleClick = () => {
    this.props.setPageLimit(+this.state.pageLimit);
  };

  render() {
    return (
      <div className='change-page-limit'>
        <span>Change page limit: </span>
        <input
          type='number'
          className='page-limit'
          min='5'
          max='20'
          value={this.state.pageLimit}
          onChange={this.handleChange}
        />
        <button className='btn' onClick={this.handleClick}>
          Change
        </button>
      </div>
    );
  }
}

export default PageLimit;
