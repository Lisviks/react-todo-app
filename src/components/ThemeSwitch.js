import React from 'react';
import { connect } from 'react-redux';

const ThemeSwitch = ({ switchTheme, theme }) => {
  const currentTheme = () => {
    if (theme === 'light') return false;
    return true;
  };

  return (
    <div className='theme-switch'>
      <span>Light</span>
      <label className='switch'>
        <input
          type='checkbox'
          onChange={switchTheme}
          checked={currentTheme()}
        />
        <span className='slider'></span>
      </label>
      <span>Dark</span>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { theme: state.theme.theme };
};

export default connect(mapStateToProps)(ThemeSwitch);
