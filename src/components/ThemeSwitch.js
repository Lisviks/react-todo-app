import React from 'react';
import { connect } from 'react-redux';
import { setTheme } from '../actions/themeActions';

const ThemeSwitch = ({ theme, setTheme }) => {
  const currentTheme = () => {
    if (theme === 'light') return false;
    return true;
  };

  const switchTheme = () => {
    let newTheme;
    if (theme === 'light') newTheme = 'dark';
    if (theme === 'dark') newTheme = 'light';
    setTheme(newTheme);
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

const mapDispatchToProps = { setTheme };

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSwitch);
