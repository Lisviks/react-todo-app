import React from 'react';

const ThemeSwitch = ({ switchTheme, currentTheme }) => {
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

export default ThemeSwitch;
