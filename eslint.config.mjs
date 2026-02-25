import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';

const config = [
  ...nextVitals,
  prettier,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
];

export default config;
