import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setPageLimit } from '../actions/todosActions';

class PageLimit extends Component {
  state = {
    pageLimit: 5,
  };

  handleChange = (e) => {
    this.setState({ pageLimit: e.target.value });
  };

  handleClick = () => {
    let pageLimit = 5;
    if (this.state.pageLimit < 5) {
      pageLimit = 5;
    } else if (this.state.pageLimit > 20) {
      pageLimit = 20;
    } else {
      pageLimit = this.state.pageLimit;
    }

    this.props.setPageLimit(+pageLimit);
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

const mapDispatchToProps = {
  setPageLimit,
};

export default connect(null, mapDispatchToProps)(PageLimit);
