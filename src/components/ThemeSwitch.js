import React from 'react';

const ThemeSwitch = () => {
  return (
    <div className='theme-switch'>
      <span>Light</span>
      <label className='switch'>
        <input type='checkbox' />
        <span className='slider'></span>
      </label>
      <span>Dark</span>
    </div>
  );
};

export default ThemeSwitch;
