export const loadTheme = () => {
  const theme = localStorage.getItem('theme') || 'light';

  if (theme === 'dark') {
    document.querySelector('body').classList = 'dark';
  } else if (theme === 'light') {
    document.querySelector('body').classList = 'light';
  }

  return { type: 'SET_THEME', payload: { theme } };
};

export const setTheme = (theme) => {
  localStorage.setItem('theme', theme);

  return { type: 'SET_THEME', payload: { theme } };
};
