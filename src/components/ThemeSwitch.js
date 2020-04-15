import React from 'react';

const ThemeSwitch = ({ switchTheme, theme }) => {
  return (
    <div className='switch'>
      <label>
        Dark
        <input
          type='checkbox'
          onChange={switchTheme}
          checked={theme === 'light' ? true : false}
        />
        <span className='lever'></span>
        Light
      </label>
    </div>
  );
};

export default ThemeSwitch;
